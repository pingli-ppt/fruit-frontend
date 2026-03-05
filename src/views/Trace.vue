<template>
  <MainLayout>
    <div class="trace-page">

      <!-- 美化标题：绿色科技感 -->
      <h1 class="page-title">
        <span>果品质检与溯源查询</span>
      </h1>

      <!-- 查询输入 -->
      <TraceSearch @search="handleSearch" class="search-card" />

      <!-- 加载提示 + 错误提示 -->
      <div v-if="loading" class="loading-box">
        <div class="loading-spinner"></div>
        <span>正在查询中，请稍候...</span>
      </div>
      <div v-if="errorMsg" class="error-box">
        {{ errorMsg }}
      </div>

      <!-- ================= 溯源结果 ================= -->
      <div v-if="traceData" class="result-container">

        <SafetyConclusionCard :status="traceData.status" />
        <ProductInfoCard
          :product="{ name: traceData.product_name }"
          :batch="traceData.batch_code"
        />
        <OriginCategoryCard
          :origin="{ place: traceData.origin }"
          :category="'鲜果'"
        />
        <TrustBadgeCard />
        <TraceProcess
          :production="{
            mode: '标准化生态种植',
            harvestDate: traceData.timeline.find(item => item.title === '采摘记录')?.operate_time || ''
          }"
          :quality="{
            tests: traceData.timeline.filter(item => item.type === '检测'),
          }"
          :logistics="traceData.timeline.filter(item => item.type === '物流')"
        />
        <QualityCompliance
          :quality="{ reports: ['农残检测报告.pdf'] }"
          :compliance="{ certificates: certList, risk: '无风险' }"
        />
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

const traceData = ref({
  timeline: []
})

const loading = ref(false)
const errorMsg = ref('')
const certList = ref(['绿色食品认证'])

onMounted(() => {
  getTraceData()
  fetchQualityTags()
})

async function getTraceData() {
  loading.value = true
  errorMsg.value = ''
  try {
    // ✅ 这里填你的真实接口
    const response = await fetch('http://localhost:3000/api/trace/query?code=PC202509001')
    const result = await response.json()

    if (result.code === 200) {
      // ✅ 把后端数据赋值给 traceData
      traceData.value = result.data
    } else {
      errorMsg.value = result.message || '查询失败'
    }
  } catch (err) {
    errorMsg.value = '网络异常，请检查后端是否启动'
    console.error(err)
  } finally {
    loading.value = false
  }
}


// 获取认证标签（有机/绿色/无公害）
const fetchQualityTags = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/quality/tags')
    const result = await res.json()
    if (result.code === 200) {
      certList.value = result.data.map(item => item.tag_name)
    }
  } catch (e) {}
}

const handleSearch = async (code) => {
  console.log('查询溯源码：', code)
  loading.value = true
  errorMsg.value = ''
  traceData.value = null

  try {
    const res = await fetch(`http://localhost:3000/api/trace/query?code=${code}`)
    const result = await res.json()

    if (result.code === 200) {
      traceData.value = result.data
    } else {
      errorMsg.value = result.message || '未查询到溯源信息'
    }
  } catch (err) {
    errorMsg.value = '网络异常，请检查后端服务是否启动'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* 整体页面：绿色科技背景 */
.trace-page {
  max-width: 960px;
  margin: 40px auto;
  padding: 0 20px;
  min-height: 100vh;
  background: linear-gradient(to bottom, #f8fff9, #f2fff7);
}

/* 标题：科技渐变绿 */
.page-title {
  text-align: center;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 36px;
  background: linear-gradient(90deg, #27ae60, #00b42a, #34d39e);
  -webkit-background-clip: text;
  color: transparent;
  letter-spacing: 1px;
  position: relative;
}
.page-title::after {
  content: '';
  display: block;
  width: 80px;
  height: 4px;
  margin: 12px auto 0;
  background: linear-gradient(90deg, #27ae60, #34d39e);
  border-radius: 2px;
}

/* 搜索卡片美化 */
.search-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(39, 174, 96, 0.08);
  margin-bottom: 30px;
}

/* 结果容器 */
.result-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 所有子卡片统一美化 */
:deep(.result-container > *) {
  background: #ffffff !important;
  border-radius: 16px !important;
  padding: 24px !important;
  box-shadow: 0 4px 18px rgba(39, 174, 96, 0.07) !important;
  border: 1px solid rgba(39, 174, 96, 0.1) !important;
  transition: all 0.3s ease !important;
}
:deep(.result-container > *:hover) {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(39, 174, 96, 0.12) !important;
}

/* 加载动画：绿色科技感 */
.loading-box {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 30px 0;
  color: #27ae60;
  font-size: 15px;
}
.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(39, 174, 96, 0.2);
  border-top: 2px solid #27ae60;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 错误提示 */
.error-box {
  background: #fff1f0;
  color: #e53e3e;
  padding: 14px 20px;
  border-radius: 12px;
  text-align: center;
  margin: 20px 0;
  border: 1px solid #fecdd3;
}
</style>