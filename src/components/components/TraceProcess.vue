<template>
  <section class="card">
    <h2>溯源全过程</h2>

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
import TraceTimeline from './TraceTimeline.vue'

defineProps({
  production: Object,
  quality: Object,
  logistics: Array,
  timeline: Array
})
</script>
