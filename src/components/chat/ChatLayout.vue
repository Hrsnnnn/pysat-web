<template>
  <div class="main-div">
    <div class="box-card">
      <div id="chat-layout" v-bind:class="{ 'is-mobile': isMobile}">
        <div class="sidebar" v-bind:class="{ 'is-mobile': isMobile}">
          <card></card>
          <list></list>
        </div>
        <div class="main" v-bind:class="{ 'is-mobile': isMobile}">
          <message></message>
          <usertext ></usertext>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import card from '@/components/chat/Card.vue'
import list from '@/components/chat/List.vue'
import message from '@/components/chat/Message.vue'
import usertext from '@/components/chat/UserText.vue'
import { checkSession } from '@/utils/sessionUtils/sessionFunc'
import checkMobileMixin from '@/utils/resolutionUtils/checkMobileHandler'
import ChatMixin from './ChatMixin.js'
export default {
  mixins: [ChatMixin, checkMobileMixin],
  beforeCreate () {
    checkSession(this, '', '/')
  },
  data () {
    return {}
  },
  // mounted function move to List.vue
  // mounted: function () {
  //   this.getChatList()
  //   // moveToMixins
  // },
  methods: {
  },
  components: {
    card,
    list,
    message,
    usertext
  }
}
</script>

<style lang="scss" scoped>
#chat-layout {
  user-select: none;
  padding: 0%;
  margin: 0%;
  width: 75vw;
  height: 73vh;
  &.is-mobile {
  width : 95vw;
  }
  overflow: hidden;
  border-radius: 10px;
  .main {
    position: relative;
    overflow: hidden;
    // background-color: F3F3F3;
  }
  .sidebar,
  .main {
    height: 100%;
    &.is-mobile {
    width : 50%;
    }
  }
  .sidebar {
    float: left;
    color: #f4f4f4;
    background-color: #272727;
    width: 200px;
  }
}

.box-card {
  border-radius: 15px;
  align-self: center;
  height: auto;
  width: auto;
  border: 0px dashed rgb(40, 40, 40);
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
  transition: box-shadow 0.3s ease-in-out !important;
  transition-duration: 1s;
  margin: 5%;
}
.box-card:hover {
  box-shadow: 0 5px 15px rgba(20, 20, 20, 0.8);
}

.main-div {
  height: 100vh;
  width: 100%;
  margin: 0%;
  display: flex;
  align-content: center;
  justify-content: center;
  padding: 0%;
  background: url("~@/assets/background16-9-2.jpg");

  background-size: cover;
  background-repeat: none;
  height: 100%;
}
</style>
