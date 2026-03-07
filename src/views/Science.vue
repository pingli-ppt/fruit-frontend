<template>
  <MainLayout>
    <div class="science-page">

      <!-- 科普标题：绿色科技感 -->
      <div class="page-header">
        <h1 class="page-title">食品安全与质量科普</h1>
        <p class="intro">
          通过真实案例与检测知识，帮助公众了解农产品质量安全。
        </p>
      </div>

      <!-- 加载提示 + 错误提示 -->
      <div v-if="loading" class="loading-box">
        <div class="loading-spinner"></div>
        <span>正在加载科普内容...</span>
      </div>
      <div v-if="errorMsg" class="error-box">
        {{ errorMsg }}
      </div>

      <!-- 科普卡片列表 -->
      <div v-else class="case-list">
        <div
          class="case-card"
          v-for="item in cases"
          :key="item.id"
        >
          <!-- 封面图 -->
          <div class="card-cover">
            <img :src="item.cover" alt="科普封面" />
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

      <!-- 空数据提示 -->
      <div v-if="cases.length === 0 && !loading && !errorMsg" class="empty-box">
        暂无科普内容
      </div>

    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MainLayout from '../layouts/MainLayout.vue'

const cases = ref([])
const loading = ref(false)
const errorMsg = ref('')

onMounted(async () => {
  loading.value = true
  errorMsg.value = ''
  try {
    const res = await fetch('http://localhost:3000/api/science/list')
    const data = await res.json()
    if (data.code === 200) {
      cases.value = data.data || []
    } else {
      errorMsg.value = data.message || '加载失败'
    }
  } catch (err) {
    errorMsg.value = '网络异常，请检查后端服务是否启动'
    console.error(err)
  } finally {
    loading.value = false
  }
})

// 跳转到公众号详情
const viewDetail = (item) => {
  if (!item.url) {
    alert('该文章暂无公众号链接')
    return
  }
  window.open(item.url, '_blank')
}
</script>

<style scoped>
/* 页面整体：绿色渐变背景 */
.science-page {
  max-width: 1100px;
  margin: 40px auto;
  padding: 0 20px;
  min-height: 100vh;
  background: linear-gradient(to bottom, #f8fff9, #f2fff7);
}

/* 标题：科技渐变绿（和 trace 页完全统一） */
.page-title {
  text-align: center;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 12px;
  background: linear-gradient(90deg, #27ae60, #00b42a, #34d39e);
  -webkit-background-clip: text;
  color: transparent;
  letter-spacing: 1px;
  position: relative;
}
.page-title::after {
  content: '';
  display: block;
  width: 80px;
  height: 4px;
  margin: 12px auto 0;
  background: linear-gradient(90deg, #27ae60, #34d39e);
  border-radius: 2px;
}

/* 头部描述 */
.page-header {
  text-align: center;
  margin-bottom: 50px;
}
.intro {
  font-size: 16px;
  color: #666;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
}

/* 卡片网格布局 */
.case-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

/* 科普卡片：统一绿色风格 */
.case-card {
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 18px rgba(39, 174, 96, 0.07);
  border: 1px solid rgba(39, 174, 96, 0.1);
  transition: all 0.3s ease;
}
.case-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(39, 174, 96, 0.12);
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
  padding: 24px;
}

/* 标签样式 */
.tag {
  display: inline-block;
  padding: 5px 11px;
  background: rgba(39, 174, 96, 0.08);
  color: #27ae60;
  border-radius: 12px;
  font-size: 12px;
  margin-bottom: 10px;
}

/* 标题 */
.title {
  font-size: 18px;
  color: #222;
  margin: 0 0 10px;
  line-height: 1.4;
  font-weight: 600;
}

/* 描述 */
.desc {
  font-size: 14px;
  color: #555;
  line-height: 1.5;
  margin-bottom: 18px;
}

/* 详情按钮：绿色渐变 */
.detail-btn {
  width: 100%;
  background: linear-gradient(90deg, #27ae60, #34d39e);
  color: white;
  border: none;
  padding: 11px 16px;
  border-radius: 10px;
  font-size: 14px;
  cursor: pointer;
  transition: 0.2s ease;
}
.detail-btn:hover {
  background: linear-gradient(90deg, #219653, #27ae60);
}

/* 加载动画（和 trace 页一致） */
.loading-box {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 30px 0;
  color: #27ae60;
  font-size: 15px;
}
.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(39, 174, 96, 0.2);
  border-top: 2px solid #27ae60;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 错误提示 */
.error-box {
  background: #fff1f0;
  color: #e53e3e;
  padding: 14px 20px;
  border-radius: 12px;
  text-align: center;
  margin: 20px auto;
  border: 1px solid #fecdd3;
  max-width: 600px;
}

/* 空数据 */
.empty-box {
  text-align: center;
  padding: 60px 20px;
  color: #999;
  font-size: 15px;
}
</style>