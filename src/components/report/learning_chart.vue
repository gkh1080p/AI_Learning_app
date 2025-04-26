<template>
    <div ref="chartContainer" class="chart-container"></div>
  </template>
  
  <script>
  import * as echarts from 'echarts';
  
  export default {
    name: 'LearningChart',
    props: {
      dayData: {
        type: Array,
        required: true
      },
      title: {
        type: String,
        default: '学习时间分布'
      }
    },
    mounted() {
      this.initChart();
      window.addEventListener('resize', this.resizeChart);
    },
    beforeUnmount() {
      window.removeEventListener('resize', this.resizeChart);
      if (this.chartInstance) {
        this.chartInstance.dispose();
      }
    },
    watch: {
      dayData: {
        handler() {
          this.updateChart();
        },
        deep: true
      }
    },
    methods: {
      initChart() {
        this.chartInstance = echarts.init(this.$refs.chartContainer);
        this.updateChart();
      },
      updateChart() {
        if (!this.chartInstance) return;
        const option = {
          title: {
            text: this.title,
            left: 'center'
          },
          tooltip: {
            trigger: 'item'
          },
          legend: {
            top: 'bottom'
          },
          series: [
            {
              name: '学习时长',
              type: 'pie',
              radius: ['20%', '60%'],
              roseType: 'radius',
              itemStyle: {
                borderRadius: 8
              },
              data: this.dayData
            }
          ]
        };
        this.chartInstance.setOption(option);
      },
      resizeChart() {
        if (this.chartInstance) {
          this.chartInstance.resize();
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .chart-container {
    width: 100%;
    height: 400px;
  }
  </style>
  