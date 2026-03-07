[file name]: CategoryCard.vue
<template>
  <div class="category-card" @click="handleClick">
    <div class="card-header">
      <h3 class="category-name">{{ category.name }}</h3>
      <div class="category-tags">
        <!-- 示范级别标签 -->
        <span v-if="category.cooperative?.level" class="tag demo-tag">
          {{ category.cooperative.level }}
        </span>
        
        <!-- 质量认证标签 -->
        <span v-if="category.cooperative?.quality" class="tag quality-tag">
          {{ category.cooperative.quality }}
        </span>
        
        <!-- 季节标签 -->
        <span v-if="category.season" class="tag season-tag">
          {{ formatSeason(category.season) }}
        </span>
        
        <!-- 销售数据标签 -->
        <span v-if="category.stats?.annualSales > 0" class="tag sales-tag">
          有销售数据
        </span>
      </div>
    </div>
    
    <div class="card-body">
      <!-- 合作社信息 -->
      <div class="cooperative-info">
        <span class="coop-label">合作社：</span>
        <span class="coop-name">{{ category.cooperative?.name || '未知' }}</span>
      </div>
      
      <!-- 内容预览（图片或描述） -->
      <div class="content-preview">
        <!-- 如果有图片 -->
        <div v-if="category.imageUrl" class="image-preview">
          <img 
            :src="formatImageUrl(category.imageUrl)" 
            :alt="category.name" 
            class="preview-image"
            @error="handleImageError"
          />
          <div class="image-overlay">
            <span class="view-image-text">查看图片</span>
          </div>
        </div>
        
        <!-- 如果只有文字描述 -->
        <p v-else-if="category.description" class="category-description">
          {{ truncateDescription(category.description) }}
        </p>
        
        <!-- 无内容 -->
        <div v-else class="no-content">
          <span class="no-content-icon">📝</span>
          <span>暂无描述</span>
        </div>
      </div>
      
      <!-- 销售数据（如果有） -->
      <div v-if="category.stats?.annualSales > 0" class="sales-stats">
        <div class="stat-row">
          <div class="stat-item">
            <div class="stat-label">年销量</div>
            <div class="stat-value">{{ formatNumber(category.stats.annualSales) }}吨</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">年销售额</div>
            <div class="stat-value">{{ formatNumber(category.stats.annualRevenue) }}万元</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">单价</div>
            <div class="stat-value price" :class="getPriceLevel(category.stats.pricePerTon)">
              {{ formatPrice(category.stats.pricePerTon) }}元/吨
            </div>
          </div>
        </div>
      </div>
      
      <!-- 无销售数据提示 -->
      <div v-else class="no-data">
        <span class="no-data-text">暂无销售数据</span>
      </div>
    </div>
    
    <div class="card-footer">
      <button class="view-detail-btn" @click.stop="handleDetailClick">
        查看详情
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  category: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click'])

// 图片URL处理函数
const formatImageUrl = (imageUrl) => {
  if (!imageUrl) return null
  
  console.log('原始图片URL:', imageUrl)
  
  // 如果已经是完整路径，直接返回
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl
  }
  
  // 如果已经有基础路径，直接返回
  if (imageUrl.startsWith('/fruit-frontend/')) {
    return imageUrl
  }
  
  // 处理从数据库获取的路径（以 /images/ 开头）
  if (imageUrl.startsWith('/images/')) {
    return `/fruit-frontend${imageUrl}`
  }
  
  try {
    // 解码URL编码的字符
    const decoded = decodeURIComponent(imageUrl)
    console.log('解码后:', decoded)
    
    // 提取文件名
    const fileName = decoded.split('/').pop()
    console.log('文件名:', fileName)
    
    // 返回正确的路径 - 添加基础路径
    const finalUrl = `/fruit-frontend/images/categories/${fileName}`
    console.log('最终路径:', finalUrl)
    
    return finalUrl
  } catch (error) {
    console.log('解码失败，尝试添加基础路径:', error)
    
    // 即使解码失败，也尝试添加基础路径
    if (imageUrl.startsWith('/')) {
      return `/fruit-frontend${imageUrl}`
    } else {
      return `/fruit-frontend/${imageUrl}`
    }
  }
}

// 格式化数字
const formatNumber = (num) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toLocaleString()
}

// 格式化价格
const formatPrice = (price) => {
  return Math.round(price).toLocaleString()
}

// 价格等级
const getPriceLevel = (price) => {
  if (price === 0) return ''
  if (price < 3000) return 'low'
  if (price < 8000) return 'medium'
  return 'high'
}

// 格式化季节
const formatSeason = (season) => {
  if (!season) return ''
  if (season.includes('全年') || season.includes('一年四季')) {
    return '全年'
  }
  return season.length > 6 ? season.substring(0, 6) + '...' : season
}

// 截断描述
const truncateDescription = (desc) => {
  if (!desc) return ''
  
  // 如果是图片引用，返回空
  if (desc.includes('DISPIMG') || desc.includes('_xlfn')) {
    return ''
  }
  
  if (desc.length > 80) {
    return desc.substring(0, 80) + '...'
  }
  return desc
}

// 图片加载失败处理
const handleImageError = (e) => {
  console.log('图片加载失败:', e.target.src)
  e.target.style.display = 'none'
  const parent = e.target.parentElement
  parent.innerHTML = `
    <div class="image-fallback">
      <span class="fallback-icon">📷</span>
      <p>图片加载失败</p>
    </div>
  `
}

// 点击事件
const handleClick = () => {
  emit('click', props.category.id)
}

const handleDetailClick = (e) => {
  e.stopPropagation()
  emit('click', props.category.id)
}
</script>

<style scoped>
.category-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: rgba(76, 175, 80, 0.3);
}

.card-header {
  margin-bottom: 20px;
}

.category-name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.category-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
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

.sales-tag {
  background: rgba(156, 39, 176, 0.1);
  color: #7b1fa2;
  border: 1px solid rgba(156, 39, 176, 0.3);
}

.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cooperative-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.coop-label {
  font-size: 13px;
  color: #666;
}

.coop-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

/* 内容预览区域 */
.content-preview {
  height: 100px;
  overflow: hidden;
  border-radius: 8px;
  background: #f8f9fa;
  margin: 5px 0;
}

.image-preview {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.category-card:hover .preview-image {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.category-card:hover .image-overlay {
  opacity: 1;
}

.view-image-text {
  color: white;
  font-size: 14px;
  font-weight: 500;
  padding: 6px 12px;
  background: rgba(76, 175, 80, 0.9);
  border-radius: 16px;
}

.image-fallback {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #6c757d;
}

.fallback-icon {
  font-size: 28px;
  margin-bottom: 8px;
  opacity: 0.5;
}

.category-description {
  font-size: 14px;
  line-height: 1.6;
  color: #666;
  margin: 0;
  padding: 10px 0;
  flex: 1;
}

.no-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #adb5bd;
}

.no-content-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.sales-stats {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
}

.stat-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.stat-item {
  text-align: center;
}

.stat-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.stat-value.price.low {
  color: #4caf50;
}

.stat-value.price.medium {
  color: #ff9800;
}

.stat-value.price.high {
  color: #f44336;
}

.no-data {
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.no-data-text {
  font-size: 14px;
  color: #999;
  font-style: italic;
}

.card-footer {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.view-detail-btn {
  width: 100%;
  padding: 12px;
  background: transparent;
  border: 1px solid #4caf50;
  border-radius: 8px;
  color: #4caf50;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.view-detail-btn:hover {
  background: #4caf50;
  color: white;
}

@media (max-width: 768px) {
  .category-card {
    padding: 20px;
  }
  
  .stat-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .content-preview {
    height: 80px;
  }
}
</style>