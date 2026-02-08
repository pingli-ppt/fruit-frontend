<template>
  <div ref="mapChart" style="width: 100%; height: 500px;"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

const mapChart = ref(null)

onMounted(async () => {
  const response = await fetch('https://geo.datav.aliyun.com/areas_v3/bound/310120.json')
  const geoJson = await response.json()
  const myChart = echarts.init(mapChart.value)
  echarts.registerMap('Fengxian', geoJson)
  const option = {
    title: { text: '奉贤区产地分布图', left: 'center' },
    tooltip: { trigger: 'item', formatter: '{b}' }, // 鼠标悬浮显示区域名
    series: [
      {
        name: '奉贤区',
        type: 'map',
        map: 'Fengxian', // 使用注册的地图名
        emphasis: {
          itemStyle: { areaColor: '#a5d6a7' }, // 鼠标经过时的颜色
          label: { show: true }
        },
        itemStyle: {
          areaColor: '#e6f7ff', // 默认区块颜色
          borderColor: '#0099cc' // 边界线颜色
        },
        data: [
          // 可以在这里标记具体的产地数据，比如“青村镇”
          { name: '青村镇', value: 100, itemStyle: { areaColor: '#4caf50' } }
        ]
      }
    ]
  }

  myChart.setOption(option)

  // 响应式处理：窗口缩放时地图自动调整
  window.addEventListener('resize', () => myChart.resize())
})
</script>