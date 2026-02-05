<template>
  <MainLayout>
    <AboutContent />
  </MainLayout>
</template>

<script setup>
import MainLayout from '../layouts/MainLayout.vue'
import AboutContent from '../components/about/AboutContent.vue'
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
