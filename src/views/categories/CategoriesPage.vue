<template>
  <div class="categories-container">
    <!-- 顶部标题 -->
    <div class="categories-header">
      <h1 class="page-title">农产品品类数据库</h1>
      <p class="page-subtitle">汇集优质合作社，提供可靠的农产品信息</p>
      
      <!-- 统计数据 - 使用硬编码确保显示 -->
      <CategoryStats :stats="statsData" />
    </div>
    
    <!-- 主要内容区域 -->
    <div class="categories-main">
      <!-- 左侧筛选 -->
      <div class="categories-sidebar">
        <CategoryFilter 
          :filters="activeFilters"
          :cooperatives="cooperatives"
          @update:filters="handleFilterUpdate"
          @reset="resetFilters"
        />
      </div>
      
      <!-- 右侧列表 -->
      <div class="categories-content">
        <!-- 结果信息 -->
        <div class="results-header">
          <div class="results-count">
            共找到 <span class="count-number">{{ totalItems }}</span> 个品类
          </div>
          <div class="results-sort">
            <select v-model="sortBy" class="sort-select">
              <option value="default">默认排序</option>
              <option value="sales">销量最高</option>
              <option value="revenue">销售额最高</option>
              <option value="price">价格最高</option>
              <option value="name">名称排序</option>
            </select>
          </div>
        </div>
        
        <!-- 加载状态 -->
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>正在加载品类数据...</p>
        </div>
        
        <!-- 空状态 -->
        <div v-else-if="filteredCategories.length === 0" class="empty-state">
          <div class="empty-icon">📋</div>
          <h3>没有找到匹配的品类</h3>
          <p>请尝试调整筛选条件</p>
          <button @click="resetFilters" class="reset-button">重置所有筛选</button>
        </div>
        
        <!-- 品类列表 -->
        <div v-else class="categories-grid">
          <CategoryCard
            v-for="category in categories"
            :key="category.id"
            :category="category"
            @click="viewCategoryDetail(category.id)"
          />
        </div>
        
        <!-- 分页 -->
        <CategoryPagination
          v-if="filteredCategories.length > 0"
          :current-page="currentPage"
          :total-items="totalItems"
          :items-per-page="itemsPerPage"
          @page-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import CategoryStats from '../../components/categories/CategoryStats.vue'
import CategoryFilter from '../../components/categories/CategoryFilter.vue'
import CategoryCard from '../../components/categories/CategoryCard.vue'
import CategoryPagination from '../../components/categories/CategoryPagination.vue'
import dataService from '../../services/dataService'

const router = useRouter()

// 1. 先声明所有状态变量
// 状态管理
const categories = ref([])
const filteredResult = ref([]) // 存储筛选结果
const cooperatives = ref([])
const statsData = ref({
  totalCategories: 20,
  demoCooperatives: 5,
  totalCooperatives: 6
})
const loading = ref(true)
const totalItems = ref(0)  // 定义总条数变量

// 筛选和排序
const activeFilters = ref({
  categoryName: '',
  cooperativeName: '',
  demoLevel: '',
  qualityCert: '',
  season: '',
  hasFinancialData: false,
  status: undefined
})
const sortBy = ref('default')

// 分页
const currentPage = ref(1)
const itemsPerPage = 12

// 2. 然后再声明函数（这样函数内部才能使用上面的变量）
// 更新URL查询参数
const updateQueryParams = () => {
  const query = {
    page: currentPage.value,
    sortBy: sortBy.value,
    ...activeFilters.value
  }
  // 删除空值
  Object.keys(query).forEach(key => {
    if (query[key] === '' || query[key] === undefined || query[key] === null) {
      delete query[key]
    }
  })
  router.replace({ query })
}

// 事件处理
const handleFilterUpdate = async (newFilters) => {
  activeFilters.value = { ...activeFilters.value, ...newFilters }
  currentPage.value = 1
  updateQueryParams() // 更新URL
  loading.value = true
  await loadCategories()
  loading.value = false
}

const resetFilters = async () => {
  activeFilters.value = {
    categoryName: '',
    cooperativeName: '',
    demoLevel: '',
    qualityCert: '',
    season: '',
    hasFinancialData: false,
    status: undefined
  }
  sortBy.value = 'default'
  currentPage.value = 1
  updateQueryParams() // 更新URL
  loading.value = true
  await loadCategories()
  loading.value = false
}

const handlePageChange = async (page) => {
  currentPage.value = page
  updateQueryParams() // 更新URL
  loading.value = true
  await loadCategories()
  loading.value = false
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 监听排序变化
watch(sortBy, async () => {
  currentPage.value = 1
  updateQueryParams() // 更新URL
  loading.value = true
  await loadCategories()
  loading.value = false
})

// 加载数据
onMounted(async () => {
  loading.value = true
  
  try {
    // 从URL查询参数中恢复状态
    const query = router.currentRoute.value.query
    if (query.page) {
      currentPage.value = parseInt(query.page)
    }
    if (query.sortBy) {
      sortBy.value = query.sortBy
    }
    // 恢复筛选条件
    if (query.categoryName) activeFilters.value.categoryName = query.categoryName
    if (query.cooperativeName) activeFilters.value.cooperativeName = query.cooperativeName
    if (query.demoLevel) activeFilters.value.demoLevel = query.demoLevel
    if (query.qualityCert) activeFilters.value.qualityCert = query.qualityCert
    if (query.hasFinancialData) activeFilters.value.hasFinancialData = query.hasFinancialData === 'true'

    // 获取统计数据
    const stats = await dataService.getStats()
    if (stats) {
      statsData.value = stats
    }
    
    // 获取合作社列表
    const coopList = await dataService.getCooperatives()
    cooperatives.value = coopList
    
    // 获取品类列表
    await loadCategories()
    
  } catch (error) {
    console.error('加载数据失败:', error)
  } finally {
    loading.value = false
  }
})

// 加载品类列表
const loadCategories = async () => {
  try {
    // 构建查询参数
    const params = new URLSearchParams({
      page: currentPage.value,
      limit: itemsPerPage,
      sortBy: sortBy.value
    });
    
    // 添加筛选条件
    if (activeFilters.value.categoryName) {
      params.append('categoryName', activeFilters.value.categoryName);
    }
    if (activeFilters.value.cooperativeName) {
      params.append('cooperativeName', activeFilters.value.cooperativeName);
    }
    if (activeFilters.value.demoLevel) {
      params.append('demoLevel', activeFilters.value.demoLevel);
    }
    if (activeFilters.value.qualityCert) {
      params.append('qualityCert', activeFilters.value.qualityCert);
    }
    if (activeFilters.value.hasFinancialData) {
      params.append('hasFinancialData', 'true');
    }
    // 状态筛选
    if (activeFilters.value.status !== undefined && activeFilters.value.status !== null) {
      params.append('status', activeFilters.value.status);
    }

    // 调用API获取数据
    const url = `http://localhost:3000/api/categories?${params.toString()}`;
    console.log('请求URL:', url);  // 调试用
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const result = await response.json();
    console.log('API返回数据:', result);
    
    if (result.code === 0 && result.data) {
      // 设置当前页的数据
      categories.value = result.data.categories || [];
      
      // 更新总条数用于分页
      if (result.data.pagination) {
        // 把总条数存储到一个新的ref变量
        totalItems.value = result.data.pagination.totalItems || 0;
        console.log('总条数:', totalItems.value);
      }
    } else {
      categories.value = [];
      totalItems.value = 0;
    }
  } catch (error) {
    console.error('加载品类列表失败:', error)
    categories.value = []
    totalItems.value = 0
  }
}

// 筛选后的品类
const filteredCategories = computed(() => {
  return Array.isArray(categories.value) ? categories.value : []
})

// 分页后的品类 - 直接返回从API获取的数据
const paginatedCategories = computed(() => {
  return Array.isArray(categories.value) ? categories.value : []
})

const viewCategoryDetail = (id) => {
  // 跳转到详情页时，把当前页码作为查询参数传递
  router.push({
    path: `/category/${id}`,
    query: {
      page: currentPage.value,
      sortBy: sortBy.value,
      ...activeFilters.value
    }
  })
}

// 监听排序变化
watch(sortBy, async () => {
  currentPage.value = 1
  loading.value = true
  await loadCategories()
  loading.value = false
})
</script>

<style scoped>
.categories-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #f8fff8 0%, #ffffff 100%);
  padding: 20px;
}

.categories-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 30px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(76, 175, 80, 0.1);
}

.page-title {
  font-size: 2.5rem;
  color: #2c662d;
  margin-bottom: 10px;
  font-weight: 600;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 30px;
}

.categories-main {
  display: flex;
  gap: 30px;
  max-width: 1400px;
  margin: 0 auto;
}

.categories-sidebar {
  width: 280px;
  flex-shrink: 0;
}

.categories-content {
  flex: 1;
  min-width: 0;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.results-count {
  font-size: 16px;
  color: #555;
}

.count-number {
  font-weight: bold;
  color: #4caf50;
  font-size: 20px;
  margin: 0 5px;
}

.sort-select {
  padding: 10px 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  font-size: 14px;
  min-width: 150px;
  cursor: pointer;
  transition: all 0.3s;
}

.sort-select:focus {
  outline: none;
  border-color: #4caf50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.loading-state {
  text-align: center;
  padding: 60px 20px;
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

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.empty-state h3 {
  color: #555;
  margin-bottom: 10px;
}

.empty-state p {
  color: #888;
  margin-bottom: 20px;
}

.reset-button {
  padding: 12px 24px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.reset-button:hover {
  background: #45a049;
  transform: translateY(-1px);
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .categories-main {
    flex-direction: column;
  }
  
  .categories-sidebar {
    width: 100%;
  }
  
  .categories-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .results-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .categories-grid {
    grid-template-columns: 1fr;
  }
}
</style>