<template>
    <div class="exercise-container">
        <h1 class="title">课后练习</h1>

        <!-- 类型选择 -->
        <div v-if="!selectedType" class="type-selection">
            <h2>请选择练习模式</h2>
            <div class="type-buttons">
                <button v-for="(label, type) in exerciseTypes" :key="type" class="type-btn" @click="selectType(type)">
                    {{ label }}
                </button>
            </div>
            <!-- 返回按钮 -->
            <button class="back-btn" @click="goBack">
                <i class="el-icon-arrow-left"></i> 返回
            </button>
        </div>

        <!-- 题目展示 -->
        <div v-else class="question-section">
            <h2 class="section-title">当前模式：{{ exerciseTypes[selectedType] }}</h2>

            <!-- 每题展示 -->
            <div v-for="(q, index) in questions" :key="q.id" class="question-block">
                <p class="question-text">{{ index + 1 }}. {{ q.question }}({{ q.multiple ? '多选' : '单选' }})</p>
                <div class="options">
                    <div v-for="opt in q.options" :key="opt" class="option"
                        :class="{ selected: isSelected(index, opt) }" @click="selectAnswer(index, opt)">
                        {{ opt }}
                    </div>
                </div>
            </div>

            <!-- 提交按钮 -->
            <div v-if="questions.length && !submitted" class="submit-box">
                <button class="submit-btn" :disabled="!isAllAnswered" @click="submitAnswers">
                    提交练习
                </button>
            </div>

            <!-- 答题结果展示 -->
            <div v-else-if="submitted" class="result-box">
                <h3>答题结果</h3>
                <p class="score-summary">
                    共 {{ questions.length }} 题，答对 {{ correctCount }} 题，得分：
                    <span class="score">{{ scorePercentage }}%</span>
                </p>
                <div v-for="(q, index) in questions" :key="'r-' + q.id" class="result-question">
                    <p>{{ index + 1 }}. {{ q.question }}</p>
                    <p>
                        你的答案：
                        <span :class="{ wrong: !isCorrect(q, userAnswers[index]) }">
                            {{ formatAnswer(userAnswers[index]) || "未作答" }}
                        </span>
                        ，正确答案：
                        <span class="correct">{{ formatAnswer(q.correct) }}</span>
                    </p>
                </div>

                <!-- 继续练习按钮 -->
                <div class="continue-btn-container">
                    <button class="continue-btn" @click="continuePractice">
                        继续练习
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "CourseExercise",
    data() {
        return {
            courseId: null,
            selectedType: null,
            exerciseTypes: {
                easy: "基础巩固",
                focus: "重点突破",
                deepen: "综合提升",
            },
            questions: [],
            userAnswers: [],
            submitted: false,
        };
    },
    created() {
        this.courseId = this.$route.params.id;
    },
    computed: {
        isAllAnswered() {
            return this.userAnswers.every((ans) => ans !== null && (Array.isArray(ans) ? ans.length > 0 : ans !== ""));
        },
        correctCount() {
            return this.questions.reduce((count, q, i) => {
                const userAns = this.userAnswers[i];
                const correctAns = q.correct;
                if (q.multiple) {
                    const sortedUser = [...(userAns || [])].sort().toString();
                    const sortedCorrect = [...correctAns].sort().toString();
                    return sortedUser === sortedCorrect ? count + 1 : count;
                } else {
                    return userAns === correctAns ? count + 1 : count;
                }
            }, 0);
        },
        scorePercentage() {
            if (!this.questions.length) return 0;
            return Math.round((this.correctCount / this.questions.length) * 100);
        },
    },
    methods: {
        selectType(type) {
            this.selectedType = type;
            this.fetchQuestions(type);
            
        },
        fetchQuestions(type) {
            // 模拟获取题目数据，实际应用中可以通过 API 获取
            this.questions = [
                {
                    id: 1,
                    question: "以下哪些是前端框架？",
                    options: ["Vue", "Django", "React", "Spring"],
                    correct: ["Vue", "React"],
                    multiple: true, // 多选题标志
                },
                {
                    id: 2,
                    question: "JavaScript 中用于声明常量的关键字是？",
                    options: ["var", "let", "const", "define"],
                    correct: "const",
                    multiple: false,
                },
                {
                    id: 3,
                    question: "以下哪个是 CSS 选择器？",
                    options: ["<style>", "#id", "function()", "let css"],
                    correct: "#id",
                    multiple: false,
                },
            ];
            this.userAnswers = this.questions.map(q => q.multiple ? [] : null);
            this.submitted = false;
        },
        selectAnswer(index, answer) {
            if (this.submitted) return;
            const question = this.questions[index];
            if (question.multiple) {
                const answers = this.userAnswers[index] || [];
                const i = answers.indexOf(answer);
                if (i >= 0) {
                    answers.splice(i, 1);
                } else {
                    answers.push(answer);
                }
                this.$set(this.userAnswers, index, [...answers]);
            } else {
                this.$set(this.userAnswers, index, answer);
            }
        },
        submitAnswers() {
            this.submitted = true;
        },
        isSelected(index, option) {
            const answers = this.userAnswers[index] || [];
            return answers.includes(option);
        },
        isCorrect(q, ans) {
            if (q.multiple) {
                const sortedUser = [...(ans || [])].sort().toString();
                const sortedCorrect = [...q.correct].sort().toString();
                return sortedUser === sortedCorrect;
            } else {
                return ans === q.correct;
            }
        },
        formatAnswer(answer) {
            return Array.isArray(answer) ? answer.join(", ") : answer;
        },
        continuePractice() {
            this.selectedType = null;
            this.userAnswers = [];
            this.submitted = false;
        },
        goBack() {
            this.$router.go(-1);
        },
    },
};
</script>

<style scoped>
.exercise-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 30px;
    font-family: "Segoe UI", sans-serif;
}

.title {
    font-size: 32px;
    margin-bottom: 20px;
    text-align: center;
}

.type-selection {
    text-align: center;
}

.type-buttons {
    display: flex;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
    margin-top: 20px;
}

.type-btn {
    padding: 15px 25px;
    font-size: 18px;
    background: linear-gradient(135deg, #ff7eb3, #ff65a3);
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.type-btn:hover {
    background: linear-gradient(135deg, #ff65a3, #ff7eb3);
    transform: scale(1.05);
}

.section-title {
    font-size: 24px;
    margin-bottom: 20px;
    text-align: center;
    color: #409eff;
}

.question-block {
    margin-bottom: 30px;
}

.question-text {
    font-size: 18px;
    margin-bottom: 10px;
}

.options {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.option {
    padding: 15px;
    border: 1px solid #dcdfe6;
    border-radius: 10px;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.3s ease;
}

.option:hover {
    background-color: #f5f7fa;
}

.option.selected {
    background-color: #409eff;
    color: white;
    border-color: #409eff;
}

.submit-box {
    text-align: center;
    margin-top: 30px;
}

.submit-btn {
    padding: 12px 30px;
    font-size: 18px;
    background: #67c23a;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
}

.submit-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
}

.result-box {
    margin-top: 30px;
    padding: 20px;
    background: #fefefe;
    border-radius: 10px;
}

.result-question {
    margin-bottom: 20px;
}

.correct {
    color: #67c23a;
    font-weight: bold;
}

.wrong {
    color: #f56c6c;
    font-weight: bold;
}

.score-summary {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 20px;
    color: #333;
}

.score {
    font-size: 22px;
    color: #e6a23c;
}

.continue-btn-container {
    text-align: center;
    margin-top: 20px;
}

.continue-btn {
    padding: 12px 30px;
    font-size: 18px;
    background: #409eff;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
}

.back-btn {
    position: absolute;
    top: 20px;
    left: 20px;
    font-size: 16px;
    background-color: transparent;
    color: #333;
    border: none;
    cursor: pointer;
    user-select: none;
}

.back-btn:hover {
    color: #409eff;
}
</style>
