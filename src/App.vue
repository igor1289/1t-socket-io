<template>
  <div class="layout container mt-4">
    <div class="messages is-flex is-flex-direction-column is-justify-content-flex-end">
      <div
        class="is-flex mt-1 mb-1"
        :class="{ 'is-justify-content-flex-end': !message.incoming }"
        v-for="message in messages"
        :key="message.id"
      >
        <div class="box">
          <div v-html="message.text"></div>
          <div v-if="message.img"><img :src="message.img" /></div>
        </div>
      </div>
    </div>
    <div class="message-input">
      <textarea
        class="textarea has-fixed-size"
        placeholder="Введите сообщение"
        rows="3"
        v-model="messageText"
      ></textarea>
      <button class="button is-link mt-2" @click="sendMessage">Отправить</button>
    </div>
  </div>
</template>

<script setup>
import { io } from 'socket.io-client'
import { ref } from 'vue'

const messages = ref([])
const messageText = ref('')

const socket = io('http://localhost:3001')

function addMessage(message, incoming = true) {
  const newMessage = Object.assign({}, message)
  newMessage.id = messages.value.length + 1
  newMessage.incoming = incoming
  messages.value.push(newMessage)
}

socket.on('message', (message) => {
  addMessage(message)
})

socket.on('disconnect', (reason) => {
  addMessage({ text: `Оффлайн: ${reason}` }, true)
})

function sendMessage() {
  if (messageText.value) {
    socket.emit('message', messageText.value)

    addMessage({ text: messageText.value }, false)

    messageText.value = ''
  }
}
</script>
<style>
@import 'bulma/css/bulma.min.css';

.layout {
  height: 100vh;
  display: grid;
  grid-template-rows: 1fr 200px;
  grid-column-gap: 0px;
  grid-row-gap: 5px;
}

.messages {
  grid-row: 1;
}

.message-input {
  grid-row: 2;
}
</style>
