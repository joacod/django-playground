const API_URL = 'http://localhost:8000/api/pizzas/'
const REPORTS_URL = 'http://localhost:8000/api/reports/'
const CUSTOMERS_URL = 'http://localhost:8000/api/customers/'
const ORDERS_URL = 'http://localhost:8000/api/orders/'

export async function getPizzas() {
  const response = await fetch(API_URL)
  return response.json()
}

export async function addPizza(pizza) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pizza),
  })
  return response.json()
}

export async function deletePizza(name) {
  await fetch(`${API_URL}${encodeURIComponent(name)}/`, { method: 'DELETE' })
}

export async function getMostSoldPizza(month, year) {
  const response = await fetch(
    `${REPORTS_URL}most-sold-pizza/?month=${month}&year=${year}`
  )
  return response.json()
}

export async function getCustomerOfTheYear(year) {
  const response = await fetch(
    `${REPORTS_URL}customer-of-the-year/?year=${year}`
  )
  return response.json()
}

export async function addCustomer(customer) {
  const response = await fetch(CUSTOMERS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(customer),
  })
  return response.json()
}

export async function createOrder(order) {
  const response = await fetch(ORDERS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  })
  return response.json()
}
