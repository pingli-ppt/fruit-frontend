<template>
  <div class="timeline">
    <h3>全流程记录</h3>

    <div
      class="item"
      v-for="(item, index) in data.timeline"
      :key="index"
    >
      <div class="dot"></div>
      <div class="content">
        <strong>{{ item.title }}</strong>
        <span>{{ item.time }}</span>
        <p>{{ item.content }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  data: Object
})
</script>

<style scoped>
.timeline {
  margin-top: 30px;
  padding-left: 20px;
  border-left: 2px solid #4caf50;
}
.item {
  position: relative;
  margin-bottom: 20px;
}
.dot {
  width: 10px;
  height: 10px;
  background: #4caf50;
  border-radius: 50%;
  position: absolute;
  left: -6px;
  top: 6px;
}
.content span {
  font-size: 12px;
  color: #999;
  margin-left: 10px;
}
</style>
