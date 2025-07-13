import TodoList from './components/TodoList'
import { useState } from 'react'

function App() {
  const [page, setPage] = useState('home')

  if (page === 'todo') {
    return (
      <div className="bg-gray-900 min-h-screen text-white">
        <button
          className="m-4 text-blue-400 underline cursor-pointer hover:text-blue-300"
          onClick={() => setPage('home')}
        >
          Back to Home
        </button>
        <TodoList />
      </div>
    )
  }

  return (
    <div className="bg-gray-900 text-white flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Django Playground</h1>
      <p className="mb-6">
        This is the frontend for DRF (Django REST framework) apps
      </p>
      <button
        className="text-blue-400 underline cursor-pointer hover:text-blue-300"
        onClick={() => setPage('todo')}
      >
        Todo List
      </button>
    </div>
  )
}

export default App
