import React, { useState } from 'react'
import { getMostSoldPizza, getCustomerOfTheYear } from '../services/pizzaService'

function PizzaReports() {
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [pizzaReport, setPizzaReport] = useState(null)
  const [pizzaError, setPizzaError] = useState(null)
  const [customerYear, setCustomerYear] = useState('')
  const [customerReport, setCustomerReport] = useState(null)
  const [customerError, setCustomerError] = useState(null)

  const handlePizzaReport = async (e) => {
    e.preventDefault()
    setPizzaError(null)
    setPizzaReport(null)
    try {
      const data = await getMostSoldPizza(month, year)
      setPizzaReport(data)
    } catch {
      setPizzaError('No sales found for that month/year')
    }
  }

  const handleCustomerReport = async (e) => {
    e.preventDefault()
    setCustomerError(null)
    setCustomerReport(null)
    try {
      const data = await getCustomerOfTheYear(customerYear)
      setCustomerReport(data)
    } catch {
      setCustomerError('No customer found for that year')
    }
  }

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Pizza Reports</h3>
      <form onSubmit={handlePizzaReport} className="flex gap-2 items-center mb-2 flex-wrap">
        <input
          className="border border-gray-700 rounded px-2 py-1 w-20 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="number"
          placeholder="Month"
          min={1}
          max={12}
          value={month}
          onChange={e => setMonth(e.target.value)}
        />
        <input
          className="border border-gray-700 rounded px-2 py-1 w-24 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="number"
          placeholder="Year"
          value={year}
          onChange={e => setYear(e.target.value)}
        />
        <button className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white transition-colors" type="submit">
          Most Sold Pizza
        </button>
      </form>
      {pizzaError && <div className="text-red-400 mb-2">{pizzaError}</div>}
      {pizzaReport && (
        <div className="mb-2 text-green-400">
          Most sold pizza: <b>{pizzaReport.pizza}</b> ({pizzaReport.total} sold)
        </div>
      )}
      <form onSubmit={handleCustomerReport} className="flex gap-2 items-center mb-2 flex-wrap">
        <input
          className="border border-gray-700 rounded px-2 py-1 w-24 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="number"
          placeholder="Year"
          value={customerYear}
          onChange={e => setCustomerYear(e.target.value)}
        />
        <button className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white transition-colors" type="submit">
          Customer of the Year
        </button>
      </form>
      {customerError && <div className="text-red-400 mb-2">{customerError}</div>}
      {customerReport && (
        <div className="mb-2 text-green-400">
          Customer: <b>{customerReport.email}</b> / <b>{customerReport.phone}</b> ({customerReport.orders} orders)
        </div>
      )}
    </div>
  )
}

export default PizzaReports 