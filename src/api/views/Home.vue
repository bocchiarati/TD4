<script setup>
import { useRouter } from 'vue-router'
import { RouteNames } from '@/router/constants'

const router = useRouter()

const goToProfile = () => {
  router.push({ name: RouteNames.PROFILE })
}

const goToNewGame = () => {
  router.push({ name: RouteNames.NEW_GAME })
}

const goToJoinGame = () => {
  router.push({ name: RouteNames.JOIN_GAME })
}
</script>

<template>
  <div class="home-container">
    <h1>Accueil</h1>
    <div class="button-group">
      <button @click="goToProfile">Mon profil</button>
      <button @click="goToNewGame">Nouvelle partie</button>
      <button @click="goToJoinGame">Rejoindre une partie</button>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 2rem;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

button {
  padding: 10px 20px;
  font-size: 1.2rem;
  cursor: pointer;
}
</style>
