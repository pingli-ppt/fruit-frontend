<template>
  <div class="panel">
    <h3>生产过程</h3>
    <p>模式：{{ data.mode }}</p>
    <p>采摘日期：{{ data.harvestDate }}</p>
  </div>
</template>

<script setup>
defineProps({ data: Object })
</script>

<style scoped>
.panel {
  margin-bottom: 20px;
  padding: 14px;
  background: #f9fff9;
  border-radius: 10px;
}
h3 {
  font-size: 16px;
  margin-bottom: 8px;
  color: #333;
}
p {
  margin: 4px 0;
  color: #555;
}
</style>