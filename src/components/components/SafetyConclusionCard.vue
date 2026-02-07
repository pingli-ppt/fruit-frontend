<template>
  <section class="card safety">
    <h2>安全结论</h2>
    <p class="ok">✔ 本批次产品 {{ status }}</p>
  </section>
</template>

<script setup>
defineProps({ status: String })
</script>

<style scoped>
.card.safety {
  border: 1px solid #ccc;
  padding: 12px;
  margin-bottom: 10px;
  background-color: #f0fff0;
}
.ok {
  color: green;
  font-weight: bold;
}
</style>
