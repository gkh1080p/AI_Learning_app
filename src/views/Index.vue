<template>
  <el-row type="flex" justify="center">
    <el-col :span="20">
      <v-carousel style="margin-top: 20px" />
      <div class="course-list">课程列表</div>
      <v-course-list :course-list="courseList" style="margin-top: 20px" />
      <div class="pagination">
        <el-pagination background layout="total, prev, pager, next, jumper" :total="total"
          :page-size.sync="searchParams.pageSize" :current-page.sync="searchParams.current" @size-change="getList"
          @current-change="getList" />
      </div>
    </el-col>
  </el-row>
</template>

<script type="module">
import { getCourses } from '@/api/content'
export default {
  name: 'Index',
  components: {
    'v-carousel': () => import('@/components/home/carousel'),
    'v-course-list': () => import('@/components/common/course_list')
  },
  data() {
    return {
      searchParams: {
        current: 1,
        pageSize: 12
      },
      total: 0,
      // Mock数据
      courseList: [
        {
          id: 1,
          cover: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d',
          title: '高等数学基础课程',
          lessonNum: 20,
          teacherName: '李老师',
          price: 0,
          buyCount: 1200
        },
        {
          id: 2,
          cover: 'https://images.unsplash.com/photo-1522199710521-72d69614c702',
          title: '大学物理精讲',
          lessonNum: 15,
          teacherName: '王教授',
          price: 199,
          buyCount: 850
        },
        {
          id: 3,
          cover: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
          title: '英语四级备考全攻略',
          lessonNum: 30,
          teacherName: '陈老师',
          price: 49,
          buyCount: 2300
        },
        {
          id: 4,
          cover: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
          title: '零基础入门Python',
          lessonNum: 25,
          teacherName: '张老师',
          price: 0,
          buyCount: 3100
        },
        {
          id: 5,
          cover: 'https://images.unsplash.com/photo-1502767089025-6572583495b9',
          title: '化学实验视频课程',
          lessonNum: 18,
          teacherName: '赵老师',
          price: 99,
          buyCount: 600
        },
        {
          id: 6,
          cover: 'https://images.unsplash.com/photo-1519340333755-5063d00c44a2',
          title: '考研数学一强化班',
          lessonNum: 35,
          teacherName: '马老师',
          price: 299,
          buyCount: 1500
        }
      ]

    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getCourses(this.searchParams).then(resp => {
        this.courseList = resp.data.list
        // Mock数据
        this.courseList =
          this.total = resp.data.total
      })
    }
  }
}
</script>

<style scoped lang="scss">
.course-list {
  margin-top: 30px;
  font-size: 24px;
  padding-left: 10px;
  border-left: #409eff solid 5px;
}
</style>
