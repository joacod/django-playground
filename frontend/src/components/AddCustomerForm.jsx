import React, { useState } from 'react'
import { addCustomer } from '../services/pizzaService'

function AddCustomerForm() {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setLoading(true)
    if (!email || !phone) {
      setError('Both email and phone are required')
      setLoading(false)
      return
    }
    try {
      await addCustomer({ email, phone })
      setSuccess(true)
      setEmail('')
      setPhone('')
    } catch (err) {
      setError(err?.message || 'Failed to add customer (duplicate or invalid)')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Add Customer</h3>
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 items-center flex-wrap"
      >
        <input
          className="border border-gray-700 rounded px-2 py-1 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border border-gray-700 rounded px-2 py-1 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white transition-colors disabled:opacity-50"
          type="submit"
          disabled={!email || !phone || loading}
        >
          {loading ? 'Adding...' : 'Add'}
        </button>
      </form>
      {error && <div className="text-red-400 mt-1">{error}</div>}
      {success && <div className="text-green-400 mt-1">Customer added!</div>}
    </div>
  )
}

export default AddCustomerForm
