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
  }

  const handleEditSave = async (todo) => {
    const updated = await updateTodo(todo.id, {
      ...todo,
      title: editTitle,
      description: editDescription,
    })
    setTodos(todos.map((t) => (t.id === todo.id ? updated : t)))
    setEditId(null)
    setEditTitle('')
    setEditDescription('')
  }

  const handleEditCancel = () => {
    setEditId(null)
    setEditTitle('')
    setEditDescription('')
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      <div className="flex mb-4 gap-2">
        <input
          className="border p-2 flex-1"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Add a new todo title"
        />
        <input
          className="border p-2 flex-1"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          placeholder="Add a description (optional)"
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={handleAdd}
        >
          Add
        </button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className="flex flex-col border-b py-2 gap-1">
            <div className="flex items-center justify-between">
              {editId === todo.id ? (
                <>
                  <input
                    className="border p-1 flex-1 mr-2"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <button
                    className="text-green-600 mr-2"
                    onClick={() => handleEditSave(todo)}
                  >
                    Save
                  </button>
                  <button className="text-gray-500" onClick={handleEditCancel}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span
                    className={`flex-1 cursor-pointer ${
                      todo.completed ? 'line-through text-gray-400' : ''
                    }`}
                    onClick={() => handleToggle(todo)}
                  >
                    {todo.title}
                  </span>
                  <button
                    className="ml-2 text-blue-500"
                    onClick={() => handleEdit(todo)}
                  >
                    Edit
                  </button>
                  <button
                    className="ml-2 text-red-500"
                    onClick={() => handleDelete(todo.id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
            <div className="flex flex-col text-sm text-gray-600 ml-2">
              {editId === todo.id ? (
                <textarea
                  className="border p-1 mt-1"
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
