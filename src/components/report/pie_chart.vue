<template>
  <div class="pie-chart" ref="chartContainer"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'PieChart',
  props: {
    pieData: {
      type: Array,
      required: true, // [{ name: '数学', value: 30 }, { name: '英语', value: 20 }]
    },
    title: {
      type: String,
      default: '学习内容占比'
    },
    themeColor: {
      type: String,
      default: '#5470C6'
    }
  },
  data() {
    return {
      chartInstance: null,
    };
  },
  mounted() {
    this.initChart();
    window.addEventListener('resize', this.resizeChart);
  },
  beforeDestroy() {
    if (this.chartInstance) {
      this.chartInstance.dispose();
    }
    window.removeEventListener('resize', this.resizeChart);
  },
  methods: {
    initChart() {
      this.chartInstance = echarts.init(this.$refs.chartContainer);
      this.setOptions();
    },
    setOptions() {
      const baseColor = this.themeColor;
      const colorList = this.generateColorShades(baseColor, this.pieData.length);

      const options = {
        title: {
          text: this.title,
          left: 'center',
          textStyle: {
            color: this.themeColor,
            fontSize: 18,
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          textStyle: {
            color: '#666',
          }
        },
        color: colorList, // ⭐ 加上这行，给系列配色
        series: [
          {
            name: '学习内容',
            type: 'pie',
            radius: '50%',
            center: ['50%', '60%'],
            data: this.pieData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            itemStyle: {
              borderRadius: 8,
              borderColor: '#fff',
              borderWidth: 2,
            }
          }
        ]
      };

      this.chartInstance.setOption(options);
    },

    resizeChart() {
      if (this.chartInstance) {
        this.chartInstance.resize();
      }
    },
    updateChart() {
      if (this.chartInstance) {
        this.setOptions();
      }
    },
    // 生成相似的颜色
    generateColorShades(baseColor, count) {
      const shades = [];
      const maxShift = 0.5; 
      for (let i = 0; i < count; i++) {
        let percent = (i - count / 2) / (count / 3) * maxShift;
        shades.push(this.adjustColorBrightness(baseColor, percent));
      }
      return shades;
    },
    adjustColorBrightness(color, percent) {
      let r = parseInt(color.slice(1, 3), 16);
      let g = parseInt(color.slice(3, 5), 16);
      let b = parseInt(color.slice(5, 7), 16);

      r = Math.min(255, Math.max(0, Math.floor(r * (1 + percent))));
      g = Math.min(255, Math.max(0, Math.floor(g * (1 + percent))));
      b = Math.min(255, Math.max(0, Math.floor(b * (1 + percent))));

      return `rgb(${r},${g},${b})`;
    },
  },
  watch: {
    pieData: 'updateChart',
    themeColor: 'updateChart'
  }
};
</script>

<style scoped>
.pie-chart {
  width: 100%;
  height: 400px;
}
</style>