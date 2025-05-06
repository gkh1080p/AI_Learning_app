<template>
  <div class="student-handouts">
    <h2 class="header">讲义列表</h2>
    <el-table :data="handouts" :header-cell-style="{ fontWeight: 'normal', color: '#666' }" style="width: 100%"
      v-if="handouts.length">
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column prop="name" label="名称" show-overflow-tooltip />
      <el-table-column prop="createTime" label="发布时间" width="120" align="right" />
      <el-table-column label="操作" width="120" align="center">
        <template #default="{ row }">
          <el-button type="text" @click="handleDownload(row)" class="download-btn">
            <i class="el-icon-download"></i> 下载
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <p v-else class="empty-tip">当前课程暂无讲义</p>
  </div>
</template>

<script>
import { getmaterials } from '@/api/content'

export default {
  name: "StudentHandouts",
  props: {
    course: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      handouts: []
    }
  },
  created() {
    // this.fetchHandouts()
  },
  mounted() {
    this.fetchHandouts()
  },
  methods: {

    // 获取讲义列表
    fetchHandouts() {
      const id = this.course.id
      console.log("coursere:", this.course)

      getmaterials(id).then(res => {
        console.log("获取讲义成功:", res)
        this.handouts = res.data.map(item => ({
          id: item.id,
          name: item.title || item.name,
          createTime: item.createTime.split(' ')[0],
          url: item.eduMaterialId
        }))
      }).catch(error => {
        this.$message.error('获取讲义列表失败')
      })
    },

    // 下载功能（直接使用浏览器下载）
    handleDownload(row) {
      const link = document.createElement('a')
      link.href = row.url
      link.download = row.name
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
}
</script>

<style scoped>
.student-handouts {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
}

.header {
  margin: 0 0 20px 0;
  font-size: 16px;
  color: #333;
  font-weight: normal;
}

.empty-tip {
  color: #999;
  text-align: center;
  margin: 20px 0;
}

.download-btn {
  color: #409EFF;
  padding: 0;
}

.download-btn i {
  margin-right: 3px;
}
</style>