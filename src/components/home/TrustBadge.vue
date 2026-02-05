<template>
  <section class="trust">
    <div class="item" v-for="t in trusts" :key="t.title">
      <strong>{{ t.icon }}</strong>
      <p>{{ t.title }}</p>
    </div>
  </section>
</template>

<script setup>
const trusts = [
  { icon: '🧪', title: '农残检测合格' },
  { icon: '📄', title: '权威认证' },
  { icon: '🔍', title: '批次可追溯' },
  { icon: '🚚', title: '冷链运输' }
]
</script>

<style scoped>
.trust {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 30px;
  background: #fff;
}
.item {
  text-align: center;
}
</style>
