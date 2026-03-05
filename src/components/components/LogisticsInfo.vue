<template>
  <div class="panel">
    <h3>流通信息</h3>
    <ul>
      <li v-for="l in data" :key="l.operate_time">
        {{ l.operate_time }} - {{ l.content }}
      </li>
    </ul>
  </div>
</template>

<script setup>
defineProps({ data: Array })
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
li {
  margin: 4px 0;
  color: #555;
}
</style>