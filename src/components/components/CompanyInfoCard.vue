<template>
  <section class="card company">
    <h2>企业信息</h2>
    <p>企业名称：{{ company.name }}</p>
    <p>企业简介：{{ company.desc }}</p>

    <!-- 如果有 reports 就显示 -->
    <div v-if="company.reports && company.reports.length">
      <h3>相关报告</h3>
      <ul>
        <li v-for="(r, index) in company.reports" :key="index">{{ r }}</li>
      </ul>
    </div>
  </section>
</template>

<script setup>
defineProps({
  company: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.card.company {
  border: 1px solid #ccc;
  padding: 12px;
  margin-bottom: 10px;
}
</style>
