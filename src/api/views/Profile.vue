<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/index'

const name = ref('')
const email = ref('')
const loading = ref(false)
const error = ref(null)
const successMessage = ref(null)

const fetchProfile = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await api.get('/api/profile')
    name.value = response.data.name
    email.value = response.data.email
  } catch (err) {
    error.value = "Erreur lors du chargement du profil."
    console.error(err)
  } finally {
    loading.value = false
  }
}

const updateProfile = async () => {
  loading.value = true
  error.value = null
  successMessage.value = null
  try {
    await api.put('/api/profile', {
      name: name.value,
      email: email.value
    })
    successMessage.value = "Profil mis à jour avec succès !"
  } catch (err) {
    error.value = "Erreur lors de la mise à jour du profil."
    console.error(err)
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
    <h1>Mon Profil</h1>

    <div v-if="loading" class="loading">Chargement...</div>

    <div v-else class="form-container">
      <div v-if="error" class="error">{{ error }}</div>
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 2rem;
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

.error {
  color: red;
}

.success {
  color: green;
}
</style>
