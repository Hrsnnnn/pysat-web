<template>
  <div
    class="main-div"
  >
    <el-card class="box-card" v-bind:class="{ 'is-mobile': isMobile}">
      <el-form label-position="left" :model="formLogin" :rules="rules" ref="formLogin">
        <!-- $refs 只在组件渲染完成后才填充，并且它是非响应式的。它仅仅作为一个直接访问子组件的应急方案——应当避免在模版或计算属性中使用 $refs 。 -->
        <transition name="fade">
          <el-row v-if="!forgetVisible" class="login">
            <el-form-item label="用户名" prop="identity">
              <el-input v-model="formLogin.identity"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="formLogin.password" type="password"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="login">登录</el-button>
              <el-button @click="resetForm">重置</el-button>
              <el-button type="warning" @click="forgetVisible=!forgetVisible">忘记密码</el-button>
            </el-form-item>
          </el-row>
        </transition>
      </el-form>

      <el-form label-position="left" :model="formForgetpwd" ref="formForgetpwd">
        <transition name="fade">
          <el-row v-if="forgetVisible" class="forget">
            <el-form-item label="手机号或邮箱" prop="identity">
              <el-input v-model="formForgetpwd.passport" class="forget-input" placeholder="手机号或邮箱"></el-input>
            </el-form-item>
            <el-form-item label="用户名" prop="identity">
              <el-input v-model="formForgetpwd.username" class="forget-input" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="identity">
              <el-input
                v-model="formForgetpwd.newpwd"
                class="forget-input"
                placeholder="新密码"
                type="password"
              ></el-input>
            </el-form-item>
            <el-form-item label="验证码" prop="identity">
              <el-input v-model="formForgetpwd.CAPTCHA" class="forget-input" placeholder="验证码"></el-input>
            </el-form-item>

            <el-button class="forget-button" type="primary" @click="sendCAPTCHA">发送验证码</el-button>
            <el-button class="forget-button" type="primary" @click="updatePwd">更 新</el-button>
            <el-button @click="forgetVisible = false; resetForm()">取 消</el-button>

          </el-row>
        </transition>

        <el-form-item v-if="!forgetVisible">
          <router-link to="/signup">
            <el-button>
              没有账号，立即注册
              <i class="el-icon-arrow-right el-icon--right"></i>
            </el-button>
          </router-link>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script type="text/javascript">
import { Encrypt } from '@/utils/crypt.js'
import { myPost } from '@/utils/requestFunc.js'
import checkMobileMixin from '@/utils/resolutionUtils/checkMobileHandler'
import autoJumpToInfoMixin from '@/utils/sessionUtils/autoJumpToInfoHandler'

export default {
  mixins: [autoJumpToInfoMixin, checkMobileMixin],
  data () {
    let checkidentity = (rule, value, cb) => {
      // var pattern = /^1[3456789]\d{9}$/;
      var pattern = /.*/
      if (!value) {
        return cb(new Error('账户不能为空！'))
      } else if (!pattern.test(value)) {
        return cb(new Error('请填写真实的手机号！'))
      } else {
        cb() // 将判断传递给后面
      }
    }
    let checkPassword = (rule, value, cb) => {
      var pattern = /^\S{3,20}$/
      if (!value) {
        return cb(new Error('密码不能为空！'))
      } else if (!pattern.test(value)) {
        return cb(new Error('密码长度应在3~20之间！'))
      } else {
        cb()
      }
    }
    return {
      forgetVisible: false,
      formLogin: {
        identity: '',
        password: '',
        show: false
      },
      formForgetpwd: {
        passport: '',
        username: '',
        newpwd: '',
        CAPTCHA: ''
      },
      rules: {
        identity: [{ validator: checkidentity, trigger: 'blur' }],
        password: [{ validator: checkPassword, trigger: 'blur' }]
      }
    }
  },
  computed: {
  },
  methods: {
    // 向登录接口发起请求
    login () {
      // 表单验证
      this.$refs['formLogin'].validate(valid => {
        if (valid) {
          let tmpdata = {
            username: this.formLogin.identity,
            password: Encrypt(this.formLogin.password),
            token: this.$store.getters.getUserToken
          }
          myPost(
            '/api/user/sign/login',
            tmpdata,
            res => {
              if (res.data.status === 1) {
                this.$message({
                  type: 'success',
                  message: '欢迎你,' + this.formLogin.identity + '!',
                  duration: 2000
                })
                // 首先把username存到localStorage里面！！！登出的时候也要把它清掉！
                // localStorage.setItem('identity', this.formLogin.identity) // identity：强调其唯一性、主键性
                // 现在这个步骤被放到了action
                this.$store.dispatch('setUser', this.formLogin.identity)
                // 登录成功 跳转至首页
                this.$router.push('overview')
              } else {
                this.$message.error(`${res.data.msg}`)
                return false
              }
            },
            err => {
              this.$message.error(`${err.message}`, 'ERROR!')
            }
          )
        }
      })
    },

    sendCAPTCHA () {
      let tmpdata = {
        token: this.$store.getters.getUserToken,
        passport: this.formForgetpwd.passport,
        username: this.formForgetpwd.username
      }
      console.log(tmpdata)
      myPost(
        'api/user/sign/retrieve',
        tmpdata,
        res => {
          if (res.data.status === 1) {
            this.$message.success(`${res.data.msg}`)
          } else {
            this.$message.error(`${res.data.msg}`)
          }
        },
        err => {
          this.$message.error(`${err.message}`, 'ERROR!')
        }
      )
    },

    updatePwd () {
      let tmpdata = {
        token: this.$store.getters.getUserToken,
        username: this.formForgetpwd.username,
        password: Encrypt(this.formForgetpwd.newpwd),
        CAPTCHA: this.formForgetpwd.CAPTCHA
      }

      myPost(
        'api/user/sign/passwd',
        tmpdata,
        res => {
          if (res.data.status === 1) {
            this.$message.success(`${res.data.msg}`)
            this.forgetVisible = false
          } else {
            this.$message.error(`${res.data.msg}`)
          }
        },
        err => {
          this.$message.error(`${err.message}`, 'ERROR!')
        }
      )
    },

    // 表单重置
    resetForm () {
      this.$refs['formLogin'].resetFields()
      this.$refs['formForgetpwd'].resetFields()
    }
  }
}
</script>

<style scoped lang="stylus">
.main-div {
  height: 100%;
  width: 100%;
  margin: 0%;
  display: flex;
  align-content: center;
  justify-content: center;
  padding: 0%;
  background: url('~@/assets/background16-9-2.jpg');
  background-size: cover;
  background-repeat: none;
  height: 100%;
}

.el-button {
  width: auto;
  height: auto;
}

.box-card {
  align-self: center;
  height: auto;
  width: 30%;
  border: 0px dashed rgb(40, 40, 40);
  background-color: rgba(255, 255, 255, 0.7);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
  transition: box-shadow 0.3s ease-in-out !important;
  transition-duration: 1s;
  &.is-mobile {
  width : 95%;
  }
}

.box-card:hover {
  box-shadow: 0 5px 15px rgba(20, 20, 20, 0.8);
}
</style>
