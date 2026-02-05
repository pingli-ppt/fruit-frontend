<template>
  <MainLayout>
    <HeroBanner />
    <TrustBadge />
    <CoreEntry />
    <ProductWaterfall />
    <AboutContent />
  </MainLayout>
</template>

<script setup>
import MainLayout from '../layouts/MainLayout.vue'
import HeroBanner from '../components/home/HeroBanner.vue'
import TrustBadge from '../components/home/TrustBadge.vue'
import CoreEntry from '../components/home/CoreEntry.vue'
import ProductWaterfall from '../components/home/ProductWaterfall.vue'
import AboutContent from '../components/about/AboutContent.vue'
</script>


<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>
