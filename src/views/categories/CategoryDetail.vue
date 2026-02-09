[file name]: CategoryDetail.vue
<template>
  <div class="category-detail-container">
    <!-- 返回按钮 -->
    <div class="back-nav">
      <button @click="goBack" class="back-button">
        ← 返回品类列表
      </button>
    </div>
    
    <!-- 主内容 -->
    <div class="detail-content" v-if="category">
      <!-- 头部信息 -->
      <div class="detail-header">
        <h1 class="category-title">{{ category.name }}</h1>
        <div class="header-tags">
          <span v-if="category.cooperative?.level && category.cooperative.level !== '否'" class="tag demo-tag">
            {{ category.cooperative.level }}
          </span>
          <span v-if="category.cooperative?.quality && category.cooperative.quality.trim()" class="tag quality-tag">
            {{ category.cooperative.quality }}
          </span>
          <span class="tag season-tag">
            {{ formatSeason(category.season) }}
          </span>
        </div>
      </div>
      
      <!-- 两栏布局 -->
      <div class="detail-grid">
        <!-- 左侧：基础信息 -->
        <div class="detail-left">
          <!-- 基本信息卡片 -->
          <div class="info-card">
            <h3 class="card-title">基本信息</h3>
            <div class="info-list">
              <div class="info-item">
                <span class="info-label">合作社：</span>
                <span class="info-value">{{ category.cooperative?.name || '未知' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">上市期：</span>
                <span class="info-value">{{ category.season || '未提供' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">合作社级别：</span>
                <span class="info-value">{{ category.cooperative?.level || '未评级' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">质量认证：</span>
                <span class="info-value">{{ category.cooperative?.quality || '无认证' }}</span>
              </div>
            </div>
          </div>
          
          <!-- 销售数据卡片 -->
          <div v-if="hasFinancialData" class="stats-card">
            <h3 class="card-title">销售数据</h3>
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-icon">📦</div>
                <div class="stat-content">
                  <div class="stat-number">{{ formatNumber(category.stats.annualSales) }}</div>
                  <div class="stat-label">年销量（吨）</div>
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-icon">💰</div>
                <div class="stat-content">
                  <div class="stat-number">{{ formatNumber(category.stats.annualRevenue) }}</div>
                  <div class="stat-label">年销售额（万元）</div>
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-icon">📊</div>
                <div class="stat-content">
                  <div class="stat-number">{{ formatPrice(category.stats.pricePerTon) }}</div>
                  <div class="stat-label">单价（元/吨）</div>
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-icon">🌱</div>
                <div class="stat-content">
                  <div class="stat-number">{{ formatNumber(category.stats.plantingArea) }}</div>
                  <div class="stat-label">种植面积（亩）</div>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="stats-card no-data">
            <h3 class="card-title">销售数据</h3>
            <div class="no-data-content">
              <span class="no-data-icon">📊</span>
              <p class="no-data-text">暂无销售数据</p>
            </div>
          </div>
        </div>
        
        <!-- 右侧：详细信息 -->
        <div class="detail-right">
          <!-- 产品展示 -->
          <div class="product-display-card">
            <h3 class="card-title">产品展示</h3>
            <div class="display-content">
              <!-- 如果有图片 -->
              <div v-if="category.imageUrl" class="product-image-container">
                <img 
                  :src="productImageUrl" 
                  :alt="category.name" 
                  class="product-main-image"
                  @error="handleImageError"
                />
                <div class="image-caption">
                  <p>{{ category.name }} - {{ category.cooperative?.name }}</p>
                </div>
              </div>
              
              <!-- 图片加载失败 -->
              <div v-else-if="category.imageUrl" class="image-missing">
                <div class="missing-icon">📷</div>
                <h4>图片暂时无法显示</h4>
                <p class="missing-desc">{{ getProductDescription(category.name) }}</p>
              </div>
              
              <!-- 只有文字描述 -->
              <div v-else-if="hasDescription" class="text-description">
                <div class="description-text">
                  {{ cleanDescription(category.description) }}
                </div>
              </div>
              
              <!-- 无内容 -->
              <div v-else class="no-display-content">
                <span class="no-content-icon">📝</span>
                <p>暂无产品展示信息</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 加载状态 -->
    <div v-else-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>正在加载品类详情...</p>
    </div>
    
    <!-- 404状态 -->
    <div v-else class="not-found">
      <div class="not-found-icon">❓</div>
      <h2>品类不存在</h2>
      <p>请求的品类可能已被删除或不存在</p>
      <p class="debug-info">ID: {{ route.params.id }}</p>
      <button @click="goBack" class="back-home-button">
        返回品类列表
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import dataService from '../../services/dataService'

const route = useRoute()
const router = useRouter()

const category = ref(null)
const loading = ref(true)

onMounted(() => {
  loadCategoryDetail()
})

const loadCategoryDetail = () => {
  const id = route.params.id
  console.log('详情页接收到的ID:', id)
  
  // 等待数据服务初始化
  const checkData = () => {
    if (dataService.categories && dataService.categories.length > 0) {
      console.log('数据已加载，开始查找...')
      
      // 查找品类
      category.value = dataService.getCategoryDetail(id)
      
      if (category.value) {
        console.log('成功找到品类:', category.value.name)
        console.log('原始图片URL:', category.value.imageUrl)
        console.log('解码后图片URL:', productImageUrl.value)
        
        // 调试：检查图片路径
        if (category.value.imageUrl) {
          // 测试图片是否可访问
          const img = new Image()
          img.src = productImageUrl.value
          img.onload = () => console.log('图片可正常加载');
          img.onerror = () => {
            console.log('图片加载失败，路径:', productImageUrl.value);
            console.log('建议直接访问:', productImageUrl.value);
            };
        } else {
          console.log('无图片URL');
        }
      } else {
        console.log('未找到品类，ID:', id)
      }
      
      loading.value = false
    } else {
      setTimeout(checkData, 100)
    }
  }
  
  checkData()
}

// 计算图片URL（处理URL编码）
const productImageUrl = computed(() => {
  if (!category.value?.imageUrl) return null
  
  // 解码URL中的中文字符
  try {
    const decoded = decodeURIComponent(category.value.imageUrl)
    console.log('URL解码:', category.value.imageUrl, '→', decoded)

    // 添加基础路径前缀
    // 确保路径以 /fruit-frontend/ 开头
    let finalUrl = decoded
    if (!finalUrl.startsWith('/fruit-frontend/') && !finalUrl.startsWith('http')) {
      finalUrl = '/fruit-frontend' + (finalUrl.startsWith('/') ? '' : '/') + finalUrl
    }
    
    console.log('最终图片URL:', finalUrl)
    return finalUrl
  } catch (error) {
    console.log('URL解码失败，使用原路径:', error)
    // 同样添加基础路径
    let finalUrl = category.value.imageUrl
    if (!finalUrl.startsWith('/fruit-frontend/') && !finalUrl.startsWith('http')) {
      finalUrl = '/fruit-frontend' + (finalUrl.startsWith('/') ? '' : '/') + finalUrl
    }
    return finalUrl
  }
})

// 计算属性
const hasDescription = computed(() => {
  const desc = category.value?.description
  return desc && desc.trim() !== '' && !desc.includes('DISPIMG') && !desc.includes('_xlfn')
})

const hasFinancialData = computed(() => {
  return category.value?.stats?.annualSales > 0
})

// 格式化方法
const formatNumber = (num) => {
  if (typeof num !== 'number' || isNaN(num) || num === 0) return '0'
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toLocaleString()
}

const formatPrice = (price) => {
  if (typeof price !== 'number' || isNaN(price) || price === 0) return '0'
  return Math.round(price).toLocaleString()
}

const formatSeason = (season) => {
  if (!season || season.trim() === '') return '未提供'
  if (season.includes('全年') || season.includes('一年四季')) {
    return '全年供应'
  }
  return season
}

const cleanDescription = (desc) => {
  if (!desc) return '暂无产品描述'
  // 清理 Excel 公式
  if (desc.includes('DISPIMG') || desc.includes('_xlfn')) {
    return getProductDescription(category.value?.name)
  }
  return desc
}

// 获取产品描述
const getProductDescription = (categoryName) => {
  const descriptions = {
    '番茄': '番茄含有丰富的胡萝卜素、维生素C和B族维生素，营养价值高，既可作为蔬菜也可作为水果，既可生食也可熟食。',
    '青菜': '青菜口感鲜嫩，富含维生素和矿物质，多季上市供应稳定。',
    '黄瓜': '黄瓜新鲜爽口，水分充足，适合生食或凉拌。',
  }
  return descriptions[categoryName] || '暂无详细描述'
}

// 图片加载失败处理
const handleImageError = (e) => {
  console.log('详情页图片加载失败:', e.target.src)
  e.target.style.display = 'none'
  const parent = e.target.parentElement
  parent.innerHTML = `
    <div class="image-missing">
      <div class="missing-icon">📷</div>
      <h4>图片暂时无法显示</h4>
      <p class="missing-desc">${getProductDescription(category.value?.name)}</p>
      <p class="image-url-debug">图片路径: ${e.target.src}</p>
    </div>
  `
}

// 操作方法
const goBack = () => {
  router.push('/categories')
}
</script>

<style scoped>
.category-detail-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #f8fff8 0%, #ffffff 100%);
  padding: 20px;
}

.back-nav {
  max-width: 1200px;
  margin: 0 auto 20px;
}

.back-button {
  padding: 10px 20px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.back-button:hover {
  border-color: #4caf50;
  color: #4caf50;
  background: #f8fff8;
}

.detail-content {
  max-width: 1200px;
  margin: 0 auto;
}

.detail-header {
  margin-bottom: 30px;
  padding: 30px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.category-title {
  font-size: 2.2rem;
  color: #2c662d;
  margin: 0 0 20px 0;
  font-weight: 600;
}

.header-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.header-tags .tag {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.demo-tag {
  background: rgba(76, 175, 80, 0.1);
  color: #2e7d32;
  border: 1px solid rgba(76, 175, 80, 0.3);
}

.quality-tag {
  background: rgba(255, 193, 7, 0.1);
  color: #ff9800;
  border: 1px solid rgba(255, 193, 7, 0.3);
}

.season-tag {
  background: rgba(33, 150, 243, 0.1);
  color: #1976d2;
  border: 1px solid rgba(33, 150, 243, 0.3);
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 30px;
}

.detail-left,
.detail-right {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-card,
.stats-card,
.product-display-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f0f0;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.info-label {
  font-size: 14px;
  color: #666;
  min-width: 100px;
}

.info-value {
  font-size: 14px;
  color: #333;
  font-weight: 500;
  flex: 1;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-icon {
  font-size: 24px;
  opacity: 0.7;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 18px;
  font-weight: 600;
  color: #2c662d;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #666;
}

.no-data {
  text-align: center;
  padding: 30px 20px;
}

.no-data-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.no-data-icon {
  font-size: 48px;
  opacity: 0.3;
}

.no-data-text {
  color: #888;
  font-size: 16px;
}

/* 产品展示样式 */
.display-content {
  min-height: 300px;
}

.product-image-container {
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
}

.product-main-image {
  max-width: 100%;
  max-height: 400px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.image-caption {
  margin-top: 15px;
  padding-top: 10px;
  border-top: 1px solid #dee2e6;
  color: #6c757d;
  font-style: italic;
}

.image-missing {
  text-align: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  border: 2px dashed #ced4da;
}

.image-url-debug {
  font-size: 12px;
  color: #666;
  background: #f5f5f5;
  padding: 5px;
  border-radius: 3px;
  margin-top: 10px;
  font-family: monospace;
  word-break: break-all;
}

.missing-icon {
  font-size: 48px;
  margin-bottom: 20px;
  opacity: 0.6;
}

.missing-desc {
  font-size: 16px;
  color: #495057;
  margin: 15px 0;
  line-height: 1.6;
}

.text-description {
  padding: 30px;
  background: #f8f9fa;
  border-radius: 12px;
  line-height: 1.8;
}

.description-text {
  line-height: 1.8;
  color: #555;
  font-size: 15px;
  white-space: pre-line;
}

.no-display-content {
  text-align: center;
  padding: 60px 20px;
  color: #adb5bd;
}

.no-content-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 20px;
  opacity: 0.5;
}

/* 加载和错误状态 */
.loading-state,
.not-found {
  text-align: center;
  padding: 100px 20px;
}

.loading-spinner {
  display: inline-block;
  width: 50px;
  height: 50px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #4caf50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.not-found-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.not-found h2 {
  color: #555;
  margin-bottom: 10px;
}

.not-found p {
  color: #888;
  margin-bottom: 10px;
}

.debug-info {
  font-family: monospace;
  background: #f5f5f5;
  padding: 10px;
  border-radius: 5px;
  margin: 20px 0;
  color: #666;
}

.back-home-button {
  padding: 12px 24px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.back-home-button:hover {
  background: #45a049;
  transform: translateY(-1px);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .detail-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .category-title {
    font-size: 1.8rem;
  }
}

@media (max-width: 768px) {
  .category-detail-container {
    padding: 15px;
  }
  
  .detail-header {
    padding: 20px;
  }
  
  .category-title {
    font-size: 1.5rem;
  }
  
  .info-card,
  .stats-card,
  .product-display-card {
    padding: 20px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .header-tags .tag {
    padding: 6px 12px;
    font-size: 12px;
  }
  
  .info-label {
    min-width: 80px;
  }
  
  .product-main-image {
    max-height: 300px;
  }
}
</style>