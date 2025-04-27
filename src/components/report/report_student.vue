<template>
    <div class="report-study">
        <!-- 悬浮调色面板 -->
        <!-- <el-button @click="showColorPanel = !showColorPanel" class="color-ball" size="small" type="primary"><i
                class="el-icon-color"></i>
        </el-button> -->
        <el-color-picker v-if="showColorPanel" v-model="theme_color" @change="changeColor" size="small"
            class="color-picker-panel">
        </el-color-picker>

        <!-- 日历图 -->
        <div class="calendar-row">
            <div class="chart-box">
                <CalendarChart :calendarData="calendar.data" :year="calendar.year" :themeColor="theme_color" />
            </div>
        </div>
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
                <LearningChart :themeColor="theme_color" :dayData="getMergedData()"
                    :title="learn.selectedDays.join('、') + '学习时段分布'" />
            </div>

            <!-- 饼图 -->
            <div class="chart-box">
                <PieChart :pieData="pie.data" :title="'学习模块占比'" :themeColor="theme_color" />
            </div>

        </div>


        <div class="sunburst-row">
            <!-- 旭日图 -->
            <div class="chart-box sunburst-container">
                <Sunburst :chartData="sunburstData" :themeColor="theme_color" />
            </div>
            <!-- 凹凸图 -->
            <div class="chart-box sunburst-container">
                <BumpChart :courseData="bumpData" :themeColor="theme_color" />
            </div>
        </div>
    </div>
</template>



<script>
import BarChart from "./bar_chart.vue";
import LearningChart from "./learning_chart.vue";
import CalendarChart from "./calender_chart.vue";
import PieChart from "./pie_chart.vue";
import Sunburst from "./sunburst_chart.vue";
import BumpChart from "./bump_chart.vue";
export default {
    name: "report",
    components: {
        BarChart,// 引入柱状图组件
        LearningChart,// 引入学习时段分布图组件
        CalendarChart,// 引入日历图组件
        PieChart,// 引入饼图组件
        Sunburst,// 引入旭日图组件
        BumpChart,// 引入凹凸图组件
    },
    data() {
        return {
            theme_color: "#adeebd", // 主题配色
            showColorPanel: true, // 添加此行来初始化 showColorPanel
            userId: null,
            // 树状图数据
            bar: {
                chartData: [120, 200, 150, 80, 70, 110, 130],
                chartLabels: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
            },
            // 玫瑰图数据
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
            // 日历图数据
            calendar: {
                year: 2025,
                data: [
                    ['2025-01-01', 1],
                    ['2025-01-02', 0],
                    ['2025-01-03', 1],
                    ['2025-01-04', 0],
                    ['2025-01-05', 1],
                    ['2025-01-06', 0],
                    ['2025-01-07', 1],
                    ['2025-01-08', 0],
                    ['2025-01-09', 1],
                    ['2025-01-10', 0],
                    ['2025-01-11', 1],
                    ['2025-01-12', 0],
                    ['2025-01-13', 1],
                    ['2025-01-14', 0],
                    ['2025-01-15', 1],
                    ['2025-01-16', 0],
                    ['2025-01-17', 1],
                    ['2025-01-18', 0],
                    ['2025-01-19', 1],
                    ['2025-01-20', 0],
                    ['2025-01-21', 1],
                    ['2025-01-22', 0],
                    ['2025-01-23', 1],
                    ['2025-01-24', 0],
                    ['2025-01-25', 1],
                    ['2025-01-26', 0],
                    ['2025-01-27', 1],
                    ['2025-01-28', 0],
                    ['2025-01-29', 1],
                    ['2025-01-30', 0],
                    ['2025-01-31', 1],
                    ['2025-02-01', 0],
                    ['2025-02-02', 1],
                    ['2025-02-03', 0],
                    ['2025-02-04', 1],
                    ['2025-02-05', 0],
                    ['2025-02-06', 1],
                    ['2025-02-07', 0],
                    ['2025-02-08', 1],
                    ['2025-02-09', 0],
                    ['2025-02-10', 1],
                    ['2025-02-11', 0],
                    ['2025-02-12', 1],
                    ['2025-02-13', 0],
                    ['2025-02-14', 1],
                    ['2025-02-15', 0],
                    ['2025-02-16', 1],
                    ['2025-02-17', 0],
                    ['2025-02-18', 1],
                    ['2025-02-19', 0],
                    ['2025-02-20', 1],
                    ['2025-02-21', 0],
                    ['2025-02-22', 1],
                    ['2025-02-23', 0],
                    ['2025-02-24', 1],
                    ['2025-02-25', 0],
                    ['2025-02-26', 1],
                    ['2025-02-27', 0],
                    ['2025-02-28', 1],
                    ['2025-03-01', 0],
                    ['2025-03-02', 1],
                    ['2025-03-03', 0],
                    ['2025-03-04', 1],
                    ['2025-03-05', 0],
                    ['2025-03-06', 1],
                    ['2025-03-07', 0],
                ]
            },

            // 饼图数据
            pie: {
                data: [
                    { name: '数学', value: 40 },
                    { name: '英语', value: 30 },
                    { name: '编程', value: 20 },
                    { name: '物理', value: 10 }
                ]
            },
            // 旭日图数据
            sunburstData: [
                {
                    name: '科技类',
                    value: 30,
                    children: [
                        { name: '机器人入门', value: 12 },
                        { name: '人工智能基础', value: 15 }
                    ]
                },
                {
                    name: '艺术类',
                    value: 30,
                    children: [
                        { name: '油画基础', value: 5 },
                        { name: '钢琴启蒙', value: 9 }
                    ]
                },
                {
                    name: '创新类',
                    value: 30,
                    children: [
                        { name: '创业思维', value: 6 }
                    ]
                },
                {
                    name: '人文类',
                    value: 20,
                    children: [
                        { name: '历史启蒙', value: 8 },
                        { name: '文学欣赏', value: 10 }
                    ]
                },
                {
                    name: '体育类',
                    value: 30,
                    children: [
                        { name: '游泳基础', value: 5 },
                        { name: '篮球技巧', value: 7 }
                    ]
                }

            ],
            // 凹凸图数据
            bumpData: [
                {
                    name: '历史启蒙',
                    data: [10, 12, 9, 14, 11, 13, 15]
                },
                {
                    name: '文学欣赏',
                    data: [8, 9, 7, 10, 9, 8, 11]
                },
                {
                    name: '游泳基础',
                    data: [5, 6, 7, 5, 6, 8, 7]
                },
                {
                    name: '篮球技巧',
                    data: [4, 5, 4, 6, 5, 5, 6]
                },
                {
                    name: '机器人入门',
                    data: [12, 13, 11, 14, 12, 15, 16]
                },
                {
                    name: '人工智能基础',
                    data: [15, 16, 14, 17, 15, 18, 19]
                },
                {
                    name: '油画基础',
                    data: [5, 6, 4, 7, 5, 6, 8]
                },
                {
                    name: '钢琴启蒙',
                    data: [9, 10, 8, 11, 9, 10, 12]
                },
                {
                    name: '创业思维',
                    data: [6, 7, 5, 8, 6, 7, 9]
                }
            ]



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
        },
        // 修改主题色
        changeColor(newColor) {
            this.theme_color = newColor;
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
    max-width: 460px;
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

.calendar-row {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}

.calendar-row .chart-box {
    flex: 1 1 100%;
    max-width: 1500px;
    min-width: 300px;
    height: 260px;
    /* 日历图稍微高一点也可以 */
}


/* 悬浮调色面板 */
.color-picker-panel {
    position: absolute;
    top: 60px;
    right: 20px;
    z-index: 999;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.color-ball {
    position: fixed;
    top: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: v-bind(theme_color);
    /* 初始颜色 */
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    z-index: 9999;
    cursor: pointer;
    border: none;
}

.color-ball i {
    color: #fff;
    font-size: 24px;
}

.sunburst-row {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    gap: 20px;
}


.sunburst-row .sunburst-container {
    /* 防止过小 */
    max-width: 700px;
    /* 防止过大 */
    height: 500px;

}
</style>