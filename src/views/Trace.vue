<template>
  <MainLayout>
    <div class="trace-page">

      <h1>果品质检与溯源查询</h1>

      <!-- 查询输入 -->
      <TraceSearch @search="handleSearch" />

      <!-- ================= 溯源结果 ================= -->
      <div v-if="traceData">

        <!-- 安全结论 -->
        <SafetyConclusionCard :status="traceData.status" />

        <!-- 产品信息 -->
        <ProductInfoCard
          :product="{ name: traceData.product, category: traceData.category || '鲜果' }"
          :batch="traceData.batchCode"
        />

        <!-- 产地 & 品类 -->
        <OriginCategoryCard
          :origin="{ place: traceData.origin }"
          :category="traceData.category || '鲜果'"
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
          :compliance="{ certificates: ['绿色食品认证'], risk: '无风险' }"
        />

        <!-- 企业信息 -->
        <CompanyInfoCard
          :company="{ name: '奉贤绿色果业合作社', desc: '专注生态水果种植与销售' }"
        />

      </div>

    </div>
  </MainLayout>
</template>

<script setup>
import { ref } from 'vue'
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

const handleSearch = (code) => {
  console.log('收到搜索事件 code =', code)

    traceData.value = {
      batchCode: code,
      product: '红富士苹果',
      origin: '上海奉贤区',
      status: '检测合格',
      timeline: [
        { title: '采摘记录', time: '2025-09-01', content: '合作社完成采摘' },
        { title: '农残检测', time: '2025-09-02', content: '检测合格（第三方机构）' },
        { title: '冷链发运', time: '2025-09-03', content: '进入冷链物流系统' },
        { title: '责任主体', time: '2025-09-03', content: '奉贤绿色果业合作社' }
      ]
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
</style>
