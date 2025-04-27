<template>
  <div ref="chartContainer" class="chart-container"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'SunburstChart',
  props: {
    chartData: {
      type: Array,
      required: true
    },
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
    chartData: {
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
          text: '各\n科\n练\n习\n情\n况',
          left: 50,
          top: 'center',
          textStyle: {
            fontSize: 20,
            fontWeight: 'bold',
            lineHeight: 30
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c}题'
        },
        series: [
          {
            type: 'sunburst',
            radius: ['15%', '95%'],
            sort: null, // ⭐ 关键，禁用默认从大到小排序
            data: this.chartData, // 确保每个节点有 value
            label: {
              rotate: 'radial'
            },
            levels: [
              {},
              {
                r0: '15%',
                r: '35%',
                itemStyle: {
                  borderWidth: 2,
                  gapWidth: 2 // ⭐ 让节点之间有空隙
                },
                label: {
                  rotate: 0,
                  fontSize: 14
                }
              },
              {
                r0: '35%',
                r: '70%',
                itemStyle: {
                  borderWidth: 2,
                  gapWidth: 2
                },
                label: {
                  rotate: 'tangential',
                  fontSize: 12
                }
              },
              {
                r0: '70%',
                r: '95%',
                itemStyle: {
                  borderWidth: 2,
                  gapWidth: 2
                },
                label: {
                  position: 'outside',
                  fontSize: 10
                }
              }
            ]
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
  height: 120%;
}
</style>
