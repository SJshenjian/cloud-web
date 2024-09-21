<template>
  <div class="chat">
    <el-form>
      <el-row>
        <div class="chat-container">
          <div v-for="message in messages" :key="message.id" class="message">
            <el-avatar v-if="!message.isUser" shape="square" size="50" :src="botAvatar"></el-avatar>
            <div :class="{'user-message': message.isUser, 'bot-message': !message.isUser}">
              {{ message.text }}
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
    sendMessage() {
      const self = this
      if (self.inputMessage) {
        self.messages.push({id: self.messages.length + 1, text: self.inputMessage, isUser: true});
        self.$http.post('/chat/chat', {'content': self.inputMessage}, 'apiUrl').then(res => {
          debugger
          self.messages.push({id: self.messages.length + 1, text: res, isUser: false});
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
