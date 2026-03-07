<template>
  <!-- 外层：全屏绿色背景 -->
  <section class="entry-wrapper">
    <!-- 内层：居中卡片布局（1200px） -->
    <div class="entry">
      <div class="card" v-for="e in entries" :key="e.title">
        <h3>
          <router-link v-if="e.link" :to="e.link">{{ e.title }}</router-link>
          <span v-else>{{ e.title }}</span>
        </h3>
        <p>{{ e.desc }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
const entries = [
  { title: '当季推荐', desc: '精选应季水果', link: '/product-waterfall' },
  { title: '产地地图', desc: '真实产地信息', link: '/origin/奉贤区' },
  { title: '企业团购', desc: '功能预留' },
  { title: '合作社入驻', desc: '填写合作表单' },
  { title: '礼盒专区', desc: '送礼优选' }
]
</script>

<style scoped>
/* 外层：全屏背景 + 左右铺满 */
.entry-wrapper {
  width: 100%;
  background: linear-gradient(to bottom, #f8fff9, #f2fff7);
  padding: 50px 20px;
  box-sizing: border-box;
}

/* 内层：居中 + 卡片网格 */
.entry {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

/* 卡片：统一绿色科技风格 */
.card {
  background: #ffffff;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid rgba(39, 174, 96, 0.1);
  box-shadow: 0 4px 18px rgba(39, 174, 96, 0.07);
  transition: all 0.3s ease;
  cursor: pointer;
}
.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(39, 174, 96, 0.12);
  border-color: rgba(39, 174, 96, 0.2);
}

/* 标题：统一绿色 */
.card h3 {
  margin: 0 0 10px;
  font-size: 17px;
  font-weight: 600;
}

/* 可点击链接：渐变绿色 */
.card h3 a {
  background: linear-gradient(90deg, #27ae60, #34d39e);
  -webkit-background-clip: text;
  color: transparent;
  text-decoration: none;
  transition: all 0.2s ease;
}
.card h3 a:hover {
  opacity: 0.8;
}

/* 不可点击标题：深色 */
.card h3 span {
  color: #333;
}

/* 描述文字 */
.card p {
  margin: 0;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}
</style>