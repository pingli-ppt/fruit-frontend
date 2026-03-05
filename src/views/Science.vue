<template>
  <MainLayout>
    <div class="science-page">
      <div class="page-header">
        <h1>食品安全与质量科普</h1>
        <p class="intro">
          通过真实案例与检测知识，帮助公众了解农产品质量安全。
        </p>
      </div>

      <div class="case-list">
        <div
          class="case-card"
          v-for="item in cases"
          :key="item.id"
        >
          <!-- 封面图 -->
          <div class="card-cover">
            <img :src="item.cover" alt="封面" />
          </div>

          <div class="card-body">
            <span class="tag">{{ item.category }}</span>
            <h3 class="title">{{ item.title }}</h3>
            <p class="desc">{{ item.summary }}</p>

            <button @click="viewDetail(item)" class="detail-btn">
              查看详情
            </button>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MainLayout from '../layouts/MainLayout.vue'

const cases = ref([])

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:3000/api/science/list')
    const data = await res.json()
    cases.value = data.data || []
  } catch (err) {
    alert('获取数据失败')
  }
})

// 跳转到微信公众号
const viewDetail = (item) => {
  if (!item.url) {
    alert('该文章暂无公众号链接')
    return
  }
  window.open(item.url, '_blank')
}
</script>

<style scoped>
/* 页面整体 */
.science-page {
  max-width: 1100px;
  margin: 40px auto;
  padding: 0 20px;
}

/* 头部 */
.page-header {
  text-align: center;
  margin-bottom: 50px;
}

.page-header h1 {
  font-size: 32px;
  color: #222;
  margin-bottom: 12px;
  font-weight: 700;
}

.intro {
  font-size: 16px;
  color: #666;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
}

/* 卡片网格 */
.case-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 28px;
}

/* 卡片 */
.case-card {
  border-radius: 16px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  cursor: default;
}

.case-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
}

/* 封面图 */
.card-cover img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  display: block;
}

/* 卡片内容 */
.card-body {
  padding: 20px 24px;
}

.tag {
  display: inline-block;
  padding: 4px 10px;
  background: #e6f7ee;
  color: #2a9e5f;
  border-radius: 12px;
  font-size: 12px;
  margin-bottom: 10px;
}

.title {
  font-size: 18px;
  color: #222;
  margin: 0 0 10px;
  line-height: 1.4;
  font-weight: 600;
}

.desc {
  font-size: 14px;
  color: #555;
  line-height: 1.5;
  margin-bottom: 18px;
}

/* 按钮 */
.detail-btn {
  width: 100%;
  background: linear-gradient(90deg, #4caf50, #43a047);
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 14px;
  cursor: pointer;
  transition: 0.2s;
}

.detail-btn:hover {
  background: linear-gradient(90deg, #43a047, #388e3c);
}
</style>