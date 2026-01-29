<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/api/index'

const route = useRoute()
const game = ref(null)
const loading = ref(true)
const error = ref(null)
const socket = ref(null)
const currentUser = ref(null)

const fetchGame = async () => {
  try {
    const response = await api.get(`/api/games/${route.params.id}`)
    game.value = response.data

    const userResponse = await api.get('/api/profile')
    currentUser.value = userResponse.data

    waitForOpponentMove()
  } catch (err) {
    error.value = "Impossible de charger la partie."
    console.error(err)
  } finally {
    loading.value = false
  }
}

const waitForOpponentMove = () => {
  socket.value = new WebSocket('wss://morpion-api.edu.netlor.fr/websockets')

  socket.value.onopen = () => {
    console.log('WebSocket connected')
    socket.value.send(JSON.stringify({
      action: 'connect',
      game_id: game.value.id,
      player_id: currentUser.value.id
    }))
  }

  socket.value.onmessage = (event) => {
    const data = JSON.parse(event.data)
    console.log('WebSocket message:', data)

    switch (data.action) {
      case 'opponent-join':
      case 'opponent-play':
        fetchGame()
        break
      case 'opponent-quit':
        alert("L'adversaire a FF la partie")
        break
    }
  }

  socket.value.onerror = (error) => {
    console.error('WebSocket error:', error)
  }
}

onMounted(() => {
  fetchGame()
})

onUnmounted(() => {
  if (socket.value) {
    socket.value.close()
  }
})
</script>

<template>
  <div class="game-container">
    <div v-if="loading">Chargement de la partie...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="game">
      <h1>Partie #{{ game.code }}</h1>

      <div v-if="!game.opponent">
        <p>En attente d'un adversaire...</p>
        <p>Partagez ce code : <strong>{{ game.code }}</strong></p>
      </div>

      <div v-else>
        <p>Adversaire : {{ game.opponent.id !== currentUser.id ? game.opponent.name : game.owner.name }}</p>
        <p>C'est au tour de : {{ game.next_player.id === currentUser.id ? 'Vous' : (game.opponent.id !== currentUser.id ? game.opponent.name : game.owner.name) }}</p>

        <div class="grid">
          <div v-for="(cell, index) in 9" :key="index" class="cell">
            <!-- Contenu du morpion -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 100px);
  grid-template-rows: repeat(3, 100px);
  gap: 5px;
  margin-top: 2rem;
}

.cell {
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  cursor: pointer;
}

.error {
  color: red;
}
</style>
