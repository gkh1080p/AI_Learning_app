import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/components/Layout'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/404',
      component: () => import('@/views/404'),
      meta: { index: 0, title: '404' },
      hidden: true
    },
    {
      path: '/refresh',
      name: 'Refresh',
      component: () => import('@/components/common/refresh'),
      meta: { title: 'refresh' },
      hidden: true
    },
    // 首页
    {
      path: '/',
      component: Layout,
      children: [
        {
          path: '',
          name: 'Index',
          meta: { title: '首页' },
          component: () => import('@/views/Index')
        }
      ]
    },
    // 课程相关
    {
      path: '/course',
      component: Layout,
      children: [
        // 课程详情页面
        {
          path: '/course/detail/:id',
          name: 'Course',
          meta: { title: '课程' },
          component: () => import('@/views/course')
        },
        // 根据关键字搜索课程
        {
          path: '/course/s/:title',
          name: 'SearchByKeyword',
          meta: { title: '搜索' },
          component: () => import('@/views/search_keyword')
        },
        // 根据分类搜索课程
        {
          path: '/course/sub/:subject',
          name: 'SearchBySubject',
          meta: { title: '分类' },
          component: () => import('@/views/search_subject')
        },
        // 根据讲师搜索课程
        {
          path: '/course/tch/:teacher',
          name: 'SearchByTeacher',
          meta: { title: '讲师' },
          component: () => import('@/views/search_teacher')
        }
      ]
    },
    // 用户中心
    {
      path: '/user',
      component: Layout,
      redirect: '/user/profile',
      children: [
        // 个人中心
        {
          path: '/user/profile',
          name: 'Profile',
          meta: { title: '个人中心' },
          component: () => import('@/views/profile/index')
        },
        // 订阅订单
        {
          path: '/user/order',
          name: 'Order',
          meta: { title: '订阅订单' },
          component: () => import('@/views/order')
        }
      ]
    },
    {
      path: '/recruit',
      component: Layout,
      redirect: '/recruit/claim',
      children: [
        // 招聘要求
        {
          path: '/recruit/claim',
          name: 'Recruit',
          meta: { title: '讲师入驻' },
          component: () => import('@/views/recruit/recruit_reqm')
        },
        // 入驻申请
        {
          path: '/recruit/apply',
          name: 'Apply',
          meta: { title: '讲师入驻' },
          component: () => import('@/views/recruit/apply')
        }
      ]
    },
    {
      path: '/tool',
      name: 'tool',
      meta: { title: '工具分享' },
      component: () => import('@/components/common/tool'),
    },
    {
      path: '/chatGPT',
      name: 'chatGPT',
      meta: { title: 'AI机器人' },
      // component: () => import('@/components/chatGPT/chatGPT'),
      component: () => import('@/components/chatGPT/puter'),
    },
    {
      path: '/question/:id',
      name: 'question',
      meta: { title: '课后练习' },
      component: () => import('@/components/question/question_bank.vue'),
    },
    {
      path: '/report/:userid',
      name: 'report',
      meta: { title: '学习报告' },
      component: () => import('@/components/report/report_student.vue'),
    },

    // 404 page must be placed at the end !!!
    { path: '*', redirect: '/404', hidden: true }
  ]
})
