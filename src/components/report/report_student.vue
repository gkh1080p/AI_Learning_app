<template>
    <div class="report-study">
        <BarChart 
        :chartData="chartData" 
        :chartLabels="chartLabels"
        style="width: 600px; height: 300px;"
        :barColor="theme_color"
        unit="min"
        />
        <p>User ID: {{ userId }}</p>
    </div>
</template>

<script>
import { defineComponent } from "vue";
import BarChart from "./bar_chart.vue";
export default {
    name: "report",
    data() {
        return {
            theme_color: '#146058', // 主题配色
            userId: null, 
            chartData: [120, 200, 150, 80, 70, 110, 130], 
            chartLabels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'], 
        };
    },
    
    created() {
        // Retrieve the userId from the route parameters
        this.userId = this.$route.params.userid;
    },
    components: {
        BarChart, 
    },
};
</script>

<style scoped>
.report-study {
    padding: 20px;
}
</style>