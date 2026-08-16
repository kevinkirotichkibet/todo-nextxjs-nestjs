'use client';

import { useEffect, useState } from 'react';
import { Todo } from '@/types/todo';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

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

  function startEdit(todo: Todo) {
    setEditingId(todo._id);
    setEditTitle(todo.title);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditTitle('');
  }

  async function saveEdit(id: string) {
    if (!editTitle.trim()) return;

    await fetch(`${API_URL}/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editTitle }),
    });

    setEditingId(null);
    setEditTitle('');
    fetchTodos();
  }

  if (loading) {
    return (
      <main className="max-w-md mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">Todo List</h1>
        <div className="flex gap-2 mb-6">
          <div className="flex-1 h-10 bg-gray-800 rounded animate-pulse" />
          <div className="w-16 h-10 bg-gray-800 rounded animate-pulse" />
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gray-800 rounded animate-pulse" />
          ))}
        </div>
      </main>
    );
  }

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
          className="bg-black text-white px-4 py-2 rounded transition hover:bg-gray-800"
        >
          Add
        </button>
      </form>

      {todos.length === 0 ? (
        <div className="text-center text-gray-400 py-8 border rounded">
          <p className="text-lg">No todos yet</p>
          <p className="text-sm">Add one above to get started</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {todos.map((todo) => (
            <li
              key={todo._id}
              className="flex items-center justify-between border rounded px-3 py-2 animate-fade-in"
            >
              {editingId === todo._id ? (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit(todo._id);
                      if (e.key === 'Escape') cancelEdit();
                    }}
                    autoFocus
                    className="flex-1 border rounded px-2 py-1"
                  />
                  <button
                    onClick={() => saveEdit(todo._id)}
                    className="text-green-500 text-sm transition hover:text-green-400"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="text-gray-400 text-sm transition hover:text-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <label className="flex items-center gap-2 flex-1">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo)}
                    />
                    <span
                      className={
                        todo.completed ? 'line-through text-gray-400' : ''
                      }
                    >
                      {todo.title}
                    </span>
                  </label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => startEdit(todo)}
                      className="text-blue-500 text-sm transition hover:text-blue-400"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTodo(todo._id)}
                      className="text-red-500 text-sm transition hover:text-red-400"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}