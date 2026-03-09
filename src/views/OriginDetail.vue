<template>
  <MainLayout>
    <div class="origin-container" v-loading="loading">
      
      <div class="hero-section">
        <el-row :gutter="40" align="middle">
          <el-col :span="10" :xs="24">
            <div class="intro-box">
              <el-tag effect="dark" type="success" size="large" class="mb-2">绿色认证基地</el-tag>
              <h1 class="title">{{ originInfo.name || '加载中...' }}</h1>
              <p class="desc">{{ originInfo.description }}</p>
              
              <el-descriptions :column="1" border class="info-table">
                <el-descriptions-item label="📍 地理位置">{{ originInfo.location }}</el-descriptions-item>
                <el-descriptions-item label="🌤 气候条件">{{ originInfo.climate }}</el-descriptions-item>
                <el-descriptions-item label="👨‍🌾 负责人">{{ originInfo.manager }}</el-descriptions-item>
                <el-descriptions-item label="📏 总种植面积">{{ originInfo.area }}</el-descriptions-item>
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
          <el-tab-pane label="🔬 检测报告"><el-empty description="暂无报告" /></el-tab-pane>
        </el-tabs>
      </div>

      <div class="coop-section" style="margin-top: 40px;">
        <h2 class="section-heading">基地入驻生产主体</h2>
        <el-row :gutter="20">
          <el-col 
            :span="8" :xs="24" :sm="12" 
            v-for="coop in coopsList" 
            :key="coop.id"
            style="margin-bottom: 20px;"
          >
            <!-- 修复2：删除错误嵌套的el-timeline-item，恢复正确的合作社卡片 -->
            <el-card shadow="hover">
              <template #header>
                <div class="card-header">
                  <span style="font-weight: bold;">{{ coop.name }}</span>
                  <el-tag size="small" type="warning">{{ coop.honor }}</el-tag>
                </div>
              </template>
              <div class="coop-info">
                <p><strong>负责人：</strong>{{ coop.leader }}</p>
                <p><strong>联系方式：</strong>{{ coop.phone }}</p>
                <p><strong>种植面积：</strong>{{ coop.area }}</p>
                <p><strong>认证情况：</strong>{{ coop.certification }}</p>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { ZoomIn, VideoCamera } from '@element-plus/icons-vue'
import MainLayout from '../layouts/MainLayout.vue'
import ProductCard from '../components/ProductCard.vue'
import FengxianMap from '../components/FengxianMap.vue' 

const route = useRoute()
const router = useRouter()

// 固定使用fengxian作为ID，避免中文参数导致404
const originId = 'fengxian' 
const API_BASE = "http://localhost:8080/api/origin-v2"

const originInfo = ref({})
const farmingRecords = ref([])
const coopsList = ref([]) 
const productList = ref([])
const loading = ref(false)

const fetchPageData = async () => {
  loading.value = true
  try {
    console.log('正在加载产地数据，ID:', originId)
    
    const [resDetail, resCoops] = await Promise.all([
      axios.get(`${API_BASE}/details/${originId}`),
      axios.get(`${API_BASE}/cooperatives/${originId}`)
    ])

    if (resDetail.data.success) {
      originInfo.value = resDetail.data.data
      farmingRecords.value = resDetail.data.data.records || []
    }

    if (resCoops.data.success) {
      coopsList.value = resCoops.data.data
      console.log('成功获取合作社数量:', coopsList.value.length)
    }
  } catch (error) {
    console.error("加载失败:", error)
    // 区分错误类型，精准提示
    if (error.response?.status === 404) {
      ElMessage.error("未找到该产地数据，请检查ID是否正确")
    } else if (error.message.includes('Network Error')) {
      ElMessage.error("无法连接后端，请检查8080端口服务是否启动")
    } else {
      ElMessage.error("数据加载失败，请重试")
    }
  } finally {
    loading.value = false
  }
}

const handleMapClick = () => ElMessage.info('正在调取 GIS 实时数据...')
// 恢复错误捕获，定位跳转问题
const handleTrace = (batchCode) => {
  router.push({ path: '/trace', query: { code: batchCode } })
    .catch(err => {
      console.error('跳转失败详情:', err);
      ElMessage.error(`跳转失败: ${err.message}`);
    });
}

onMounted(() => {
  fetchPageData()
})
</script>

<style scoped>
.origin-container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
.hero-section { margin-bottom: 60px; }
.title { font-size: 2.5rem; color: #2c3e50; }
.section-heading { border-left: 5px solid #67c23a; padding-left: 15px; margin-bottom: 25px; font-size: 24px; }
.map-wrapper { position: relative; border-radius: 12px; overflow: hidden; height: 400px; background: #f0f2f5; box-shadow: 0 8px 20px rgba(0,0,0,0.1); cursor: pointer; }
.map-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.2); display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; opacity: 0; transition: 0.3s; }
.map-wrapper:hover .map-overlay { opacity: 1; }
.zoom-icon { font-size: 3rem; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
.coop-info p { font-size: 14px; margin: 8px 0; color: #606266; }
</style>