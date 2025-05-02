<template>
    <div class="chat-container">
      <div class="chat-window" ref="chatWindow">
        <div
          v-for="(msg, i) in messages"
          :key="i"
          :class="['message', msg.role]"
        >
          <div class="bubble">{{ msg.content }}</div>
        </div>
      </div>
  
      <div class="input-bar">
        <input v-model="userInput" @keyup.enter="send" placeholder="请输入你的问题..." />
        <button @click="send">发送</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        userInput: '',
        messages: [],
        apiKey: 'fk232959-7HZE1fMH0bvk8SzQ0dLAV4pj9zytebsF'
      };
    },
    mounted() {
      this.messages.push({
        role: 'assistant',
        content: '你好呀，我是你的 AI 小助手，有什么我可以帮你的吗？🤖'
      });
    },
    methods: {
      async send() {
        const question = this.userInput.trim();
        if (!question) return;
  
        this.messages.push({ role: 'user', content: question });
        this.userInput = '';
  
        try {
          const res = await fetch('https://openai.api2d.net/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
              model: 'gpt-3.5-turbo',
            // model:"text-embedding-ada-002",
              messages: [
                { role: 'system', content: '你是一个有帮助的中文助手。' },
                ...this.messages
              ]
            })
          });
          const data = await res.json();
          const reply = data.choices?.[0]?.message?.content || 'AI 无响应';
          this.messages.push({ role: 'assistant', content: reply });
  
          this.$nextTick(() => {
            const container = this.$refs.chatWindow;
            container.scrollTop = container.scrollHeight;
          });
        } catch (e) {
          this.messages.push({ role: 'assistant', content: '请求失败，请检查网络或 API 密钥' });
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .chat-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: #f5f7fa;
  }
  
  .chat-window {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: white;
  margin: 20px auto 40px;
  width: 100%;
  max-width: 1000px; 
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

  
  .message {
    display: flex;
    margin-bottom: 12px;
  }
  
  .message.user {
    justify-content: flex-end;
  }
  
  .message.assistant {
    justify-content: flex-start;
  }
  
  .bubble {
    max-width: 70%;
    padding: 12px 16px;
    border-radius: 20px;
    word-wrap: break-word;
    white-space: pre-wrap;
    font-size: 15px;
    line-height: 1.5;
  }
  
  .user .bubble {
    background-color: #1890ff;
    color: white;
    border-bottom-right-radius: 6px;
  }
  
  .assistant .bubble {
    background-color: #f1f1f1;
    color: #333;
    border-bottom-left-radius: 6px;
  }
  
  .input-bar {
    display: flex;
    padding: 10px 20px;
    background: #ffffff;
    border-top: 1px solid #ddd;
    position: sticky;
    bottom: 0;
    z-index: 10;
  }
  
  .input-bar input {
    flex: 1;
    border: 1px solid #ccc;
    border-radius: 24px;
    padding: 10px 14px;
    font-size: 16px;
    outline: none;
  }
  
  .input-bar button {
    margin-left: 12px;
    padding: 10px 18px;
    background-color: #1890ff;
    color: white;
    border: none;
    border-radius: 24px;
    font-size: 16px;
    cursor: pointer;
  }
  
  .input-bar button:hover {
    background-color: #40a9ff;
  }
  </style>
  