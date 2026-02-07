<template>
  <div>
    <h3>流通信息</h3>
    <ul>
      <li v-for="l in data" :key="l.time">
        {{ l.time }} - {{ l.desc }}
      </li>
    </ul>
  </div>
</template>

<script setup>
defineProps({ data: Array })
</script>
