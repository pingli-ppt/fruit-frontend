<template>
  <section class="entry">
    <div class="card" v-for="e in entries" :key="e.title">
      <h3>{{ e.title }}</h3>
      <p>{{ e.desc }}</p>
    </div>
  </section>
</template>

<script setup>
const entries = [
  { title: '当季推荐', desc: '精选应季水果' },
  { title: '产地地图', desc: '真实产地信息' },
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
</style>
