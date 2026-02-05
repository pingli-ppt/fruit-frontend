<template>
  <AppHeader />
  <main class="main">
    <slot />
  </main>
  <AppFooter />
</template>

<script setup>
import AppHeader from '../components/header/AppHeader.vue'
import AppFooter from '../components/footer/AppFooter.vue'
</script>

<style scoped>
.main {
  min-height: 70vh;
  background: #f7f8fa;
}
</style>
