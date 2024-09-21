<template>
  <div class="chat">
    <el-form>
      <el-row>
        <div class="chat-container" style="margin-bottom: 40px">
          <div v-for="message in messages" :key="message.id" class="message">
            <el-avatar v-if="!message.isUser" shape="square" size="50" :src="botAvatar"></el-avatar>
            <div :class="{'user-message': message.isUser, 'bot-message': !message.isUser}">
              <div className="show-html" v-html=message.text></div>
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
  </div>ty
</template>

<script>

import {marked} from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'
export default {
  name: "chat",
  data () {
    return {
      messages: [
        {id: 1, text: '我是您的私人智能助理，请问现在能帮您做什么？', isUser: false}
      ],
      inputMessage: '',
      botAvatar: require('../../assets/images/robot.png')
    }
  },
  methods: {
    renderMessageContent(msg) {
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
        self.$http.post('/chat/chat', {'content': self.inputMessage}, 'apiUrl').then(res => {
          self.messages.push({id: self.messages.length + 1, text: self.renderMessageContent(res), isUser: false});
          self.inputMessage = '';
        })
      }
    }
  }
}
</script>

<style>
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
</style>
