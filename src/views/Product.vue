<template>
  <MainLayout>
    <div class="product-page">
      <h1>产品与服务</h1>

      <!-- 筛选 -->
      <div class="filter-bar">
        <select v-model="category">
          <option value="">全部品类</option>
          <option value="apple">苹果</option>
          <option value="orange">橙子</option>
        </select>

        <select v-model="origin">
          <option value="">全部产地</option>
          <option value="上海">上海</option>
          <option value="山东">山东</option>
        </select>

        <select v-model="sort">
          <option value="">默认排序</option>
          <option value="price">价格排序</option>
          <option value="time">上架时间</option>
        </select>
      </div>

      <!-- 产品列表 -->
      <div class="list">
        <div
          class="card"
          v-for="item in filteredList"
          :key="item.id"
        >
          <h3>{{ item.name }}</h3>
          <p>产地：{{ item.origin }}</p>
          <p>价格：￥{{ item.price }}</p>

          <button @click="goTrace(item.batchCode)">
            查看溯源
          </button>
        </div>
      </div>
    </div>
  </MainLayout>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'

const router = useRouter()

const category = ref('')
const origin = ref('')
const sort = ref('')

const products = ref([
  {
    id: 1,
    name: '红富士苹果',
    category: 'apple',
    origin: '山东',
    price: 8,
    batchCode: 'AP20250901',
    time: 3
  },
  {
    id: 2,
    name: '赣南脐橙',
    category: 'orange',
    origin: '上海',
    price: 6,
    batchCode: 'OR20250902',
    time: 1
  }
])

const filteredList = computed(() => {
  let list = products.value

  if (category.value) {
    list = list.filter(i => i.category === category.value)
  }

  if (origin.value) {
    list = list.filter(i => i.origin === origin.value)
  }

  if (sort.value === 'price') {
    list = [...list].sort((a, b) => a.price - b.price)
  }

  if (sort.value === 'time') {
    list = [...list].sort((a, b) => a.time - b.time)
  }

  return list
})

const goTrace = (code) => {
  router.push({
    path: '/trace',
    query: { code }
  })
}
</script>
<style scoped>
.product-page {
  max-width: 1000px;
  margin: 30px auto;
}

.filter-bar {
  display: flex;
  gap: 15px;
  margin: 20px 0;
}

.list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.card {
  border: 1px solid #eee;
  padding: 16px;
  border-radius: 8px;
}

button {
  margin-top: 10px;
  background: #4caf50;
  color: white;
  border: none;
  padding: 6px 10px;
}
</style>
