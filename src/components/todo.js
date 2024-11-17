"use client";
import React, { useState, useEffect } from "react";
import "./todo.css";
import {
  useCreateRequestTodoMutation,
  useDeleteRequestTodoMutation,
  useGetRequestTodosQuery,
  useUpdateRequestIsCompletedMutation,
  useUpdateRequestTodoMutation,
} from "@/store/features/todo/requestTodoSlice";

export default function Todo() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [list, setList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTask, setEditTask] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  const { data: todo, isError: todoError, isLoading: todoLoading } = useGetRequestTodosQuery();

  useEffect(() => {
    setList(todo);
     // Ensure tasks are updated from the data
     if (todo) {
      setTasks(todo.data || []);
    }
  }, [todo]);

  const [insertTodo] = useCreateRequestTodoMutation();
  const [deleteTodo] = useDeleteRequestTodoMutation();
  const [updateTodo] = useUpdateRequestTodoMutation();
  const [isCompletedTodo] = useUpdateRequestIsCompletedMutation();

  const addTask = async () => {
    if (task.trim() === "") {
      window.alert("Please write down a task");
      return;
    }
     // Check if a task with the same text already exists
  const isDuplicate = tasks.some((t) => t.todo.toLowerCase() === task.toLowerCase());
  if (isDuplicate) {
    window.alert("Task already exists. Please write a different task.");
    return;
  }

    try {
      const newTask = await insertTodo({ todo: task, isCompleted: false }).unwrap();
      setTasks((prevTasks) => [...prevTasks, newTask]);
      setTask("");
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  const toggleTaskCompletion = async (uuid, isCompleted) => {
    try {
      const updatedCompletionStatus = !isCompleted;
      await isCompletedTodo({ uuid, isCompleted: updatedCompletionStatus }).unwrap();
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.uuid === uuid ? { ...task, isCompleted: updatedCompletionStatus } : task
        )
      );
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const deleteTask = async (uuid) => {
    try {
      await deleteTodo(uuid).unwrap();
      setTasks((prevTasks) => prevTasks.filter((task) => task.uuid !== uuid));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const startEditing = (uuid, currentTask) => {
    setIsEditing(true);
    setEditTaskId(uuid);
    setEditTask(currentTask);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditTaskId(null);
    setEditTask("");
  };

  const handleEditChange = (e) => {
    setEditTask(e.target.value);
  };

  const saveTask = async () => {
    try {
      await updateTodo({ uuid: editTaskId, todo: editTask }).unwrap();
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.uuid === editTaskId ? { ...task, todo: editTask } : task
        )
      );
      cancelEditing();
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredTasks = list?.data?.filter((t) =>
    t.todo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (todoLoading) {
    return (
      <div className="loading-container">
        <div className="loading-message">Loading...</div>
        <div className="spinner"></div>
      </div>
    );
  }
  

  if (todoError) {
    return <div>Error loading tasks!</div>;
  }

  return (
    <div className="todo-container">
      <div className="header">
        <h1>To Do List</h1>
      </div>

      <div className="todo-form">
        <input
          type="text"
          className="input-item"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Add Task"
        />
        <button className="input-button" onClick={addTask}>
          Add
        </button>
      </div>

      <div className="search-form">
        <input
          type="text"
          className="search-item"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search tasks..."
        />
      </div>

      <h2>Task List</h2>
      <ul className="list-container">
        {filteredTasks && filteredTasks.length > 0 ? (
          filteredTasks.map((t) => (
            <li key={t.uuid} className="task-item">
              {isEditing && editTaskId === t.uuid ? (
                <div className="edit-form">
                  <input
                    type="text"
                    value={editTask}
                    onChange={handleEditChange}
                  />
                  <button className="primary-save" onClick={saveTask}>Save</button>
                  <button onClick={cancelEditing}>Cancel</button>
                </div>
              ) : (
                <>
                  <label>
                    <input
                      type="checkbox"
                      checked={t.isCompleted}
                      onChange={() => toggleTaskCompletion(t.uuid, t.isCompleted)}
                    />
                    <span className={t.isCompleted ? "completed" : ""}>
                      {t.todo ? t.todo : "N/A"}
                    </span>
                  </label>
                  <button className="edit-btn" onClick={() => startEditing(t.uuid, t.todo)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => deleteTask(t.uuid)}>
                    Delete
                  </button>
                </>
              )}
            </li>
          ))
        ) : (
          <div className="no-tasks-message">No result. Create a new one instead!</div>
        )}
      </ul>
    </div>
  );
}
