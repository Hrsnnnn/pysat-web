<template>
  <div class="main-div">
    <el-card class="box-card">
      <center>
        <h2>主题：{{themeInfo.title}}</h2>
      </center>
      <JudgeTable v-bind:displayData="judgeList"></JudgeTable>
      <el-pagination :background="false" layout="prev, pager, next" :page-count="judgePageCnt" :current-page.sync="judgePageIndex" @current-change="GetJudgeList(judgePageIndex)" @prev-click="judgePageIndex --" @next-click="judgePageIndex++"></el-pagination>
    </el-card>
  </div>
</template>

<script>
// import { myGet } from '@/utils/requestFunc.js'
import { checkSession } from '@/utils/sessionUtils/sessionFunc'
import JudgeTable from '@/components/admin/program/JudgeTable.vue'
import { myGet } from '@/utils/requestFunc.js'
import getThemeInfoMixin from '@/utils/functionUtils/getThemeInfoMixin'

export default {
  mixins: [getThemeInfoMixin],

  components: {
    JudgeTable
  },
  beforeCreate () {
    checkSession(this, '', '/')
  },

  mounted: function () {
    this.currentThemeId = this.$route.params.themeid
    this.GetThemeInfo()
    this.GetJudgeList()
  },
  data () {
    return {
      judgePageCnt: 100,
      judgePageIndex: 1,
      judgeList: [
        {
          submit_time: '9999-12-31',
          author: 'bug',
          name: 'bug',
          status: 0,
          id: -1
        }
      ],
      currentThemeId: -1
    }
  },
  methods: {
    // 啊这里的type指的是通过点击不同的tab，获取不同的api得到函数列表
    // 好的，收到
    GetJudgeList (index) {
      let tmpData = {
        token: this.$store.getters.getUserToken,
        mine: false,
        theme_id: this.currentThemeId,
        status_low: -1,
        status_up: 3
      }
      if (index) {
        tmpData['page'] = index
      }
      console.log(tmpData)
      myGet(
        '/api/program/list/get',
        tmpData,
        res => {
          if (res.data.status === 1) {
            console.log(res.data.data)
            this.judgeList = res.data.data.code_list
            this.judgePageCnt = Math.ceil(res.data.data.tot_count / 20)
          } else {
            this.$message.error(`${res.data.msg}`)
          }
        },
        err => {
          this.$message.error(`${err.message}`, 'ERROR!')
        }
      )
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.box-card {
  align-self: center;
  height: 85vh;
  width: 95%;
  border: 0px dashed rgb(40, 40, 40);
  background-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
  transition: box-shadow 0.3s ease-in-out !important;
  transition-duration: 1s;
  margin: 2%;
}
.box-card:hover {
  box-shadow: 0 5px 15px rgba(20, 20, 20, 0.8);
}

.main-div {
  height: 100%;
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
.el-pagination{
  width: 100%;
  padding: 0%;
}
</style>
