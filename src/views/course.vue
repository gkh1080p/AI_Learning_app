<template>
  <el-row type="flex" justify="center">
    <el-col :span="20">
      <!-- 面包屑 -->
      <el-breadcrumb separator-class="el-icon-arrow-right" style="margin: 20px 0;color: #333">
        <el-breadcrumb-item>全部课程</el-breadcrumb-item>
        <el-breadcrumb-item v-for="(item, index) in getDetailsSubject(course.subjectParent)" :key="index">
          {{ item }}
        </el-breadcrumb-item>
        <el-breadcrumb-item>{{ course.title }}</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 播放器 -->
      <div style="position: relative;width: 100%">
        <v-course-player ref="CoursePlayer" />
        <!-- 付费课程订阅栏 -->
        <div v-if="false" class="sub-course">
          <div>
            <div style="color: #fff;font-size: 20px;">
              {{ course.title }}
              <span style="color: #ff4f23;margin-left: 20px;">￥{{ course.price }}</span>
            </div>
            <div style="color: #999;font-size: 13px;margin-top: 5px">
              <span style="margin-right: 26px">{{ course.lessonNum }} 总课时</span>
              <span style="margin-right: 26px">{{ course.buyCount }} 人订阅过</span>
              <span>{{ course.viewCount }} 人观看过</span>
            </div>
          </div>
          <div style="margin-left: auto">
            <div style="width: 22vw;text-align: center">
              <el-button type="primary" style="width: 18vw;font-size: 18px" icon="el-icon-plus"
                @click="openBuyCourseDialog">
                订阅课程
              </el-button>
            </div>
          </div>
        </div>
      </div>
      <!-- 课程简介、评价 -->
      <div class="clearfix" style="margin-top: 20px">
        <div style="width: 73%;background-color: #fff;padding: 10px 20px;float: left;">
          <el-tabs @tab-click="handleTabClick">
            <el-tab-pane label="课程概述" class="course-descriptiont" v-html="course.description" />
            <el-tab-pane label="课程评价" lazy>
              <v-course-comment :course="course" />
            </el-tab-pane>
            <el-tab-pane label="讲义下载" lazy>
              <v-course-handouts :course="course" />
            </el-tab-pane>
            <el-tab-pane label="课后练习" lazy>
              <router-link :to="{ name: 'question', params: { id: course.id } }"></router-link>
            </el-tab-pane>
          </el-tabs>
        </div>
        <!-- 讲师简介 -->
        <div style="width: 26%;background-color: #fff;float: right">
          <el-card>
            <div slot="header">讲师简介</div>
            <div style="display: flex;align-items: center;">
              <router-link :to="{ name: 'SearchByTeacher', params: { teacher: teacher.id || 0 } }">
                <el-avatar fit="contain" :src="teacher.avatar" :size="70" style="float: left;margin-right: 12px" />
              </router-link>
              <div>
                <div style="color: #20a0ff;font-size: 18px;cursor: pointer" @click="linkToTeacher(teacher.id)">
                  {{ teacher.name }}
                </div>
                <div style="margin-top: 10px;font-size: 14px" :title="teacher.email">
                  <i class="el-icon-message" />
                  {{ teacher.email }}
                </div>
              </div>
            </div>
            <div style="margin-top: 12px;font-size: 15px;line-height: 24px;color: #666">
              {{ teacher.intro }}
            </div>
          </el-card>
        </div>
      </div>
    </el-col>
    <!-- <el-dialog
      :title="`支付订单《${course.title}》`"
      :visible.sync="buyCourseDialogVisible"
      :close-on-click-modal="false"
      append-to-body
      destroy-on-close
      width="36vw"
    >
      <div style="margin-bottom: 12px">
        <span> 订单编号: {{ orderNo }}</span>
        <span style="margin-left: 24px">金额:
          <span style="color: #ff4f23">￥{{ course.price }}</span>
        </span>
      </div>
      <div style="text-align: center;font-size: 16px">
        请在以下时间内完成支付:
        <mv-count-down
          style="margin-top: 7px"
          :start-time="new Date().getTime()"
          :end-time="new Date().getTime() + 1800000"
          end-text="支付订阅已经过期，请关闭再打开刷新"
          :hour-txt="'小时'"
          :minutes-txt="'分钟'"
          :seconds-txt="'秒'"
          :is-start="true"
        />
      </div>
      <div style="margin: 36px 0 50px 0;text-align: center">
        <el-button type="primary" icon="el-icon-shopping-cart-2" style="width: 16vw;font-size: 20px" @click="buyCourse">
          点击支付
        </el-button>
      </div>
    </el-dialog> -->
  </el-row>
</template>

<script>
import { getCourseDetail, getTeacher, getIsBuyCourse, createOrder, orderPaySucceed } from '@/api/content'
import MvCountDown from 'mv-count-down'
import { mapGetters } from 'vuex'

export default {
  name: 'Course',
  components: {
    // 课程播放器组件
    'v-course-player': () => import('@/components/course/course_player'),
    // 课程评论组件
    'v-course-comment': () => import('@/components/course/course_comment'),
    // 课程讲义组件
    'v-course-handouts': () => import('@/components/course/course_handouts'),
    // 倒计时组件（用于支付）
    MvCountDown
  },
  data() {
    return {
      // 当前课程信息对象
      course: {},
      // 讲师信息对象
      teacher: {},
      // 是否显示购买对话框
      buyCourseDialogVisible: false,
      // 当前订单编号
      orderNo: '',
      // 当前用户是否已经购买该课程
      isBuyTheCourse: false
    }
  },
  computed: {
    // 从 Vuex 中获取登录用户信息
    ...mapGetters(['user']),
    // 是否展示课程购买栏（如果课程价格不为0并且用户未购买）
    showBuyBanner: function () {
      return !(this.course.price === 0 || this.isBuyTheCourse)
    }
  },
  created() {
    // 组件创建时获取课程ID并加载课程数据
    const courseId = this.$route.params.id
    this.getCourseData(courseId)
    this.getIsBuyCourse(courseId)
  },
  methods: {
    /**
     * 获取课程详情数据，并初始化讲师信息及播放器
     * @param {String|Number} id - 课程ID
     */
    getCourseData(id) {
      getCourseDetail(id).then(resp => {
        this.course = resp.data
        // 获取讲师信息
        this.getTeacher(this.course.teacherId)
        // 延迟初始化播放器
        setTimeout(function () {
          this.$refs.CoursePlayer.setData(this.course)
        }.bind(this), 100)
      })
    },

    /**
     * 处理选项卡点击事件
     * @param {Object} tab - 被点击的选项卡对象
     */
    handleTabClick(tab) {
      // 处理选项卡点击事件
      if (tab.label === '课后练习') {
        this.$router.push({ name: 'question', params: { id: this.course.id } })
      }
    },

    /**
     * 获取讲师信息
     * @param {String|Number} id - 讲师ID
     */
    getTeacher(id) {
      getTeacher(id).then(resp => {
        this.teacher = resp.data
      })
    },

    /**
     * 判断当前用户是否已经购买该课程
     * @param {String|Number} id - 课程ID
     */
    getIsBuyCourse(id) {
      if (this.user === null || Object.keys(this.user).length === 0) {
        return // 未登录不执行
      }
      getIsBuyCourse(id).then(resp => {
        this.isBuyTheCourse = resp.data
      })
    },

    /**
     * 递归获取课程所属学科的层级信息（用于面包屑）
     * @param {Object} subjectParent - 父学科对象
     * @returns {Array} - 学科名称数组
     */
    getDetailsSubject(subjectParent) {
      let subject = []
      let parent = subjectParent
      while (parent) {
        subject = [parent.title, ...subject]
        parent = parent.parent
      }
      return subject
    },

    /**
     * 打开购买课程弹窗，如果未登录先登录，然后创建订单
     */
    openBuyCourseDialog() {
      if (this.user === null || Object.keys(this.user).length === 0) {
        // 弹出登录窗口
        this.$login()
        return
      }
      // 创建订单请求参数
      const params = {
        courseId: this.course.id,
        memberId: this.user.id,
        totalFee: this.course.price
      }
      // 发送创建订单请求
      createOrder(params).then(resp => {
        this.$message({ message: resp.message, type: 'success', customClass: 'elmessage' })
        this.orderNo = resp.data
        this.buyCourseDialogVisible = true
      })
    },

    /**
     * 模拟订单支付成功流程（实际支付逻辑应该在后端完成）
     */
    buyCourse() {
      if (this.orderNo) {
        orderPaySucceed(this.orderNo).then(resp => {
          this.$message.success(resp.message)
          this.buyCourseDialogVisible = false
        })
      }
    },

    /**
     * 跳转到讲师搜索页（查看该讲师的其他课程）
     * @param {Number} tid - 讲师ID
     */
    linkToTeacher(tid) {
      this.$router.push({
        name: 'SearchByTeacher',
        params: { teacher: tid }
      })
    }
  }
}
</script>


<style lang="scss">
.el-tabs__item {
  font-size: 16px;
  height: 50px;
  line-height: 50px;
}

.elmessage {
  z-index: 9999 !important;
}
</style>

<style lang="scss" scoped>
.sub-course {
  background-color: #333;
  position: absolute;
  bottom: 0;
  width: 100%;
  min-height: 80px;
  z-index: 3;
  padding: 14px 16px;
  display: flex;
  align-items: center;
}

// 课程介绍颜色
.course-descriptiont {

  /* table 样式 */
  table {
    border-top: 1px solid #ccc;
    border-left: 1px solid #ccc;
  }

  table td,
  table th {
    border-bottom: 1px solid #ccc;
    border-right: 1px solid #ccc;
    padding: 3px 5px;
  }

  table th {
    border-bottom: 2px solid #ccc;
    text-align: center;
  }

  /* blockquote 样式 */
  blockquote {
    display: block;
    border-left: 8px solid #d0e5f2;
    padding: 5px 10px;
    margin: 10px 0;
    line-height: 1.4;
    font-size: 100%;
    background-color: #f1f1f1;
  }

  /* code 样式 */
  code {
    display: inline-block;
    *display: inline;
    *zoom: 1;
    background-color: #f1f1f1;
    border-radius: 3px;
    padding: 3px 5px;
    margin: 0 3px;
  }

  pre code {
    display: block;
  }

  /* ul ol 样式 */
  ul,
  ol {
    margin: 10px 0 10px 20px;
  }
}
</style>
