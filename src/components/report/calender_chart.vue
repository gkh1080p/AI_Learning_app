<template>
    <div class="calendar-chart" ref="chartContainer"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
    name: 'CalendarChart',
    props: {
        calendarData: {
            type: Array,
            required: true,
        },
        year: {
            type: Number,
            default: new Date().getFullYear(),
        },
        themeColor: {
            type: String,
            default: '#5470C6',
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
            this.setChartOptions();
        },
        resizeChart() {
            if (this.chartInstance) {
                this.chartInstance.resize();
            }
        },
        setChartOptions() {
            const options = {
                tooltip: {
                    position: 'top',
                    formatter: (params) => {
                        return `${params.data[0]}<br/>打卡：${params.data[1] ? '✔️' : '❌'}`;
                    }
                },
                visualMap: {
                    min: 0,
                    max: 1,
                    orient: 'horizontal',
                    left: 'center',
                    top: 20,
                    show: false,
                    inRange: {
                        color: ['#ebedf0', this.themeColor] // 使用主题色
                    }
                },
                calendar: {
                    top: 50,
                    left: 20,
                    right: 20,
                    cellSize: ['auto', 20],
                    range: this.year,
                    itemStyle: {
                        borderWidth: 0.5,
                        borderColor: '#ccc'
                    },
                    yearLabel: { show: false }
                },
                series: {
                    type: 'heatmap',
                    coordinateSystem: 'calendar',
                    data: this.calendarData
                },
                title: {
                    text: `${this.year} 学习日历`,
                    left: 'center',
                    textStyle: {
                        color: this.themeColor,
                        fontSize: 18,
                    }
                },
            };

            this.chartInstance.setOption(options);
        },
        updateChart() {
            if (this.chartInstance) {
                this.setChartOptions(); // 重新设置配置，保证数据和主题色一起更新
            }
        }
    },
    watch: {
        calendarData: 'updateChart',
        themeColor: 'updateChart', // 监听主题色变化
    }
};
</script>

<style scoped>
.calendar-chart {
    width: 100%;
    height: 100%;
}
</style>
