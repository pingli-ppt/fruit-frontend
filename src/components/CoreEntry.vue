<template>
  <section class="core-entry">
    <div class="card" v-for="item in entries" :key="item.title">
      {{ item.title }}
    </div>
  </section>
</template>

<script setup>
const entries = [
  { title: '当季推荐' },
  { title: '产地地图' },
  { title: '入驻合作社' },
  { title: '礼盒专区' }
]
</script>

<style scoped>
.core-entry {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}
.card {
  flex: 1 1 200px;
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}
.card:hover {
  transform: translateY(-5px);
  background-color: #e0f7fa;
}
</style>
