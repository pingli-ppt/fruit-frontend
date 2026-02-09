[file name]: CategoryFilter.vue
<template>
  <div class="category-filter">
    <div class="filter-header">
      <h3 class="filter-title">筛选品类</h3>
      <button @click="handleReset" class="clear-all-btn">清空所有</button>
    </div>
    
    <div class="filter-sections">
      <!-- 品类名称搜索 -->
      <div class="filter-section">
        <div class="input-wrapper">
          <input
            type="text"
            placeholder="输入品类名称..."
            :value="localFilters.categoryName"
            @input="updateFilter('categoryName', $event.target.value)"
            class="filter-input"
          />
          <span class="input-icon search-icon">🔍</span>
        </div>
      </div>
      
      <!-- 合作社筛选 -->
      <div class="filter-section">
        <div class="input-wrapper">
          <select
            :value="localFilters.cooperativeName"
            @change="updateFilter('cooperativeName', $event.target.value)"
            class="filter-select"
          >
            <option value="">全部合作社</option>
            <option 
              v-for="coop in cooperatives" 
              :key="coop.name" 
              :value="coop.name"
            >
              {{ coop.name }}
              <template v-if="coop.level">({{ coop.level }})</template>
            </option>
          </select>
          <span class="input-icon select-icon">▼</span>
        </div>
      </div>
      
      <!-- 示范级别 -->
      <div class="filter-section" v-if="demoLevels.length > 0">
        <div class="filter-tags">
          <button
            v-for="level in demoLevels"
            :key="level"
            :class="['tag-button', { active: localFilters.demoLevel === level }]"
            @click="toggleDemoLevel(level)"
          >
            {{ level }}
          </button>
        </div>
      </div>
      
      <!-- 质量认证 -->
      <div class="filter-section" v-if="qualityCerts.length > 0">
        <div class="filter-tags">
          <button
            v-for="cert in qualityCerts"
            :key="cert"
            :class="['tag-button', { active: localFilters.qualityCert === cert }]"
            @click="toggleQualityCert(cert)"
          >
            {{ cert }}
          </button>
        </div>
      </div>
      
      <!-- 上市期 -->
      <div class="filter-section">
        <div class="input-wrapper">
          <input
            type="text"
            placeholder="上市期..."
            :value="localFilters.season"
            @input="updateFilter('season', $event.target.value)"
            class="filter-input"
          />
        </div>
      </div>
      
      <!-- 销售数据筛选 -->
      <div class="filter-section checkbox-section">
        <label class="checkbox-label">
          <input
            type="checkbox"
            :checked="localFilters.hasFinancialData"
            @change="updateFilter('hasFinancialData', $event.target.checked)"
            class="checkbox-input"
          />
          <span class="checkbox-custom"></span>
          <span class="checkbox-text">仅显示有销售数据的品类</span>
        </label>
      </div>
    </div>
    
    <div class="filter-actions">
      <button @click="applyFilters" class="apply-btn">
        应用筛选
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, defineProps, defineEmits } from 'vue'

const props = defineProps({
  filters: {
    type: Object,
    required: true
  },
  cooperatives: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:filters', 'reset'])

// 本地筛选状态
const localFilters = ref({ ...props.filters })

// 提取选项
const demoLevels = computed(() => {
  const levels = new Set()
  props.cooperatives.forEach(coop => {
    if (coop.level && coop.level !== '否') levels.add(coop.level)
  })
  return Array.from(levels)
})

const qualityCerts = computed(() => {
  const certs = new Set()
  props.cooperatives.forEach(coop => {
    if (coop.quality && coop.quality.trim()) certs.add(coop.quality)
  })
  return Array.from(certs)
})

// 更新筛选
const updateFilter = (key, value) => {
  localFilters.value = { ...localFilters.value, [key]: value }
}

// 切换示范级别
const toggleDemoLevel = (level) => {
  if (localFilters.value.demoLevel === level) {
    updateFilter('demoLevel', '')
  } else {
    updateFilter('demoLevel', level)
  }
}

// 切换质量认证
const toggleQualityCert = (cert) => {
  if (localFilters.value.qualityCert === cert) {
    updateFilter('qualityCert', '')
  } else {
    updateFilter('qualityCert', cert)
  }
}

// 应用筛选
const applyFilters = () => {
  emit('update:filters', localFilters.value)
}

// 重置筛选
const handleReset = () => {
  localFilters.value = {
    categoryName: '',
    cooperativeName: '',
    demoLevel: '',
    qualityCert: '',
    season: '',
    hasFinancialData: false
  }
  emit('reset')
}

// 监听props变化
watch(() => props.filters, (newFilters) => {
  localFilters.value = { ...newFilters }
}, { deep: true })
</script>

<style scoped>
.category-filter {
  background: white;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e8e8e8;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  font-size: 13px;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.filter-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.clear-all-btn {
  padding: 4px 10px;
  background: transparent;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  color: #666;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-all-btn:hover {
  color: #ff6b6b;
  border-color: #ff6b6b;
}

.filter-sections {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.filter-section {
  display: flex;
  flex-direction: column;
}

/* 统一的输入框包装器 */
.input-wrapper {
  position: relative;
  width: 100%;
}

/* 统一的输入样式 */
.filter-input,
.filter-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 12px;
  transition: all 0.2s;
  background: white;
  box-sizing: border-box; /* 确保宽度计算一致 */
}

/* 搜索框有图标时的内边距 */
.input-wrapper .filter-input {
  padding-left: 30px;
  padding-right: 12px;
}

/* 下拉框样式 */
.input-wrapper .filter-select {
  appearance: none; /* 移除默认下拉箭头 */
  -webkit-appearance: none;
  -moz-appearance: none;
  padding-right: 30px;
  cursor: pointer;
}

/* 统一的图标样式 */
.input-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-size: 10px;
  pointer-events: none; /* 确保可以点击输入框 */
}

.search-icon {
  left: 10px;
}

.select-icon {
  right: 10px;
  font-size: 8px;
}

.filter-input:focus,
.filter-select:focus {
  outline: none;
  border-color: #4caf50;
  box-shadow: 0 0 0 1px rgba(76, 175, 80, 0.2);
}

/* 标签按钮样式 */
.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag-button {
  padding: 6px 10px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 14px;
  color: #666;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.tag-button:hover {
  background: #f8f8f8;
  border-color: #d0d0d0;
}

.tag-button.active {
  background: #4caf50;
  color: white;
  border-color: #4caf50;
  font-weight: 500;
}

/* 复选框样式 */
.checkbox-section {
  margin-top: 4px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  user-select: none;
}

.checkbox-input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkbox-custom {
  position: relative;
  height: 16px;
  width: 16px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 3px;
  transition: all 0.2s;
  flex-shrink: 0;
}

.checkbox-input:checked ~ .checkbox-custom {
  background-color: #4caf50;
  border-color: #4caf50;
}

.checkbox-input:checked ~ .checkbox-custom::after {
  content: "✓";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 10px;
}

.checkbox-text {
  font-size: 12px;
  color: #555;
  line-height: 1.3;
}

/* 应用按钮样式 */
.filter-actions {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.apply-btn {
  width: 100%;
  padding: 10px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.apply-btn:hover {
  background: #45a049;
}

@media (max-width: 768px) {
  .category-filter {
    padding: 12px;
  }
  
  .filter-sections {
    gap: 10px;
  }
  
  .filter-input,
  .filter-select {
    padding: 7px 10px;
    font-size: 11px;
  }
  
  .input-wrapper .filter-input {
    padding-left: 28px;
  }
  
  .input-wrapper .filter-select {
    padding-right: 28px;
  }
  
  .search-icon {
    left: 8px;
  }
  
  .select-icon {
    right: 8px;
  }
  
  .tag-button {
    padding: 5px 8px;
    font-size: 10px;
  }
}
</style>