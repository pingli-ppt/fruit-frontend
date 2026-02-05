<template>
  <MainLayout>
    <div class="product-page">
      <h1>产品与服务</h1>

      <!-- C/B 端切换 -->
      <div class="tab-switch">
        <button :class="{ active: mode==='consumer' }" @click="mode='consumer'">消费者服务</button>
        <button :class="{ active: mode==='enterprise' }" @click="mode='enterprise'">企业服务</button>
      </div>

      <!-- 筛选栏 -->
      <ProductFilter
        v-model:category="category"
        v-model:origin="origin"
        v-model:sort="sort"
        :mode="mode"
      />

      <!-- 产品列表 -->
      <div class="product-list">
        <ProductCard
          v-for="item in pagedList"
          :key="item.id"
          :product="item"
          :mode="mode"
          @trace="goTrace"
        />
      </div>

      <!-- 分页 -->
      <Pagination
        v-model:page="page"
        :pageSize="pageSize"
        :total="filteredList.length"
      />
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
import ProductCard from '../components/ProductCard.vue'
import ProductFilter from '../components/ProductFilter.vue'
import Pagination from '../components/Pagination.vue'

// 路由
const router = useRouter()

// C/B 模式
const mode = ref('consumer') // consumer 或 enterprise

// 筛选参数
const category = ref('')
const origin = ref('')
const sort = ref('')

// 分页参数
const page = ref(1)
const pageSize = ref(8)

// 产品数据示例
const consumerProducts = ref([
  { id:1, name:'红富士苹果', category:'apple', origin:'山东', price:8, batchCode:'AP20250901', time:3 },
  { id:2, name:'赣南脐橙', category:'orange', origin:'上海', price:6, batchCode:'OR20250902', time:1 },
])

const enterpriseProducts = ref([
  { id:1, name:'红富士苹果', category:'apple', origin:'山东', price:8, batchCode:'AP20250901', stock:500 },
  { id:2, name:'青香蕉', category:'banana', origin:'海南', price:5, batchCode:'BN20250901', stock:300 },
])

// 选择数据源
const products = computed(() => mode.value === 'consumer' ? consumerProducts.value : enterpriseProducts.value)

// 筛选 + 排序
const filteredList = computed(() => {
  let list = products.value
  if (category.value) list = list.filter(i => i.category === category.value)
  if (origin.value) list = list.filter(i => i.origin === origin.value)

  if (sort.value === 'price') list = [...list].sort((a,b)=>a.price-b.price)
  if (sort.value === 'time') list = [...list].sort((a,b)=>a.time-b.time)
  return list
})

// 分页数据
const pagedList = computed(() => {
  const start = (page.value-1)*pageSize.value
  return filteredList.value.slice(start, start+pageSize.value)
})

// 溯源跳转
const goTrace = (code) => {
  router.push({ path:'/trace', query:{ code } })
}
</script>

<style scoped>
.product-page {
  max-width: 1000px;
  margin: 30px auto;
}

.tab-switch {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.tab-switch button {
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}
.tab-switch button.active {
  background: #4caf50;
  color: white;
  border-color: #4caf50;
}

.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px,1fr));
  gap: 20px;
}
</style>
