<template>
  <div class="summary">
    <h3>溯源结果概览</h3>
    <p>批次号：{{ data.batchCode }}</p>
    <p>产品：{{ data.product }}</p>
    <p>产地：{{ data.origin }}</p>
    <p>检测状态：{{ data.status }}</p>
  </div>
</template>

<script setup>
defineProps({
  data: Object
})
</script>

<style scoped>
.summary {
  background: #f6fff7;
  padding: 20px;
  border-radius: 8px;
}
</style>
