<template>
  <div class="trace-search">
    <input v-model="code" placeholder="请输入溯源码" />
    <button @click="search">查询</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const code = ref('')
const emit = defineEmits(['search'])

const search = () => {
  console.log('点击查询', code.value) 
  if (!code.value) return alert('请输入溯源码')
  emit('search', code.value) // 触发父组件事件
}
</script>

<style scoped>
.trace-search {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}
input {
  padding: 6px 12px;
  font-size: 16px;
  width: 200px;
  margin-right: 10px;
}
button {
  padding: 6px 16px;
  font-size: 16px;
  cursor: pointer;
}
</style>
