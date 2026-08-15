'use client';

import { useEffect, useState } from 'react';
import { Todo } from '@/types/todo';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    const res = await fetch(`${API_URL}/todos`);
    const data = await res.json();
    setTodos(data);
    setLoading(false);
  }

  async function addTodo(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;

    await fetch(`${API_URL}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle }),
    });

    setNewTitle('');
    fetchTodos();
  }

  async function toggleTodo(todo: Todo) {
    await fetch(`${API_URL}/todos/${todo._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !todo.completed }),
    });

    fetchTodos();
  }

  async function deleteTodo(id: string) {
    await fetch(`${API_URL}/todos/${id}`, {
      method: 'DELETE',
    });

    fetchTodos();
  }

  if (loading) return <main className="p-8">Loading...</main>;

  return (
    <main className="max-w-md mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>

      <form onSubmit={addTodo} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Add a new todo..."
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </form>

      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo._id}
            className="flex items-center justify-between border rounded px-3 py-2"
          >
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo)}
              />
              <span className={todo.completed ? 'line-through text-gray-400' : ''}>
                {todo.title}
              </span>
            </label>
            <button
              onClick={() => deleteTodo(todo._id)}
              className="text-red-500 text-sm"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}