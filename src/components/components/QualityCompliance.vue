<template>
  <section class="card">
    <h2>质量与合规</h2>

    <h3>检测报告</h3>
    <ul>
      <li v-for="r in quality.reports" :key="r">{{ r }}</li>
    </ul>

    <h3>合规证明</h3>
    <p>{{ compliance.certificates.join('、') }}</p>

    <h3>风险说明</h3>
    <p>{{ compliance.risk }}</p>
  </section>
</template>

<script setup>
defineProps({
  quality: Object,
  compliance: Object
})
</script>
