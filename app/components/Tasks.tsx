"use client";

import { useState } from "react";
import { Plus, Trash2, CheckCircle2 } from "lucide-react";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export default function Tasks() {
  const [tasks, setTasks, loaded] = useLocalStorage<Task[]>("loomio-tasks", []);
  const [newTask, setNewTask] = useState("");

  function addTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = newTask.trim();
    if (!title) return;

    setTasks((previous) => [
      ...previous,
      { id: crypto.randomUUID(), title, completed: false },
    ]);
    setNewTask("");
  }

  function toggleTask(id: string) {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }

  function deleteTask(id: string) {
    setTasks((previous) => previous.filter((task) => task.id !== id));
  }

  if (!loaded) return null;

  const completedCount = tasks.filter((task) => task.completed).length;

  return (
    <section className="widget tasks-widget">
      <div className="widget-heading">
        <div className="widget-title">
          <CheckCircle2 size={19} />
          <h2>My Tasks</h2>
        </div>
        <span>{completedCount}/{tasks.length} done</span>
      </div>

      <form className="add-task-form" onSubmit={addTask}>
        <input
          value={newTask}
          onChange={(event) => setNewTask(event.target.value)}
          placeholder="Add a new task..."
          aria-label="New task"
          maxLength={100}
        />
        <button type="submit" aria-label="Add task" title="Add task">
          <Plus size={19} />
        </button>
      </form>

      <div className="task-list">
        {tasks.map((task) => (
          <div className="task-item" key={task.id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
              aria-label={`Mark ${task.title} as ${
                task.completed ? "not completed" : "completed"
              }`}
            />
            <span className={task.completed ? "completed" : ""}>
              {task.title}
            </span>
            <button
              type="button"
              onClick={() => deleteTask(task.id)}
              aria-label={`Delete ${task.title}`}
              className="delete-button"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}

        {tasks.length === 0 && (
          <p className="empty-message">No tasks yet. Add your first task!</p>
        )}
      </div>
    </section>
  );
}
