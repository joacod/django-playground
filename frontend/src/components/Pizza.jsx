import React, { useEffect, useState } from 'react'
import AddCustomerForm from './AddCustomerForm'
import AddPizzaForm from './AddPizzaForm'
import DeletePizzaForm from './DeletePizzaForm'
import CreateOrderForm from './CreateOrderForm'
import PizzaReports from './PizzaReports'
import { getPizzas, addPizza, deletePizza } from '../services/pizzaService'

function Pizza() {
  const [pizzas, setPizzas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
      {loading && <div>Loading pizzas...</div>}
      {error && <div className="text-red-400">{error}</div>}
      <AddCustomerForm />
      <AddPizzaForm onAddPizza={handleAddPizza} />
      <DeletePizzaForm pizzas={pizzas} onDeletePizza={handleDeletePizza} />
      <CreateOrderForm pizzas={pizzas} />
      <PizzaReports />
    </div>
  )
}

export default Pizza
