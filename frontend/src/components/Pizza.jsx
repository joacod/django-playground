import React, { useEffect, useState } from 'react'
import AddCustomerForm from './AddCustomerForm'
import AddPizzaForm from './AddPizzaForm'
import DeletePizzaForm from './DeletePizzaForm'
import CreateOrderForm from './CreateOrderForm'
import PizzaReports from './PizzaReports'
import { getPizzas, addPizza, deletePizza } from '../services/pizzaService'

const TABS = [
  { key: 'list', label: 'Pizza List' },
  { key: 'pizzas', label: 'Pizzas' },
  { key: 'customer', label: 'Customers' },
  { key: 'order', label: 'Orders' },
  { key: 'reports', label: 'Reports' },
]

function Pizza() {
  const [pizzas, setPizzas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tab, setTab] = useState('list')

  const refreshPizzas = async () => {
    setLoading(true)
    try {
      const data = await getPizzas()
      setPizzas(data)
      setError(null)
    } catch {
      setError('Failed to load pizzas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshPizzas()
  }, [])

  const handleAddPizza = async (name) => {
    try {
      await addPizza({ name })
      refreshPizzas()
      return true
    } catch {
      return false
    }
  }

  const handleDeletePizza = async (name) => {
    try {
      await deletePizza(name)
      refreshPizzas()
      return true
    } catch {
      return false
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Pizza Orders</h2>
      <div className="flex gap-2 mb-6">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`px-4 py-2 rounded-t bg-gray-800 text-white border-b-2 transition-colors ${
              tab === t.key
                ? 'border-green-400 bg-gray-900 font-bold'
                : 'border-transparent hover:bg-gray-700'
            }`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'list' && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Available Pizzas</h3>
          {loading ? (
            <div>Loading pizzas...</div>
          ) : error ? (
            <div className="text-red-400">{error}</div>
          ) : pizzas.length === 0 ? (
            <div className="text-gray-400">No pizzas available.</div>
          ) : (
            <table className="w-full text-left bg-gray-800 rounded">
              <thead>
                <tr>
                  <th className="py-2 px-3">Name</th>
                </tr>
              </thead>
              <tbody>
                {pizzas.map((p) => (
                  <tr key={p.id} className="border-t border-gray-700">
                    <td className="py-1 px-3 text-white">{p.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
      {tab === 'pizzas' && (
        <div>
          <AddPizzaForm onAddPizza={handleAddPizza} />
          <DeletePizzaForm pizzas={pizzas} onDeletePizza={handleDeletePizza} />
        </div>
      )}
      {tab === 'customer' && <AddCustomerForm />}
      {tab === 'order' && <CreateOrderForm pizzas={pizzas} />}
      {tab === 'reports' && <PizzaReports />}
    </div>
  )
}

export default Pizza
