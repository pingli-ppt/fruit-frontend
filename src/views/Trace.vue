<template>
  <MainLayout>
    <div class="trace-page">
      <h1>果品质检与溯源查询</h1>

      <TraceSearch @search="handleSearch" />

      <TraceSummary v-if="traceData" :data="traceData" />

      <TraceTimeline v-if="traceData" :data="traceData" />
    </div>
  </MainLayout>
</template>

<script setup>
import { ref } from 'vue'
import MainLayout from '../layouts/MainLayout.vue'
import TraceSearch from '../components/trace/TraceSearch.vue'
import TraceSummary from '../components/trace/TraceSummary.vue'
import TraceTimeline from '../components/trace/TraceTimeline.vue'

const traceData = ref(null)

const handleSearch = (code) => {
  // 🚧 后端接口预留（现在 mock）
  traceData.value = {
    batchCode: code,
    product: '红富士苹果',
    origin: '上海奉贤区',
    status: '检测合格',
    timeline: [
      {
        title: '采摘记录',
        time: '2025-09-01',
        content: '合作社完成采摘'
      },
      {
        title: '农残检测',
        time: '2025-09-02',
        content: '检测合格（第三方机构）'
      },
      {
        title: '冷链发运',
        time: '2025-09-03',
        content: '进入冷链物流系统'
      },
      {
        title: '责任主体',
        time: '2025-09-03',
        content: '奉贤绿色果业合作社'
      }
    ]
  }
}
</script>

<style scoped>
.trace-page {
  max-width: 900px;
  margin: 30px auto;
}
</style>
