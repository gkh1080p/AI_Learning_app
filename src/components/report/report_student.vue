<template>
    <div class="report-study">
        <h1>Report Study</h1>
        <p>User ID: {{ userId }}</p>
    </div>
</template>

<script >
import { defineComponent } from "vue";

export default defineComponent({
    name: "report",
    data() {
        return {
            userId: null, // Define the type explicitly
        };
    },
    created() {
        // Retrieve the userId from the route parameters
        this.userId = this.$route.params.userId;
    },
});
</script>

<style scoped>
.report-study {
    padding: 20px;
}
</style>