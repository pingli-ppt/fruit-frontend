<template>
  <section class="card">
    <h2>溯源全过程</h2>

    <!-- 改这里：把字段名对应上 -->
    <ProductionInfo :data="production" />
    <QualityTest :data="quality" />
    <LogisticsInfo :data="logistics" />
    <TraceTimeline :data="timeline" />
  </section>
</template>

<script setup>
import ProductionInfo from './ProductionInfo.vue'
import QualityTest from './QualityTest.vue'
import LogisticsInfo from './LogisticsInfo.vue'

defineProps({
  production: Object,
  quality: Object,
  logistics: Array,
  timeline: Array
})
</script>

<style scoped>
.card {
  padding: 20px;
}
h2 {
  font-size: 20px;
  margin-bottom: 16px;
  color: #27ae60;
}
</style>