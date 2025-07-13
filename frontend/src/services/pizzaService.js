const API_URL = 'http://localhost:8000/api/pizzas/'
const REPORTS_URL = 'http://localhost:8000/api/reports/'
const CUSTOMERS_URL = 'http://localhost:8000/api/customers/'
const ORDERS_URL = 'http://localhost:8000/api/orders/'

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    // Try to extract error message from backend
    const errorMsg =
      typeof data === 'object' && data !== null
        ? Object.values(data).flat().join(' ') || response.statusText
        : response.statusText
    throw new Error(errorMsg)
  }
  return data
}

export async function getPizzas() {
  const response = await fetch(API_URL)
  return handleResponse(response)
}

export async function addPizza(pizza) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pizza),
  })
  return handleResponse(response)
}

export async function deletePizza(name) {
  const response = await fetch(`${API_URL}${encodeURIComponent(name)}/`, {
    method: 'DELETE',
  })
  if (!response.ok && response.status !== 204) {
    throw new Error('Failed to delete pizza')
  }
}

export async function getMostSoldPizza(month, year) {
  const response = await fetch(
    `${REPORTS_URL}most-sold-pizza/?month=${month}&year=${year}`
  )
  return handleResponse(response)
}

export async function getCustomerOfTheYear(year) {
  const response = await fetch(
    `${REPORTS_URL}customer-of-the-year/?year=${year}`
  )
  return handleResponse(response)
}

export async function addCustomer(customer) {
  const response = await fetch(CUSTOMERS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(customer),
  })
  return handleResponse(response)
}

export async function createOrder(order) {
  const response = await fetch(ORDERS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  })
  return handleResponse(response)
}
