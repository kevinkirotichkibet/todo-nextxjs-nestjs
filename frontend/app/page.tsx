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
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-start justify-center pt-16 px-4">
        <div className="w-full max-w-md bg-slate-900/70 backdrop-blur border border-slate-800 rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-bold mb-6 text-white">Todo List</h1>
          <div className="flex gap-2 mb-6">
            <div className="flex-1 h-11 bg-slate-800 rounded-lg animate-pulse" />
            <div className="w-16 h-11 bg-slate-800 rounded-lg animate-pulse" />
          </div>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-slate-800 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-start justify-center pt-16 px-4">
      <div className="w-full max-w-md bg-slate-900/70 backdrop-blur border border-slate-800 rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold mb-6 text-white">Todo List</h1>

        <form onSubmit={addTodo} className="flex gap-2 mb-6">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Add a new todo..."
            className="flex-1 bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium transition hover:bg-indigo-500 active:scale-95"
          >
            Add
          </button>
        </form>

        {todos.length === 0 ? (
          <div className="text-center text-slate-500 py-10 border border-dashed border-slate-700 rounded-lg">
            <p className="text-base font-medium text-slate-400">No todos yet</p>
            <p className="text-sm">Add one above to get started</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {todos.map((todo) => (
              <li
                key={todo._id}
                className="flex items-center justify-between bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-3 animate-fade-in"
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
                      className="flex-1 bg-slate-900 border border-indigo-500 text-white rounded-md px-2 py-1 outline-none"
                    />
                    <button
                      onClick={() => saveEdit(todo._id)}
                      className="text-emerald-400 text-sm font-medium transition hover:text-emerald-300"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="text-slate-500 text-sm transition hover:text-slate-300"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <label className="flex items-center gap-3 flex-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTodo(todo)}
                        className="w-4 h-4 accent-indigo-500 cursor-pointer"
                      />
                      <span
                        className={
                          todo.completed
                            ? 'line-through text-slate-500'
                            : 'text-slate-100'
                        }
                      >
                        {todo.title}
                      </span>
                    </label>
                    <div className="flex gap-1">
                      <button
                        onClick={() => startEdit(todo)}
                        className="text-amber-400 text-sm font-medium px-2 py-1 rounded-md transition hover:bg-amber-400/10"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTodo(todo._id)}
                        className="text-red-400 text-sm font-medium px-2 py-1 rounded-md transition hover:bg-red-400/10"
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
      </div>
    </main>
  );
}