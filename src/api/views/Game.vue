<script setup>
import {useRoute} from "vue-router";
import {ref} from "vue";

const route  = useRoute()
const game_id = ref(route.params.id)

</script>

<template>
  ID : {{game_id}}
</template>

<style scoped>
</style>
