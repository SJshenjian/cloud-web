<template>
  <div class="chat">
    <el-form>
      <el-row>
        <div class="chat-container" style="margin-bottom: 40px">
<!--          <div v-for="message in messages" :key="message.id" class="message">-->
<!--            <el-avatar v-if="!message.isUser" shape="square" size="50" :src="botAvatar"></el-avatar>-->
<!--            <div :class="{'user-message': message.isUser, 'bot-message': !message.isUser}">-->
<!--              <div className="show-html" v-html=message.text></div>-->
<!--            </div>-->
<!--          </div>-->
          <div class="messages" v-for="msg in messages" :key="msg.id">
            <div :class="msg.from === 'user' ? 'user-message' : 'ai-message'">
              <div v-if="msg.type === 'code'" class="code-block">
                <pre>
                  <code class="language-javascript">{{ msg.text }}</code>
                </pre>
                <button @click="copyToClipboard(msg.text)">复制</button>
              </div>
              <div v-else v-html="renderMessageContent(msg.text)"></div>
            </div>
          </div>
        </div>
      </el-row>
      <el-row style="position: fixed; bottom: 45px; left: 5%; right: 5%; width: 90%;">
        <el-col :span="21">
          <el-input v-model="inputMessage" placeholder="请输入问题..." @keyup.enter="sendMessage" style="width: 100%;"></el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="sendMessage" style="width: 100%;">发送</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>

import {marked} from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'
import store from "@/store";
export default {
  name: "sseChat",
  data () {
    return {
      messages: [
        {id: 1, text: '我是您的私人智能助理，请问现在能帮您做什么？', isUser: false}
      ],
      inputMessage: '',
      botAvatar: require('../../assets/images/robot.png'),
      handlers: [
        {
          event: 'message',
          color: '#60778e'
        },
        {
          event: 'time',
          color: '#778e60'
        }
      ],
      client: null,
      // 无需跨域，否则无法接收消息, 这个原因浪费我好多时间
      url: 'http://127.0.0.1:8080/sse/subscribe?token=' + store.getters.token,
    }
  },
  mounted() {
    this.connect()
  },
  methods: {
    copyToClipboard(text) {
      navigator.clipboard.writeText(text).then(() => {
        alert('代码已复制到剪贴板！');
      });
    },
    connect () {
      // create the client with the user's config
      const self = this
      let client = this.$sse.create({
        url: this.url,
        includeCredentials: false
      })
      // add the user's handlers
      this.handlers.forEach((h) => {
        client.on(h.event, (data) => { //
          if (data === '<SSE_START>') {
            self.messages.push( {
              text: '',
              from: 'ai',
              type: 'text',
            })
            console.log(data)
          } else if (data === '<SSE_END>') {
            console.log(data)
          } else {
            const isCode = data.startsWith('```');
            console.log(data)
            const msg = {
              text: data,
              from: 'ai',
              type: isCode ? 'code' : 'text',
            };
            self.messages[self.messages.length - 1].text += data;
            self.highlightCode();
          }
        })
      })

      client.on('error', () => { // eslint-disable-line
        console.log('[error] disconnected, automatically re-attempting connection', 'system')
      })

      // and finally -- try to connect!
      client.connect() // eslint-disable-line
          .then(() => {
            console.log('[info] connected', 'system')
          })
          .catch(() => {
            console.log('[error] failed to connect', 'system')
          })
    },
    highlightCode() {
      this.$nextTick(() => {
        this.$el.querySelectorAll('pre code').forEach((block) => {
          hljs.highlightBlock(block);
        });
      });
    },
    // markdown
    renderMessageContent(msg) {
      if (msg === '') {
        return '';
      }
      marked.setOptions({
        renderer: new marked.Renderer(),
        highlight: function(code, lang) {
          // If lang is provided, use it; otherwise, let hljs guess
          return hljs.highlight(code, { language: lang || '' }).value;
        },
        langPrefix: 'hljs language-',
        pedantic: false,
        gfm: true,  // GitHub Flavored Markdown for better code block support among other things
        breaks: false,
        sanitize: true,  // For security, sanitize the HTML output unless you trust the source
        smartypants: false,
        xhtml: false
      });
      let html = marked(msg)
      return html
    },
    sendMessage() {
      const self = this
      if (self.inputMessage) {
        self.messages.push({id: self.messages.length + 1, text: self.inputMessage, isUser: true});
        // 一次性输出
        // self.$http.post('/chat/chat', {'content': self.inputMessage}, 'apiUrl').then(res => {
        //   self.messages.push({id: self.messages.length + 1, text: self.renderMessageContent(res), isUser: false});
        //   self.inputMessage = '';
        // })
        // 流式输出
        self.$http.post('/chat/sseChat', {'content': self.inputMessage}, 'apiUrl').then(res => {
          self.inputMessage = '';
        })
      }
    },

  }
}
</script>

<style scoped>
.chat{
  height: calc(100vh - 120px); /* Adjust based on your header/footer size */
  overflow-y: auto;
}

.message {
  display: flex;
  align-items: flex-start;
  margin: 10px;
}

.user-message {
  justify-content: flex-end;
  text-align: right;
}

.bot-message {
  text-align: left;
}
chat-container {
  display: flex;
  flex-direction: column;
  max-width: 600px;
  margin: auto;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.user-message {
  text-align: right;
  background-color: #d1e7dd;
  padding: 8px;
  border-radius: 5px;
  margin: 5px 0;
}

.ai-message {
  text-align: left;
  background-color: #f6f8f8;
  padding: 8px;
  border-radius: 5px;
  margin: 5px 0;
}

input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  margin-left: 10px;
  padding: 5px 10px;
  cursor: pointer;
}
</style>
