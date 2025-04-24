<!-- 分类与轮播 -->
<template>
  <el-row>
    <el-col :span="4">
      <el-cascader-panel v-model="selectionValue" :options="subjectData" class="subject-selection"
        :props="{ expandTrigger: 'hover', value: 'id', label: 'title' }" @change="selected" />
    </el-col>
    <el-col :span="20">
      <el-carousel trigger="click" height="300px" :interval="5000" style="border-radius: 5px;">
        <el-carousel-item v-for="banner in bannerData" :key="banner.id">
          <a :href="banner.linkUrl" :title="banner.title" target="_blank">
            <el-image :src="encodeOssFileUri(banner.imageUrl)" fit="cover" class="banner-img" />
          </a>
        </el-carousel-item>
      </el-carousel>
    </el-col>
  </el-row>
</template>

<script>
import { getSubjects, getBanners } from '@/api/content'
import { encodeOssFileUri } from '@/utils'
export default {
  name: 'Carousel',
  data() {
    return {
      selectionValue: null,
      subjectData: [
        {
          id: 1,
          title: 'Mathematics',
          children: [
            { id: 11, title: 'Algebra' },
            { id: 12, title: 'Geometry' }
          ]
        },
        {
          id: 2,
          title: 'Science',
          children: [
            { id: 21, title: 'Physics' },
            { id: 22, title: 'Chemistry' }
          ]
        },
        {
          id: 3,
          title: 'Languages',
          children: [
            { id: 31, title: 'English' },
            { id: 32, title: 'Spanish' }
          ]
        }
      ],
      bannerData: [
        { id: 1, imageUrl: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg', linkUrl: 'https://example.com/banner1', title: 'Banner 1' },
        { id: 2, imageUrl: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg', linkUrl: 'https://example.com/updated2', title: 'Updated Banner 2' },
        { id: 3, imageUrl: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg', linkUrl: 'https://example.com/updated3', title: 'Updated Banner 3' },
      ]
    }
  },
  created() {
    this.getSubjects()
    this.getBanners()
  },
  methods: {
    selected(val) {
      const arr = val
      if (!!arr || arr.length > 0) {
        const subjectId = arr[arr.length - 1]
        // const { href } = this.$router.resolve({
        //   name: 'SearchBySubject',
        //   params: { subject: subjectId }
        // })
        // window.open(href, '_blank')
        this.$router.push({
          name: 'SearchBySubject',
          params: { subject: subjectId }
        })
      }
    },
    encodeOssFileUri(ossUri) {
      return encodeOssFileUri(ossUri)
    },
    getSubjects() {
      getSubjects().then(resp => {
        this.subjectData = resp.data
      })
    },
    getBanners() {
      getBanners().then(resp => {
        this.bannerData = resp.data

      })
    }
  }
}
</script>

<style lang="scss">
.subject-selection {
  position: relative;
  height: 300px;
  z-index: 1000;
  border-radius: 5px;

  .el-scrollbar {
    background-color: #fff;
    color: #333;
    min-width: 100%;
    width: 100%;
    border-radius: 5px;

    .el-scrollbar__wrap {
      overflow: auto;
    }

    .el-cascader-node__postfix {
      right: 20px;
    }

    &:first-child {
      background-color: rgba(0, 0, 0, .678431);
      color: #cccccc;
    }

    &:nth-child(2),
    &:nth-child(3),
    &:nth-child(4),
    &:nth-child(5) {
      visibility: hidden;
    }
  }
}

.subject-selection:hover {
  >.el-scrollbar {
    visibility: visible;
  }
}
</style>

<style scoped lang="scss">
.banner-img {
  width: 100%;
  height: 100%;
}
</style>
