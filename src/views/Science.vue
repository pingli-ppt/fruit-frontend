<template>
  <MainLayout>
    <div class="science-page">
      <h1>食品安全与质量科普</h1>
      <p class="intro">
        通过真实案例与检测知识，帮助公众了解农产品质量安全。
      </p>

      <div class="case-list">
        <div
          class="case-card"
          v-for="item in cases"
          :key="item.id"
        >
          <h3>{{ item.title }}</h3>
          <p class="tag">{{ item.tag }}</p>
          <p class="desc">{{ item.summary }}</p>

          <button @click="viewDetail(item.id)">
            查看详情
          </button>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import MainLayout from '../layouts/MainLayout.vue'

const cases = [
  {
    id: 1,
    title: '某批次草莓农残超标案例分析',
    tag: '农药残留',
    summary: '通过检测发现某合作社草莓存在农残超标问题，分析原因与整改措施。'
  },
  {
    id: 2,
    title: '水果表面蜡是否有害？',
    tag: '消费科普',
    summary: '解析食用蜡与工业蜡的区别，帮助消费者科学判断。'
  },
  {
    id: 3,
    title: '质检报告怎么看？',
    tag: '检测知识',
    summary: '教你快速读懂农产品检测报告中的关键指标。'
  }
]

const viewDetail = (id) => {
  alert('后续扩展为详情页，案例ID：' + id)
}
</script>

<style scoped>
.science-page {
  max-width: 1000px;
  margin: 30px auto;
}

.intro {
  color: #666;
  margin-bottom: 20px;
}

.case-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.case-card {
  border: 1px solid #eee;
  padding: 18px;
  border-radius: 8px;
}

.tag {
  font-size: 12px;
  color: #4caf50;
  margin: 6px 0;
}

.desc {
  font-size: 14px;
  color: #555;
}

button {
  margin-top: 12px;
  background: #4caf50;
  color: white;
  border: none;
  padding: 6px 12px;
  cursor: pointer;
}
</style>
