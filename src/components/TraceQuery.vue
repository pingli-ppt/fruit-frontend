<template>
  <section class="trace-query">
    <h2>果品批次溯源查询</h2>

    <div class="form">
      <input
        v-model="batchCode"
        placeholder="请输入批次编号"
      />
      <button @click="queryTrace">查询</button>
    </div>

    <TraceResult v-if="result" :data="result" />
  </section>
</template>

<script setup>
import { ref } from 'vue'
import TraceResult from './TraceResult.vue'

const batchCode = ref('')
const result = ref(null)

const queryTrace = () => {
  // 🚧 后端接口预留
  result.value = {
    batch: batchCode.value,
    origin: '山东烟台',
    harvestDate: '2025-09-01',
    inspection: '农残检测合格',
    logistics: '冷链运输'
  }
}
</script>

<style scoped>
.trace-query {
  margin: 40px 0;
  padding: 25px;
  border-radius: 10px;
  background: #f6fff7;
}
.form {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}
input {
  flex: 1;
  padding: 8px;
}
button {
  background: #4caf50;
  color: white;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
}
</style>
