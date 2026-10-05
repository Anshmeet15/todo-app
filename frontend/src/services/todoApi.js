import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

export async function getTodos() {
  const { data } = await api.get('/todos/')
  return data
}

export async function getTodo(id) {
  const { data } = await api.get(`/todos/${id}/`)
  return data
}

export async function createTodo(todo) {
  const { data } = await api.post('/todos/', todo)
  return data
}

export async function updateTodo(id, todo) {
  const { data } = await api.put(`/todos/${id}/`, todo)
  return data
}

export async function toggleTodo(id, completed) {
  const { data } = await api.patch(`/todos/${id}/`, { completed })
  return data
}

export async function deleteTodo(id) {
  await api.delete(`/todos/${id}/`)
}

export default api
