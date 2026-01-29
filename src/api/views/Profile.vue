<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { RouteNames } from '@/router/constants'
import api from '@/api/index'

const router = useRouter()

const name = ref('')
const email = ref('')
const loading = ref(false)
const errors = ref([])
const successMessage = ref(null)

const fetchProfile = async () => {
  loading.value = true
  errors.value = []
  try {
    const response = await api.get('/api/profile')
    name.value = response.data.name
    email.value = response.data.email
  } catch (err) {
    errors.value = ["Erreur lors du chargement du profil."]
  } finally {
    loading.value = false
  }
}

const updateProfile = async () => {
  loading.value = true
  errors.value = []
  successMessage.value = null
  try {
    await api.put('/api/profile', {
      name: name.value,
      email: email.value
    })
    successMessage.value = "Profil mis à jour avec succès !"
  } catch (err) {
    if (err.response.data.errors) {
      errors.value = Object.values(err.response.data.errors).flat()
    } else if (err.response.data.message) {
       errors.value = [err.response.data.message]
    } else {
      errors.value = ["Erreur lors de la mise à jour du profil."]
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProfile()
})
</script>

<template>
  <div class="profile-container">
    <router-link :to="{ name: RouteNames.HOME }" class="close-button">×</router-link>
    <h1>Mon Profil</h1>

    <div v-if="loading" class="loading">Chargement...</div>

    <div v-else class="form-container">
      <div v-if="errors.length" class="error-container">
        <ul>
          <li v-for="(error, index) in errors" :key="index" class="error">{{ error }}</li>
        </ul>
      </div>
      <div v-if="successMessage" class="success">{{ successMessage }}</div>

      <div class="form-group">
        <label for="name">Nom :</label>
        <input id="name" v-model="name" type="text" />
      </div>

      <div class="form-group">
        <label for="email">Email :</label>
        <input id="email" v-model="email" type="email" />
      </div>

      <button @click="updateProfile" :disabled="loading">Enregistrer</button>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 2rem;
}

.close-button {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 2.5rem;
  color: #333;
  text-decoration: none;
  cursor: pointer;
  line-height: 1;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 400px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

input {
  padding: 8px;
  font-size: 1rem;
}

button {
  padding: 10px 20px;
  font-size: 1.1rem;
  cursor: pointer;
}

.error-container ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.error {
  color: red;
  font-size: 0.9rem;
}

.success {
  color: green;
}
</style>
