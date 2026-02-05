<template>
  <MainLayout>
    <div class="about-page">
      <h1>关于果数说</h1>

      <p class="intro">
        果数说致力于通过数据、检测与溯源体系，建立农产品质量信任机制。
      </p>

      <section>
        <h2>我们在做什么</h2>
        <ul>
          <li>农产品质检与溯源信息集成</li>
          <li>合作社与产地信息透明化</li>
          <li>为消费者提供可信决策依据</li>
        </ul>
      </section>

      <section>
        <h2>我们的理念</h2>
        <p>
          用数据说话，让好农产品被看见。
        </p>
      </section>
    </div>
  </MainLayout>
</template>

<script setup>
import MainLayout from '../layouts/MainLayout.vue'
</script>

<style scoped>
.about-page {
  max-width: 900px;
  margin: 40px auto;
}
.intro {
  color: #555;
  margin-bottom: 20px;
}
</style>
