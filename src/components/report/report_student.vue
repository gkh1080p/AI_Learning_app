<template>
    <div class="report-study">
        <div class="charts-row">
            <!-- 柱状图 -->
            <div class="chart-box">
                <BarChart :chartData="bar.chartData" :chartLabels="bar.chartLabels" :barColor="theme_color"
                    unit="min" />
            </div>

            <!-- 玫瑰图 -->
            <div class="chart-box">
                <div class="day-tabs">
                    <button v-for="day in learn.weekDays" :key="day" @click="toggleDay(day)"
                        :class="{ active: learn.selectedDays.includes(day) }">
                        {{ day }}
                    </button>
                    <div class="select-all">
                        <button @click="toggleSelectAll" :class="{ active: learn.isAllSelected }">
                            全选
                        </button>
                    </div>
                </div>
                <LearningChart :dayData="getMergedData()" :title="learn.selectedDays.join('、') + '学习时段分布'" />
            </div>
        </div>
    </div>
</template>



<script>
import BarChart from "./bar_chart.vue";
import LearningChart from "./learning_chart.vue";

export default {
    name: "report",
    components: {
        BarChart,
        LearningChart,
    },
    data() {
        return {
            theme_color: "#146058", // 主题配色
            userId: null,
            bar: {
                chartData: [120, 200, 150, 80, 70, 110, 130],
                chartLabels: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
            },
            learn: {
                selectedDays: ['周一'],
                isAllSelected: false,  // 是否全选
                weekDays: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
                weekData: {
                    周一: [
                        { name: "早晨", value: 1.8 },  // +0.3
                        { name: "上午", value: 3.5 },  // ↑ 成为最大值（原下午3.2→3.0）
                        { name: "下午", value: 3.0 },  // -0.2
                        { name: "晚上", value: 2.0 }   // +0.2
                    ],
                    周二: [
                        { name: "早晨", value: 1.5 },  // +0.3
                        { name: "上午", value: 2.2 },  // +0.7
                        { name: "下午", value: 2.8 },  // 保持
                        { name: "晚上", value: 3.0 }   // ↑ 成为最大值（原2.1→3.0）
                    ],
                    周三: [
                        { name: "早晨", value: 1.5 },  // +0.5
                        { name: "上午", value: 3.5 },  // ↑ 成为最大值（原下午3.0→2.5）
                        { name: "下午", value: 2.5 },  // -0.5
                        { name: "晚上", value: 2.0 }   // +0.5
                    ],
                    周四: [
                        { name: "早晨", value: 2.0 },  // +0.7（成为最大值）
                        { name: "上午", value: 1.8 },  // 保持
                        { name: "下午", value: 2.5 },  // 保持
                        { name: "晚上", value: 2.3 }   // +0.3
                    ],
                    周五: [
                        { name: "早晨", value: 1.5 },  // +0.4
                        { name: "上午", value: 3.0 },  // ↑ 成为最大值（原下午3.5→2.8）
                        { name: "下午", value: 2.8 },  // -0.7
                        { name: "晚上", value: 2.2 }   // +0.5
                    ],
                    周六: [
                        { name: "早晨", value: 2.5 },  // ↑ 成为最大值（原下午2.2→2.0）
                        { name: "上午", value: 2.0 },  // +0.4
                        { name: "下午", value: 2.0 },  // -0.2
                        { name: "晚上", value: 2.8 }   // +0.5
                    ],
                    周日: [
                        { name: "早晨", value: 1.8 },  // +0.5
                        { name: "上午", value: 2.5 },  // ↑ 成为最大值（原下午2.7→2.3）
                        { name: "下午", value: 2.3 },  // -0.4
                        { name: "晚上", value: 2.4 }   // +0.4
                    ]
                }
            },
        };
    },
    created() {
        this.userId = this.$route.params.userid;
    },
    methods: {
        // 切换选中状态
        toggleDay(day) {
            const index = this.learn.selectedDays.indexOf(day);
            if (index > -1) {
                // 取消选中
                this.learn.selectedDays.splice(index, 1);
            } else {
                // 选中
                this.learn.selectedDays.push(day);
            }
        },
        // 切换全选状态
        toggleSelectAll() {
            if (this.learn.isAllSelected) {
                // 清空选择
                this.learn.selectedDays = [];
            } else {
                // 全选
                this.learn.selectedDays = [...this.learn.weekDays];
            }
            this.learn.isAllSelected = !this.learn.isAllSelected;  // 切换状态
        },
        // 获取合并后的数据
        getMergedData() {
            const timeSlots = ['早晨', '上午', '下午', '晚上'];
            const merged = timeSlots.map(slot => ({
                name: slot,
                value: 0
            }));

            this.learn.selectedDays.forEach(day => {
                const dayData = this.learn.weekData[day] || [];
                dayData.forEach((slotData, index) => {
                    merged[index].value += slotData.value;
                });
            });

            return merged;
        }
    }
};
</script>

<style scoped>
.report-study {
    padding: 20px;
}

.charts-row {
    display: flex;
    flex-wrap: wrap;
    /* 允许自动换行 */
    gap: 20px;
    /* 两个图之间留一点缝隙 */
    justify-content: center;
    /* 居中对齐好看一点 */
}

.chart-box {
    flex: 1 1 500px;
    /* 每个图最小500px，可以伸缩 */
    max-width: 500px;
    min-width: 300px;
    height: 320px;
    background: #ffffff;
    border: 1px solid #eee;
    border-radius: 8px;
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.day-tabs {
    margin-bottom: 10px;
}

.day-tabs button {
    margin: 0 5px 5px 0;
    padding: 5px 12px;
    background: #f2f2f2;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s;
}

.day-tabs button.active {
    background: v-bind(theme_color);
    color: #fff;
}

.select-all button {
    background-color: #f2f2f2;
    color: black;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.select-all button.active {
    background: v-bind(theme_color);
    color: #fff;
}
</style>