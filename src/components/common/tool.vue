<template>
  <div class="container">
    <!-- 头部 -->
    <header class="header">
      <!-- 分类过滤 -->
      <div class="filters">
        <button
          v-for="category in categories"
          :key="category"
          @click="selectCategory(category)"
          :class="['filter-btn', { active: selectedCategory === category }]"
        >
          {{ category }}
        </button>
        <button
          @click="selectCategory(null)"
          :class="['filter-btn', { active: !selectedCategory }]"
        >
          全部
        </button>
      </div>
    </header>

    <!-- 工具卡片网格 -->
    <div class="tool-grid">
      <div
        v-for="tool in filteredTools"
        :key="tool.name"
        class="tool-card"
        @click="openTool(tool.url)"
      >
        <div class="tool-icon">{{ tool.icon }}</div>
        <h3 class="tool-name">{{ tool.name }}</h3>
        <p class="tool-desc">{{ tool.description }}</p>
        <div class="tool-tags">
          <span v-for="tag in tool.category" :key="tag" class="tag">
            {{ tag }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ToolPage",
  data() {
    return {
      selectedCategory: null,
      tools: [
        {
          name: "Remove.bg",
          url: "https://www.remove.bg",
          category: ["AI工具", "图片处理"],
          description: "AI智能背景去除工具",
          icon: "🎭"
        },
        {
          name: "Canva",
          url: "https://www.canva.com",
          category: ["设计工具", "模板"],
          description: "在线平面设计平台",
          icon: "🖋️"
        },
        {
          name: "ChatGPT",
          url: "https://chat.openai.com",
          category: ["AI工具", "聊天机器人"],
          description: "智能对话助手",
          icon: "🧠"
        },
        {
          name: "Midjourney",
          url: "https://www.midjourney.com",
          category: ["AI工具", "图像生成"],
          description: "AI图像生成工具",
          icon: "🌄"
        },
        {
          name: "Figma",
          url: "https://www.figma.com",
          category: ["设计工具", "原型设计"],
          description: "云端协作式UI设计工具",
          icon: "📐"
        },
        {
          name: "GitHub Copilot",
          url: "https://copilot.github.com",
          category: ["开发工具", "AI编程"],
          description: "AI代码辅助工具",
          icon: "👨💻"
        },
        {
          name: "Notion AI",
          url: "https://www.notion.so",
          category: ["效率工具", "AI写作"],
          description: "智能笔记与知识管理",
          icon: "📚"
        },
        {
          name: "Grammarly",
          url: "https://www.grammarly.com",
          category: ["写作辅助", "语法检查"],
          description: "英文语法校对工具",
          icon: "🔍"
        },
        {
          name: "Runway ML",
          url: "https://runway.ml",
          category: ["AI工具", "视频编辑"],
          description: "AI视频创作平台",
          icon: "🎞️"
        },
        {
          name: "Unsplash",
          url: "https://unsplash.com",
          category: ["图片资源", "摄影"],
          description: "高质量免费图库",
          icon: "🏞️"
        },
        {
          name: "CodePen",
          url: "https://codepen.io",
          category: ["开发工具", "前端"],
          description: "在线代码编辑器",
          icon: "💾"
        },
        {
          name: "DeepL",
          url: "https://www.deepl.com",
          category: ["AI工具", "翻译"],
          description: "神经网络翻译工具",
          icon: "🔤"
        },
        {
          name: "Trello",
          url: "https://trello.com",
          category: ["项目管理", "协作"],
          description: "看板式任务管理工具",
          icon: "🗂️"
        },
        {
          name: "Zoom",
          url: "https://zoom.us",
          category: ["视频会议", "远程办公"],
          description: "高清视频会议平台",
          icon: "👥"
        },
        {
          name: "Adobe Firefly",
          url: "https://www.adobe.com/firefly",
          category: ["AI工具", "设计"],
          description: "Adobe创意生成式AI",
          icon: "✨"
        },
        {
          name: "Miro",
          url: "https://miro.com",
          category: ["协作工具", "白板"],
          description: "在线协作白板平台",
          icon: "🖍️"
        },
        {
          name: "DALL-E 3",
          url: "https://openai.com/dall-e",
          category: ["AI工具", "图像生成"],
          description: "AI图像生成器",
          icon: "🌀"
        },
        {
          name: "Otter.ai",
          url: "https://otter.ai",
          category: ["AI工具", "语音处理"],
          description: "语音转文字工具",
          icon: "📜"
        },
        {
          name: "Airtable",
          url: "https://airtable.com",
          category: ["效率工具", "数据库"],
          description: "智能表格数据库",
          icon: "🗃️"
        },
        {
          name: "Loom",
          url: "https://loom.com",
          category: ["效率工具", "视频录制"],
          description: "屏幕录制与分享",
          icon: "📼"
        },
        {
          name: "Framer",
          url: "https://framer.com",
          category: ["设计工具", "原型设计"],
          description: "交互式设计平台",
          icon: "🖱️"
        },
        {
          name: "Hemingway Editor",
          url: "https://hemingwayapp.com",
          category: ["写作辅助", "语法检查"],
          description: "写作风格优化工具",
          icon: "✒️"
        },
        {
          name: "Replicate",
          url: "https://replicate.com",
          category: ["AI工具", "开发工具"],
          description: "AI模型部署平台",
          icon: "🧩"
        },
        {
          name: "Iconscout",
          url: "https://iconscout.com",
          category: ["设计工具", "资源库"],
          description: "图标与素材库",
          icon: "🪄"
        },
        {
          name: "Descript",
          url: "https://descript.com",
          category: ["AI工具", "视频编辑"],
          description: "AI视频剪辑工具",
          icon: "🎬"
        },
        {
          name: "Webflow",
          url: "https://webflow.com",
          category: ["开发工具", "建站"],
          description: "可视化网站生成器",
          icon: "🕸️"
        },
        {
          name: "Slack",
          url: "https://slack.com",
          category: ["协作工具", "通讯"],
          description: "团队协作通讯平台",
          icon: "💌"
        },
        {
          name: "Zapier",
          url: "https://zapier.com",
          category: ["效率工具", "自动化"],
          description: "工作流自动化平台",
          icon: "⚡"
        }
      ]
    }
  },
  computed: {
    categories() {
      const all = this.tools.flatMap(tool => tool.category)
      return [...new Set(all)]
    },
    filteredTools() {
      if (!this.selectedCategory) return this.tools
      return this.tools.filter(tool =>
        tool.category.includes(this.selectedCategory)
      )
    }
  },
  methods: {
    selectCategory(category) {
      this.selectedCategory = category
    },
    openTool(url) {
      window.open(url, "_blank", "noopener,noreferrer")
    }
  }
}
</script>
  
  <style scoped>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }
  
  .header {
    text-align: center;
    margin-bottom: 2.5rem;
  }
  
  
  
  .filters {
    display: flex;
    gap: 0.8rem;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .filter-btn {
    padding: 0.5rem 1.2rem;
    border-radius: 20px;
    border: 1px solid #e5e7eb;
    background: white;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .filter-btn:hover {
    background-color: #f3f4f6;
  }
  
  .filter-btn.active {
    background-color: #3b82f6;
    color: white;
    border-color: transparent;
  }
  
  .tool-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
    padding: 0 1rem;
  }
  
  .tool-card {
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 1.5rem;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    background: white;
  }
  
  .tool-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
  
  .tool-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  
  .tool-name {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    color: #1f2937;
  }
  
  .tool-desc {
    color: #6b7280;
    margin-bottom: 1rem;
    min-height: 3em;
    line-height: 1.5;
  }
  
  .tool-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .tag {
    background-color: #f3f4f6;
    padding: 0.3rem 0.8rem;
    border-radius: 999px;
    font-size: 0.85rem;
    color: #4b5563;
  }
  </style>