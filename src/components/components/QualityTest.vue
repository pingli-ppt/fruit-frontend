<template>
  <div>
    <h3>质量检测</h3>
    <ul>
      <li v-for="t in data.tests" :key="t.name">
        {{ t.name }}：{{ t.result }}
      </li>
    </ul>
  </div>
</template>

<script setup>
defineProps({ data: Object })
</script>
