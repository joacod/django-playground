import { useEffect, useState } from 'react'
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from '../services/todoService'

function TodoList() {
  const [todos, setTodos] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [editId, setEditId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editCompleted, setEditCompleted] = useState(false)

  useEffect(() => {
    getTodos().then(setTodos)
  }, [])

  const handleAdd = async () => {
    if (!newTitle.trim()) return
    await createTodo({
      title: newTitle,
      description: newDescription,
      completed: false,
    })
    const updatedTodos = await getTodos()
    setTodos(updatedTodos)
    setNewTitle('')
    setNewDescription('')
  }

  const handleToggle = async (todo) => {
    const updated = await updateTodo(todo.id, {
      ...todo,
      completed: !todo.completed,
    })
    setTodos(todos.map((t) => (t.id === todo.id ? updated : t)))
  }

  const handleDelete = async (id) => {
    await deleteTodo(id)
    setTodos(todos.filter((t) => t.id !== id))
  }

  const handleEdit = (todo) => {
    setEditId(todo.id)
    setEditTitle(todo.title)
    setEditDescription(todo.description || '')
    setEditCompleted(todo.completed)
  }

  const handleEditSave = async (todo) => {
    const updated = await updateTodo(todo.id, {
      ...todo,
      title: editTitle,
      description: editDescription,
      completed: editCompleted,
    })
    setTodos(todos.map((t) => (t.id === todo.id ? updated : t)))
    setEditId(null)
    setEditTitle('')
    setEditDescription('')
    setEditCompleted(false)
  }

  const handleEditCancel = () => {
    setEditId(null)
    setEditTitle('')
    setEditDescription('')
    setEditCompleted(false)
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-100">Todo List</h1>
      <div className="flex mb-4 gap-2">
        <input
          className="border border-gray-700 bg-gray-800 text-gray-100 placeholder-gray-400 p-2 flex-1 focus:ring-2 focus:ring-blue-600"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Add a new todo title"
        />
        <input
          className="border border-gray-700 bg-gray-800 text-gray-100 placeholder-gray-400 p-2 flex-1 focus:ring-2 focus:ring-blue-600"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          placeholder="Add a description (optional)"
        />
        <button
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow"
          onClick={handleAdd}
        >
          Add
        </button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex flex-col border-b border-gray-700 py-2 gap-1 bg-gray-800 rounded mb-2 shadow-sm"
          >
            <div className="flex items-center justify-between">
              {editId === todo.id ? (
                <>
                  <input
                    className="border border-gray-600 p-1 flex-1 mr-2 bg-gray-900 text-gray-100 focus:ring-2 focus:ring-blue-600"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <input
                    type="checkbox"
                    className="ml-2 accent-blue-600"
                    checked={
                      editId === todo.id ? editCompleted : todo.completed
                    }
                    onChange={(e) => setEditCompleted(e.target.checked)}
                  />
                  <span className="ml-1 text-sm text-gray-300">Completed</span>
                  <button
                    className="text-green-300 bg-gray-700 border border-green-400 rounded px-2 py-1 ml-2 hover:bg-green-700 hover:text-white"
                    onClick={() => handleEditSave(todo)}
                  >
                    Save
                  </button>
                  <button
                    className="text-gray-300 bg-gray-700 border border-gray-500 rounded px-2 py-1 ml-2 hover:bg-gray-600"
                    onClick={handleEditCancel}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span
                    className={`flex-1 cursor-pointer ${
                      todo.completed
                        ? 'line-through text-gray-500'
                        : 'text-gray-100'
                    }`}
                    onClick={() => handleToggle(todo)}
                  >
                    {todo.title}
                  </span>
                  <button
                    className="ml-2 text-blue-400 hover:text-blue-200"
                    onClick={() => handleEdit(todo)}
                  >
                    Edit
                  </button>
                  <button
                    className="ml-2 text-red-400 hover:text-red-200"
                    onClick={() => handleDelete(todo.id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
            <div className="flex flex-col text-sm text-gray-400 ml-2">
              {editId === todo.id ? (
                <textarea
                  className="border border-gray-600 p-1 mt-1 bg-gray-900 text-gray-100 focus:ring-2 focus:ring-blue-600"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={2}
                />
              ) : (
                <span>Description: {todo.description || <em>None</em>}</span>
              )}
              <span>Completed: {todo.completed ? 'Yes' : 'No'}</span>
              <span>Created: {new Date(todo.created_at).toLocaleString()}</span>
              <span>Updated: {new Date(todo.updated_at).toLocaleString()}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TodoList
