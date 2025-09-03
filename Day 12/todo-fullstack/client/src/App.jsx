import React, { useEffect, useState } from 'react'

const API_URL = 'http://localhost:5000'

export default function App() {
  const [todos, setTodos] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function fetchTodos() {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`${API_URL}/todos`)
      if (!res.ok) throw new Error('Failed to fetch todos')
      const data = await res.json()
      setTodos(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  async function addTodo(e) {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    try {
      setError(null)
      const res = await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: trimmed })
      })
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || 'Failed to add todo')
      }
      const created = await res.json()
      setTodos(prev => [created, ...prev])
      setText('')
    } catch (err) {
      setError(err.message)
    }
  }

  async function deleteTodo(id) {
    try {
      setError(null)
      const res = await fetch(`${API_URL}/todos/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || 'Failed to delete todo')
      }
      await res.json()
      setTodos(prev => prev.filter(t => t.id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 bg-white/70 backdrop-blur border-b">
        <div className="mx-auto max-w-2xl px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">To-Do</h1>
          <a href="https://vitejs.dev" target="_blank" rel="noreferrer" className="text-sm text-gray-500 hover:text-gray-700">React + Vite</a>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="bg-white rounded-2xl shadow p-6">
          <form onSubmit={addTodo} className="flex gap-3">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Add a new task..."
              aria-label="New todo text"
            />
            <button
              type="submit"
              className="rounded-xl px-5 py-3 font-medium border border-transparent bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 transition"
            >
              Add
            </button>
          </form>

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mt-6">
            {loading ? (
              <div className="text-gray-500">Loading...</div>
            ) : todos.length === 0 ? (
              <div className="text-gray-500">No tasks yet. Add your first one above!</div>
            ) : (
              <ul className="space-y-2">
                {todos.map(todo => (
                  <li key={todo.id} className="group flex items-center justify-between rounded-xl border bg-white hover:bg-gray-50 p-3">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-indigo-500" aria-hidden="true"></div>
                      <span className="text-gray-800">{todo.text}</span>
                    </div>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="opacity-80 group-hover:opacity-100 text-sm rounded-lg px-3 py-1.5 border border-gray-300 hover:bg-gray-100"
                      aria-label={`Delete ${todo.text}`}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>

      <footer className="mx-auto max-w-2xl px-4 py-8 text-center text-xs text-gray-500">
        Backend: <code>http://localhost:5000</code> · Frontend: <code>http://localhost:5173</code>
      </footer>
    </div>
  )
}
