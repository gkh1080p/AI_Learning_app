<template>
    <div class="course-handouts">
        <h2>Course Handouts</h2>
        <ul v-if="handouts.length">
            <li v-for="handout in handouts" :key="handout.id">
                <a :href="handout.url" target="_blank">{{ handout.name }}</a>
            </li>
        </ul>
        <p v-else>No handouts available for this course.</p>
    </div>
</template>

<script>
import axios from "axios";

export default {
    name: "CourseHandouts",
    props: {
        course: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            handouts: [],
        };
    },
    watch: {
        course: {
            immediate: true,
            handler(newCourse) {
                if (newCourse && newCourse.id) {
                    this.fetchHandouts(newCourse.id);
                }
            },
        },
    },
    methods: {
        async fetchHandouts(courseId) {
            try {
                const response = await axios.get(`/api/courses/${courseId}/handouts`);
                this.handouts = response.data;
            } catch (error) {
                console.error("Failed to fetch handouts:", error);
            }
        },
    },
};
</script>

<style scoped>
.course-handouts {
    padding: 20px;
}

.course-handouts h2 {
    margin-bottom: 10px;
}

.course-handouts ul {
    list-style: none;
    padding: 0;
}

.course-handouts li {
    margin-bottom: 5px;
}

.course-handouts a {
    color: #007bff;
    text-decoration: none;
}

.course-handouts a:hover {
    text-decoration: underline;
}
</style>