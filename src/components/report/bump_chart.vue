<template>
    <div ref="chartRef" class="bump-chart"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
    name: 'BumpChart',
    props: {
        courseData: {
            type: Array,
            required: true
        },
        themeColor: {
            type: String,
            default: '#5470C6'
        }
    },
    data() {
        return {
            chartInstance: null
        };
    },
    mounted() {
        this.initChart();
    },
    watch: {
        courseData: {
            handler() {
                this.updateChart();
            },
            deep: true
        },
        themeColor: {
            handler() {
                this.updateChart();
            },
            immediate: true
        }
    },
    methods: {
        generateAnalogousColors(baseColor, count = 10) {
            // 简化版颜色生成（保持相同饱和度/亮度）
            const hex = baseColor.replace('#', '');
            const bigint = parseInt(hex, 16);
            const r = (bigint >> 16) & 255;
            const g = (bigint >> 8) & 255;
            const b = bigint & 255;
            
            // RGB转HSL
            const hsl = this.rgbToHsl(r, g, b);
            const colors = [];
            const hueStep = 36; // 360°/10色
            
            for (let i = 0; i < count; i++) {
                const newHue = (hsl[0] + i * hueStep) % 360;
                colors.push(this.hslToHex(newHue, hsl[1], hsl[2]));
            }
            return colors;
        },
        rgbToHsl(r, g, b) {
            r /= 255, g /= 255, b /= 255;
            const max = Math.max(r, g, b), min = Math.min(r, g, b);
            let h, s, l = (max + min) / 2;

            if (max === min) {
                h = s = 0;
            } else {
                const d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
                h /= 6;
            }
            return [h * 360, s * 100, l * 100];
        },
        hslToHex(h, s, l) {
            h /= 360;
            s /= 100;
            l /= 100;
            let r, g, b;
            
            if (s === 0) {
                r = g = b = l;
            } else {
                const hue2rgb = (p, q, t) => {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1/6) return p + (q - p) * 6 * t;
                    if (t < 1/2) return q;
                    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                    return p;
                };
                const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                const p = 2 * l - q;
                r = hue2rgb(p, q, h + 1/3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1/3);
            }
            
            const toHex = x => {
                const hex = Math.round(x * 255).toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            };
            
            return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
        },
        generateLast7Days() {
            const days = [];
            const today = new Date();
            for (let i = 6; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(today.getDate() - i);
                days.push(`${date.getMonth() + 1}/${date.getDate()}`);
            }
            return days;
        },
        initChart() {
            if (!this.chartInstance) {
                this.chartInstance = echarts.init(this.$refs.chartRef);
            }
            this.updateChart();
        },
        updateChart() {
            if (!this.chartInstance || !this.courseData) return;
            
            const days = this.generateLast7Days();
            const colors = this.generateAnalogousColors(this.themeColor);

            const option = {
                title: {
                    text: '各课程近7天做题数量趋势',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: '{b}<br/>{a}: {c}题'
                },
                grid: {
                    left: 40,
                    right: 100,
                    bottom: 30,
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: days,
                    axisLabel: {
                        fontSize: 14,
                        margin: 20
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        fontSize: 14,
                        margin: 20
                    }
                },
                color: colors,
                series: this.courseData.map((course, index) => ({
                    name: course.name,
                    type: 'line',
                    smooth: true,
                    symbolSize: 10,
                    emphasis: {
                        focus: 'series'
                    },
                    endLabel: {
                        show: true,
                        formatter: '{a}',
                        distance: 20
                    },
                    lineStyle: {
                        width: 4
                    },
                    data: course.data
                }))
            };

            this.chartInstance.setOption(option, true);
        }
    },
    beforeUnmount() {
        if (this.chartInstance) {
            this.chartInstance.dispose();
        }
    }
};
</script>

<style scoped>
.bump-chart {
    width: 100%;
    height: 400px;
}
</style>