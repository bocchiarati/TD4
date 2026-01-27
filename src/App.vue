<script setup>
</script>

<template>
  <div class="home-container">
    <h1>Accueil</h1>
    <div class="button-group">
      <button>Mon profil</button>
      <button>Nouvelle partie</button>
      <button>Rejoindre une partie</button>
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
