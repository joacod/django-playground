import React, { useState } from 'react'
import { createOrder } from '../services/pizzaService'

function CreateOrderForm({ pizzas }) {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [selectedPizza, setSelectedPizza] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [items, setItems] = useState([])
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const addItem = (e) => {
    e.preventDefault()
    if (!selectedPizza || quantity < 1) return
    setItems([...items, { pizza: selectedPizza, quantity }])
    setSelectedPizza('')
    setQuantity(1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    if (!email && !phone) {
      setError('Email or phone is required')
      return
    }
    if (items.length === 0) {
      setError('Add at least one pizza to the order')
      return
    }
    try {
      await createOrder({ email, phone, items })
      setSuccess(true)
      setEmail('')
      setPhone('')
      setItems([])
    } catch {
      setError('Failed to create order (check customer and pizza info)')
    }
  }

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Create Order</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="flex gap-2 flex-wrap">
          <input
            className="border border-gray-700 rounded px-2 py-1 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            type="email"
            placeholder="Customer email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            className="border border-gray-700 rounded px-2 py-1 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            type="text"
            placeholder="Customer phone"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          <select
            className="border border-gray-700 rounded px-2 py-1 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            value={selectedPizza}
            onChange={e => setSelectedPizza(e.target.value)}
          >
            <option value="">Select pizza</option>
            {pizzas.map(p => (
              <option key={p.id} value={p.name}>{p.name}</option>
            ))}
          </select>
          <input
            className="border border-gray-700 rounded px-2 py-1 w-20 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            type="number"
            min={1}
            value={quantity}
            onChange={e => setQuantity(Number(e.target.value))}
          />
          <button className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white transition-colors" onClick={addItem}>
            Add to Order
          </button>
        </div>
        <div className="mb-2">
          {items.length > 0 && (
            <ul className="list-disc ml-6">
              {items.map((item, idx) => (
                <li key={idx}>{item.quantity} x {item.pizza}</li>
              ))}
            </ul>
          )}
        </div>
        <button className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-white transition-colors" type="submit">
          Create Order
        </button>
      </form>
      {error && <div className="text-red-400 mt-1">{error}</div>}
      {success && <div className="text-green-400 mt-1">Order created!</div>}
    </div>
  )
}

export default CreateOrderForm 