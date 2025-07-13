import React, { useState } from 'react'

function AddPizzaForm({ onAddPizza }) {
  const [name, setName] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    if (!name.trim()) {
      setError('Pizza name is required')
      return
    }
    try {
      const ok = await onAddPizza(name.trim())
      if (ok) {
        setSuccess(true)
        setName('')
      } else {
        setError('Pizza already exists or failed to add')
        setSuccess(false)
      }
    } catch (err) {
      setError(err.message)
      setSuccess(false)
    }
  }

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Add Pizza</h3>
      <form onSubmit={handleSubmit} className="flex gap-2 items-center">
        <input
          className="border border-gray-700 rounded px-2 py-1 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          type="text"
          placeholder="Pizza name"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            setError(null)
            setSuccess(false)
          }}
        />
        <button
          className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-white transition-colors"
          type="submit"
        >
          Add
        </button>
      </form>
      {error && <div className="text-red-400 mt-1">{error}</div>}
      {success && <div className="text-green-400 mt-1">Pizza added!</div>}
    </div>
  )
}

export default AddPizzaForm
