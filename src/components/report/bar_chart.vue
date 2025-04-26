<template>
    <div class="bar-chart" ref="chartContainer"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
    name: 'BarChart',
    props: {
        // 接收数据和配置的props
        chartData: {
            type: Array,
            required: true,
        },
        chartLabels: {
            type: Array,
            required: true,
        },
        barColor: {
            type: [String, Array],
            default: () => '#5470C6', // 默认颜色
        },
        unit: {
            type: String,
            default: '', // 默认没单位
        },
    },
    data() {
        return {
            chartInstance: null, // 保存echarts实例
        };
    },
    mounted() {
        this.initChart(); // 初始化图表
        window.addEventListener('resize', this.resizeChart); // 监听窗口大小变化
    },
    beforeDestroy() {
        if (this.chartInstance) {
            this.chartInstance.dispose(); // 销毁图表实例
        }
        window.removeEventListener('resize', this.resizeChart); // 移除监听
    },
    methods: {
        initChart() {
            // 初始化echarts实例
            this.chartInstance = echarts.init(this.$refs.chartContainer);

            // 配置图表选项
            this.setChartOptions();
        },
        resizeChart() {
            // 调整图表大小
            if (this.chartInstance) {
                this.chartInstance.resize();
            }
        },
        setChartOptions() {
            // 配置图表选项
            const options = {
                title: {
                    text: '一周学习情况图',
                    left: 'center',
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow',
                    },
                },
                xAxis: {
                    type: 'category',
                    data: this.chartLabels, // 使用传入的标签数据
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: `{value} ${this.unit}`, // 使用传入的单位
                    },
                },
                grid: {
                    left: '15%', // 设置左边留白空间，避免 X 轴标签被遮挡
                    right: '10%',
                    bottom: '15%',
                    top: '15%',
                },
                series: [
                    {
                        name: '时长',
                        type: 'bar',
                        data: this.chartData, // 使用传入的数据
                        itemStyle: {
                            color: this.barColor, // 条形图颜色
                        },
                    },
                ],
            };

            // 设置图表选项
            this.chartInstance.setOption(options);
        },
        updateChart() {
            // 更新图表的配置
            this.setChartOptions();
        }
    },
    watch: {
        // 监听数据变化，更新图表
        chartData: 'updateChart',
        chartLabels: 'updateChart',
        barColor: function(newColor) {
            // 当主题色变化时，更新图表颜色
            if (this.chartInstance) {
                this.chartInstance.setOption({
                    series: [{
                        itemStyle: { color: newColor } // 更新颜色
                    }]
                });
            }
        }
    },
};
</script>

<style scoped>
.bar-chart {
    width: 90%;
    height: 400px;
}
</style>
