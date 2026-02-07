<template>
  <MainLayout>
    <div class="scan-page">
      <h1>扫码溯源</h1>

      <input
        v-model="code"
        placeholder="请输入或扫描溯源码"
      />

      <button @click="goResult">查询</button>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'

const router = useRouter()
const code = ref('')

const goResult = () => {
  router.push({ path: '/consumer/result', query: { code: code.value } })
}
</script>
