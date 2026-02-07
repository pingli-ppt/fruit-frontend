<template>
  <section class="card">
    <h2>{{ product.name }}</h2>
    <p>批次号：{{ batch }}</p>
    <p>品类：{{ product.category }}</p>
  </section>
</template>

<script setup>
defineProps({ product: Object, batch: String })
</script>

<style scoped>
.card { border: 1px solid #ccc; padding: 12px; margin-bottom: 10px; }
</style>
