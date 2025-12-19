<template>
  <div style="padding: 40px">
    <h2>水果数据</h2>

    <table border="1" cellpadding="10">
      <tr>
        <th>名称</th>
        <th>价格</th>
        <th>农药等级</th>
      </tr>

      <tr v-for="item in list" :key="item.id">
        <td>{{ item.name }}</td>
        <td>{{ item.price }}</td>
        <td>{{ item.pesticide_level }}</td>
      </tr>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '../api/request'

const list = ref([])

onMounted(async () => {
  const res = await request.get('/api/fruits')
  list.value = res.data
})
</script>
