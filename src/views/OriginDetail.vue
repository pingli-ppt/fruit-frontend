<template>
  <MainLayout>
    <div class="origin-container">
      
      <div class="hero-section">
        <el-row :gutter="40" align="middle">
          
          <el-col :span="10" :xs="24">
            <div class="intro-box">
              <el-tag effect="dark" type="success" size="large" class="mb-2">绿色认证基地</el-tag>
              <h1 class="title">{{ originInfo.name }}</h1>
              <p class="desc">{{ originInfo.description }}</p>
              
              <el-descriptions :column="1" border class="info-table">
                <el-descriptions-item label="📍 地理位置">{{ originInfo.location }}</el-descriptions-item>
                <el-descriptions-item label="🌤 气候条件">{{ originInfo.climate }}</el-descriptions-item>
                <el-descriptions-item label="👨‍🌾 负责人">{{ originInfo.manager }}</el-descriptions-item>
                <el-descriptions-item label="📏 种植面积">{{ originInfo.area }}</el-descriptions-item>
              </el-descriptions>
            </div>
          </el-col>

          <el-col :span="14" :xs="24">
            <div class="map-wrapper" @click="handleMapClick">
              <div class="interactive-map">
                <el-card class="map-container">
                  <FengxianMap />
                </el-card>

                <div class="map-overlay">
                  <el-icon class="zoom-icon"><ZoomIn /></el-icon>
                  <span>点击探索产地全貌</span>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <div class="data-section">
        <h2 class="section-heading">📊 全程透明化溯源</h2>
        <el-tabs type="border-card" class="custom-tabs">
          
          <el-tab-pane label="🌱 农事记录">
            <div class="timeline-box">
              <el-timeline>
                <el-timeline-item
                  v-for="(activity, index) in farmingRecords"
                  :key="index"
                  :timestamp="activity.date"
                  placement="top"
                  :type="index === 0 ? 'success' : ''"
                  :hollow="index === 0"
                >
                  <el-card shadow="hover" class="record-card">
                    <h4>{{ activity.title }}</h4>
                    <p>{{ activity.content }}</p>
                    <div v-if="activity.imgs && activity.imgs.length" class="record-imgs">
                      <el-image 
                        v-for="img in activity.imgs" :key="img" 
                        :src="img" 
                        class="record-img-item"
                      />
                    </div>
                  </el-card>
                </el-timeline-item>
              </el-timeline>
            </div>
          </el-tab-pane>

          <el-tab-pane label="🔬 检测报告">
            <el-empty description="暂无最新质检报告，请联系管理员录入" />
          </el-tab-pane>

          <el-tab-pane label="📺 基地实况">
             <div class="live-placeholder">
               <el-icon :size="60" color="#909399"><VideoCamera /></el-icon>
               <p style="margin-top: 20px; color: #666">直播信号连接中... (模拟)</p>
             </div>
          </el-tab-pane>
        </el-tabs>
      </div>

      <div class="product-section">
        <h2 class="section-heading">🛒 产地直供产品</h2>
        <el-row :gutter="20">
          <el-col :span="6" :xs="12" :sm="12" :md="6" v-for="item in productList" :key="item.id">
            <ProductCard 
              :product="item" 
              mode="consumer" 
              @trace="handleTrace"
            />
          </el-col>
        </el-row>
      </div>

    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// 引入图标
import { ZoomIn, VideoCamera } from '@element-plus/icons-vue'
// 引入组件
import MainLayout from '../layouts/MainLayout.vue'
import ProductCard from '../components/ProductCard.vue'
// 引入刚才写的 API
import { getOriginDetail, getFarmingRecords, getOriginProducts } from '../api/origin.js'
import FengxianMap from '../components/FengxianMap.vue' 
const route = useRoute()
const router = useRouter()
const originName = route.params.name 

// 响应式数据
const originInfo = ref({})
const farmingRecords = ref([])
const productList = ref([])

// 交互方法
const handleMapClick = () => {
  alert('此处功能：点击后弹窗显示高清地图，或跳转到 GIS 地块详情页。')
}

const handleTrace = (batchCode) => {
  // 跳转到 Trace 页面
  router.push({ path: '/trace', query: { code: batchCode } })
}

// 页面加载时调用数据
onMounted(async () => {
  console.log('产地页面初始化...')
  
  // 1. 获取详情
  const infoRes = await getOriginDetail(originName)
  originInfo.value = infoRes.data
  
  // 2. 获取农事记录
  const recordRes = await getFarmingRecords()
  farmingRecords.value = recordRes.data

  // 3. 获取产品
  const prodRes = await getOriginProducts()
  productList.value = prodRes.data
})
</script>

<style scoped>
.origin-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.mb-2 { margin-bottom: 10px; }

/* Hero Section */
.hero-section { margin-bottom: 60px; }
.title { font-size: 2.5rem; margin: 10px 0 20px; color: #2c3e50; }
.desc { font-size: 1.1rem; color: #666; margin-bottom: 30px; line-height: 1.6; }
.info-table { margin-top: 20px; }

/* Map Style */
.map-wrapper {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  cursor: pointer;
  height: 400px; /* 固定高度确保对齐 */
  background: #f0f2f5;
}
.map-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s;
}
.map-wrapper:hover .map-img {
  transform: scale(1.05);
}
.map-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: opacity 0.3s;
}
.map-wrapper:hover .map-overlay { opacity: 1; }
.zoom-icon { font-size: 3rem; margin-bottom: 10px; }

/* Data Section */
.data-section { margin-bottom: 60px; }
.section-heading {
  font-size: 1.8rem;
  margin-bottom: 25px;
  border-left: 5px solid #67c23a; /* 绿色系 */
  padding-left: 15px;
}
.custom-tabs { min-height: 450px; }
.record-card h4 { margin: 0 0 10px 0; color: #303133; }
.record-img-item { width: 100px; height: 100px; margin-right: 10px; border-radius: 6px; }

.live-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 350px;
  background: #f5f7fa;
}

/* Product Section */
.product-section { margin-bottom: 40px; }
</style>