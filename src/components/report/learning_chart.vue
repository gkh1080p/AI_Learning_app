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
    },
    themeColor: {
      type: String,
      default: '#5470C6' // 给个默认主题色
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

      const colors = this.generateColorShades(this.themeColor, this.dayData.length);
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
            data: this.dayData.map((item, index) => ({
              ...item,
              itemStyle: {
                color: colors[index]
              }
            }))
          }
        ]
      };
      this.chartInstance.setOption(option);
    },
    resizeChart() {
      if (this.chartInstance) {
        this.chartInstance.resize();
      }
    },
    // 生成颜色渐变色
    generateColorShades(baseColor, count) {
      const shades = [];
      const { h, s, l } = this.hexToHSL(baseColor);

      for (let i = 0; i < count; i++) {
        // 在色相上小幅偏移，比如 ±30°
        const hueShift = (i - (count - 1) / 2) * (120 / count); // 总跨度60度，左右各30度
        let newHue = (h + hueShift + 360) % 360;

        shades.push(this.hslToHex(newHue, s, l));
      }
      return shades;
    },

    // 辅助函数：把 hex 转成 HSL
    hexToHSL(hex) {
      let r = parseInt(hex.slice(1, 3), 16) / 255;
      let g = parseInt(hex.slice(3, 5), 16) / 255;
      let b = parseInt(hex.slice(5, 7), 16) / 255;

      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h, s, l = (max + min) / 2;

      if (max === min) {
        h = s = 0; // achromatic
      } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h *= 60;
      }

      return { h, s, l };
    },

    // 辅助函数：把 HSL 转成 hex
    hslToHex(h, s, l) {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      const r = hue2rgb(p, q, (h / 360) + 1 / 3);
      const g = hue2rgb(p, q, (h / 360));
      const b = hue2rgb(p, q, (h / 360) - 1 / 3);

      const toHex = (x) => {
        const hex = Math.round(x * 255).toString(16);
        return hex.padStart(2, '0');
      };

      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    },

  }
};
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 400px;
}
</style>