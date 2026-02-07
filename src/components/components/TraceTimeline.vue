<template>
  <div>
    <h3>关键节点时间轴</h3>
    <div v-for="n in data" :key="n.time">
      {{ n.time }} ｜ {{ n.content }}
    </div>
  </div>
</template>

<script setup>
defineProps({ data: Array })
</script>
