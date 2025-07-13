import React, { useState } from 'react'

function DeletePizzaForm({ pizzas, onDeletePizza }) {
  const [selected, setSelected] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleDelete = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    if (!selected) {
      setError('Select a pizza to delete')
      return
    }
    try {
      const ok = await onDeletePizza(selected)
      if (ok) {
        setSuccess(true)
        setSelected('')
      } else {
        setError('Failed to delete pizza')
        setSuccess(false)
      }
    } catch (err) {
      setError(err.message)
      setSuccess(false)
    }
  }

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Delete Pizza</h3>
      <form onSubmit={handleDelete} className="flex gap-2 items-center">
        <select
          className="border border-gray-700 rounded px-2 py-1 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          value={selected}
          onChange={(e) => {
            setSelected(e.target.value)
            setError(null)
            setSuccess(false)
          }}
        >
          <option value="">Select pizza</option>
          {pizzas.map((p) => (
            <option key={p.id} value={p.name}>
              {p.name}
            </option>
          ))}
        </select>
        <button
          className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white transition-colors"
          type="submit"
        >
          Delete
        </button>
      </form>
      {error && <div className="text-red-400 mt-1">{error}</div>}
      {success && <div className="text-green-400 mt-1">Pizza deleted!</div>}
    </div>
  )
}

export default DeletePizzaForm
