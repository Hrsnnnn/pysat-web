<template>
  <div id="card">
    <header>
      <!-- 我暂时不知道为什么用v-bind不能绑定图片 -->
      <!-- <img class="avatar" v-bind:src="user.img" v-bind:alt="user.name"> -->
      <img class="avatar" :src="myAvatarUrl" v-bind:alt="user.name" />
      <p class="name">{{user.name}}</p>
    </header>
    <footer>
      <input class="search" type="text" v-model="queryUser" placeholder="搜索用户" v-on:keyup="sendHello"/>
    </footer>
  </div>
</template>

<script>
import ChatMixin from './ChatMixin.js'
export default {
  name: 'card',
  mixins: [ChatMixin],
  data () {
    return {
      queryUser: '',
      user: {
        name: '',
        img: '@/assets/cx.png'
      }
    }
  },
  methods: {
    sendHello (e) {
      if (e.keyCode === 13) {
        this.sendMessage(this.queryUser, '你好')
        this.queryUser = ''
      }
    }
  },
  mounted: function () {
    this.user.name = this.$store.getters.getUser
  }
}
</script>

<style lang="scss" scoped>
#card {
  padding: 12px;
  padding-bottom: 0%;
  .avatar {
    border-radius: 5px;
    width: 40px;
    height: 40px;
    vertical-align: middle; /*这个是图片和文字居中对齐*/
  }
  .name {
    display: inline-block;

    padding: 10px;
    margin-bottom: 15px;
    font-size: 16px;
  }

  .search {
    background: #26292e;
    height: 30px;
    width: 75%;
    line-height: 30px;
    margin-top: 5px;
    // margin: 0%;
    padding: 0 10px;
    border: 1px solid #3a3a3a;
    border-radius: 8px;
    outline: none; /*鼠标点击后不会出现蓝色边框*/
    color: #fff;
    transition-duration: 2s;
    &:hover {
      border: 1px solid rgb(17, 93, 192);
      transition-duration: 0.3s;
    }
    &:focus {
      border: 1px solid rgb(241, 30, 146);
      transition-duration: 0.3s;
    }
    &:focus::placeholder {
      transition-duration: 1s;
      font-size: 0.8em;
    }
  }
}
</style>
