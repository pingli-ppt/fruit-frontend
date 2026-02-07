<template>
  <div>
    <h3>生产过程</h3>
    <p>模式：{{ data.mode }}</p>
    <p>采摘日期：{{ data.harvest }}</p>
  </div>
</template>

<script setup>
defineProps({ data: Object })
</script>
