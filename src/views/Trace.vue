<template>
  <MainLayout>
    <div class="trace-page">

      <h1>果品质检与溯源查询</h1>

      <!-- 查询输入 -->
      <TraceSearch @search="handleSearch" />

      <!-- 加载提示 + 错误提示 -->
      <div v-if="loading" class="loading">正在查询中...</div>
      <div v-if="errorMsg" class="error">{{ errorMsg }}</div>

      <!-- ================= 溯源结果 ================= -->
      <div v-if="traceData">

        <!-- 安全结论 -->
        <SafetyConclusionCard :status="traceData.status" />

        <!-- 产品信息 -->
        <ProductInfoCard
          :product="{ name: traceData.product_name, category: '鲜果' }"
          :batch="traceData.batch_code"
        />

        <!-- 产地 & 品类 -->
        <OriginCategoryCard
          :origin="{ place: traceData.origin }"
          :category="'鲜果'"
        />

        <!-- 快速可信标识 -->
        <TrustBadgeCard />

        <!-- 溯源全过程 -->
        <TraceProcess
          :production="{ mode: '生态种植', harvestDate: '2025-09-01' }"
          :quality="{ tests: traceData.timeline.slice(0,2), reports: ['农残检测报告.pdf'] }"
          :logistics="traceData.timeline.slice(2,3)"
          :timeline="traceData.timeline"
        />

        <!-- 质量与合规 -->
        <QualityCompliance
          :quality="{ reports: ['农残检测报告.pdf'] }"
          :compliance="{ certificates: certList, risk: '无风险' }"
        />

        <!-- 企业信息 -->
        <CompanyInfoCard
          :company="{ name: traceData.coop_name, desc: '专注生态水果种植与销售' }"
        />

      </div>

    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MainLayout from '../layouts/MainLayout.vue'

import TraceSearch from '../components/trace/TraceSearch.vue'
import SafetyConclusionCard from '../components/components/SafetyConclusionCard.vue'
import ProductInfoCard from '../components/components/ProductInfoCard.vue'
import OriginCategoryCard from '../components/components/OriginCategoryCard.vue'
import TrustBadgeCard from '../components/components/TrustBadgeCard.vue'
import TraceProcess from '../components/components/TraceProcess.vue'
import QualityCompliance from '../components/components/QualityCompliance.vue'
import CompanyInfoCard from '../components/components/CompanyInfoCard.vue'

const traceData = ref(null)
const loading = ref(false)
const errorMsg = ref('')

// 质检认证标签（从数据库读取）
const certList = ref(['绿色食品认证'])

// 页面加载时获取质检标签
onMounted(() => {
  fetchQualityTags()
})

// 获取质检标签接口
const fetchQualityTags = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/quality/tags')
    const result = await res.json()
    if (result.code === 200) {
      certList.value = result.data.map(item => item.tag_name)
    }
  } catch (e) {}
}

// 核心：查询溯源（对接后端）
const handleSearch = async (code) => {
  console.log('收到搜索事件 code =', code)
  loading.value = true
  errorMsg.value = ''
  traceData.value = null

  try {
    // 请求你的真实后端接口
    const res = await fetch(`http://localhost:3000/api/trace/query?code=${code}`)
    const result = await res.json()

    if (result.code === 200) {
      // 赋值后端返回的真实数据
      traceData.value = result.data
    } else {
      errorMsg.value = result.message
    }
  } catch (err) {
    errorMsg.value = '网络异常，请检查后端是否启动'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.trace-page {
  max-width: 800px;
  margin: 30px auto;
}
.result {
  margin-top: 20px;
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 6px;
  background-color: #f9f9f9;
}
.loading {
  text-align: center;
  margin: 15px 0;
  color: #666;
}
.error {
  color: red;
  text-align: center;
  margin: 15px 0;
}
</style>