<template>
  <div class="search-box">
    <input
      v-model="code"
      placeholder="请输入批次号 / 溯源码"
    />
    <button @click="submit">查询</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['search'])
const code = ref('')

const submit = () => {
  if (!code.value) return
  emit('search', code.value)
}
</script>

<style scoped>
.search-box {
  display: flex;
  gap: 10px;
  margin: 20px 0;
}
input {
  flex: 1;
  padding: 10px;
}
button {
  background: #4caf50;
  color: #fff;
  border: none;
  padding: 10px 16px;
}
</style>
