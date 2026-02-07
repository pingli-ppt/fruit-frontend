<template>
  <section class="card">
    <h2>产地 & 品类</h2>
    <p>产地：{{ origin.place }}</p>
    <p>品类：{{ category }}</p>
  </section>
</template>

<script setup>
defineProps({ origin: Object, category: String })
</script>

<style scoped>
.card { border: 1px solid #ccc; padding: 12px; margin-bottom: 10px; }
</style>
