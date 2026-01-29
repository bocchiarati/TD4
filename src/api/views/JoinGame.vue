<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { RouteNames } from '@/router/constants'
import api from '@/api/index'

const router = useRouter()
const gameCode = ref('')
const loading = ref(false)
const errors = ref([])

const joinGame = async () => {
  if (!gameCode.value) {
    errors.value = ["Veuillez entrer un code de partie."]
    return
  }

  loading.value = true
  errors.value = []

  try {
    const response = await api.patch(`/api/games/${gameCode.value}/join`)
    if (response.data && response.data.id) {
      router.push({ name: RouteNames.GAME, params: { id: response.data.id } })
    }
  } catch (err) {
    if (err.response && err.response.data && err.response.data.errors) {
      errors.value = Object.values(err.response.data.errors).flat()
    } else if (err.response && err.response.data && err.response.data.message) {
       errors.value = [err.response.data.message]
    } else {
      errors.value = ["Impossible de rejoindre la partie. Vérifiez le code."]
    }
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="join-game-container">
    <router-link :to="{ name: RouteNames.HOME }" class="close-button">×</router-link>
    <h1>Rejoindre une partie</h1>

    <div class="form-container">
      <div v-if="errors.length" class="error-container">
        <ul>
          <li v-for="(error, index) in errors" :key="index" class="error">{{ error }}</li>
        </ul>
      </div>

      <div class="form-group">
        <label for="gameCode">Code de la partie :</label>
        <input
          id="gameCode"
          v-model="gameCode"
          type="text"
          placeholder="Ex: X7Y2"
          @keyup.enter="joinGame"
        />
      </div>

      <button @click="joinGame" :disabled="loading || !gameCode">
        {{ loading ? 'Recherche...' : 'Rejoindre' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.join-game-container {
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
  padding: 12px;
  font-size: 1.2rem;
  text-align: center;
  letter-spacing: 2px;
  text-transform: uppercase;
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
  text-align: center;
}
</style>
