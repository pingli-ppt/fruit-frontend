<template>
  <section class="entry">
    <!-- 遍历entries数组，用每个项的title作为key -->
    <div class="card" v-for="e in entries" :key="e.title">
      <h3>
        <!-- 条件判断：有link属性则渲染router-link，否则直接显示标题 -->
        <router-link v-if="e.link" :to="e.link">{{ e.title }}</router-link>
        <span v-else>{{ e.title }}</span>
      </h3>
      <p>{{ e.desc }}</p>
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
.entry {
  padding: 30px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}
.card {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
}
h3 a {
  color: #4caf50;
  text-decoration: none;
}
h3 a:hover {
  text-decoration: underline;
}
/* 为无链接的标题添加统一样式，保持视觉一致 */
h3 span {
  color: #333;
}
</style>