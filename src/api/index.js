import axios from 'axios'

const api = axios.create({
  baseURL: 'https://morpionapi.edu.netlor.fr',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `key=${import.meta.env.MORPION_API_KEY}`,
  },
})

export default api
