<template>
  <div class="trace-result">
    <h3>溯源结果</h3>
    <ul>
      <li>批次号：{{ data.batch }}</li>
      <li>产地：{{ data.origin }}</li>
      <li>采摘日期：{{ data.harvestDate }}</li>
      <li>检测情况：{{ data.inspection }}</li>
      <li>物流方式：{{ data.logistics }}</li>
    </ul>
  </div>
</template>

<script setup>
defineProps({
  data: Object
})
</script>

<style scoped>
.trace-result {
  margin-top: 20px;
  background: #ffffff;
  padding: 15px;
  border-radius: 8px;
}
li {
  margin: 6px 0;
}
</style>
