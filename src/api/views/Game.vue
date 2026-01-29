<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { RouteNames } from '@/router/constants'
import api from '@/api/index'

const route = useRoute()
const router = useRouter()
const game = ref(null)
const loading = ref(true)
const error = ref(null)
const socket = ref(null)
const currentUser = ref(null)
const playError = ref(null)

const fetchGame = async () => {
  try {
    const response = await api.get(`/api/games/${route.params.id}`)
    game.value = response.data

    if (!currentUser.value) {
        const userResponse = await api.get('/api/profile')
        currentUser.value = userResponse.data
    }

    if (!socket.value || socket.value.readyState === WebSocket.CLOSED) {
        waitForOpponentMove()
    }
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
    try {
        const data = JSON.parse(event.data)
        switch (data.action) {
          case 'opponent-join':
          case 'opponent-play':
            fetchGame()
            break
          case 'opponent-quit':
            alert("L'adversaire a quitté la partie")
            break
        }
    } catch (e) {
        console.error('Error parsing WebSocket message:', e)
    }
  }

  socket.value.onerror = (error) => {
    console.error('WebSocket error:', error)
  }
}

const play = async (row, col) => {
  playError.value = null

  if (game.value.status === 'finished') return
  if (game.value.next_player.id !== currentUser.value.id) {
      playError.value = "Ce n'est pas votre tour !"
      return
  }

  try {
    const response = await api.patch(`/api/games/${game.value.id}/play/${row}/${col}`)
    game.value = response.data
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
        playError.value = err.response.data.message
    } else {
        playError.value = "Impossible de jouer ce coup."
    }
    console.error(err)
  }
}

const getOpponentName = () => {
    if (!game.value || !game.value.opponent) return 'Adversaire'
    // Si l'utilisateur courant est le créateur, l'adversaire est game.opponent
    if (currentUser.value.id === game.value.owner.id) {
        return game.value.opponent.name
    }
    // Si l'utilisateur courant est l'adversaire, alors "l'adversaire" est le créateur (owner)
    return game.value.owner.name
}

const getSymbol = (playerId) => {
    if (!playerId) return ''
    if (playerId === game.value.owner.id) return 'X'
    return 'O'
}

const goHome = () => {
    router.push({ name: RouteNames.HOME })
}

onMounted(() => {
  fetchGame()
})

onUnmounted(() => {
  if (socket.value) {
    socket.value.close()
    console.log('WebSocket closed')
  }
})
</script>

<template>
  <div class="game-container">
    <div v-if="loading">Chargement de la partie...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="game">
      <h1>Partie #{{ game.code }}</h1>

      <!-- État : En attente -->
      <div v-if="!game.opponent">
        <p>En attente d'un adversaire...</p>
        <p>Partagez ce code : <strong>{{ game.code }}</strong></p>
        <button @click="goHome" class="home-btn">Retour à l'accueil</button>
      </div>

      <!-- État : Partie terminée -->
      <div v-else-if="game.game_status === 'finished'" class="game-over">
        <h2>Partie terminée !</h2>
        <p v-if="game.winner_id">
            Le gagnant est :
            <strong>{{ game.winner_id === currentUser.id ? 'Vous !' : getOpponentName() }}</strong>
        </p>
        <p v-else>Match nul !</p>
        <button @click="goHome" class="home-btn">Retour à l'accueil</button>
      </div>

      <!-- État : En cours -->
      <div v-else>
        <p>Adversaire : {{ getOpponentName() }}</p>
        <p>C'est au tour de : {{ game.next_player.id === currentUser.id ? 'Vous' : getOpponentName() }}</p>

        <div class="grid">
          <template v-for="row in 3" :key="'row-'+row">
              <div v-for="col in 3" :key="'col-'+col" class="cell"
                @click="play(row, col)">
                <span v-if="game.grid[row-1][col-1]">
                    {{ getSymbol(game.grid[row-1][col-1]) }}
                </span>
              </div>
          </template>
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
  min-height: 100vh;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 100px);
  grid-template-rows: repeat(3, 100px);
  gap: 5px;
  margin-top: 2rem;
  background-color: #333;
  padding: 5px;
  border-radius: 5px;
}

.cell {
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: bold;
  cursor: pointer;
  user-select: none;
}

.cell:hover {
    background-color: #f0f0f0;
}

.error {
  color: red;
}

.error-message {
    color: red;
    font-weight: bold;
    margin-top: 0.5rem;
}

.info-panel {
    text-align: center;
    margin-bottom: 1rem;
}

.turn-indicator {
    font-size: 1.2rem;
    padding: 0.5rem;
    border-radius: 4px;
}

.my-turn {
    background-color: #e6fffa;
    color: #008060;
    border: 1px solid #008060;
}

.game-over {
    text-align: center;
    margin-top: 2rem;
}

.home-btn {
    margin-top: 1rem;
    padding: 10px 20px;
    font-size: 1.1rem;
    cursor: pointer;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
}
</style>
