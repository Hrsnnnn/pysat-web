<template>
  <el-table
    :data="displayData"
    style="width: 100%"
    height="400"
  >
    <el-table-column prop="judge_time" label="审核时间" width="300"></el-table-column>
    <el-table-column prop="author" label="作者" width="180"></el-table-column>
    <el-table-column prop="name" label="程序名" :resizable="true"></el-table-column>
    <el-table-column prop="status" label="审核状态" width="180" >
      <template slot-scope="scope">
        <el-tag
          :type="calculateTagType(scope.row.status)"
          disable-transitions
        >{{statusDict[scope.row.status]}}</el-tag>
      </template>
    </el-table-column>

    <el-table-column label="下载" width="150" fixed="right">
      <template slot-scope="scope">
        <el-button @click="Download(scope.$index, scope.row)" circle icon="el-icon-download"></el-button>
      </template>
    </el-table-column>

    <el-table-column label="上星" width="150" fixed="right">
      <template slot-scope="scope">
        <el-button @click="Onstar(scope.$index, scope.row)" circle icon="el-icon-upload"></el-button>
      </template>
    </el-table-column>

    <el-table-column label="完成" width="150" fixed="right">
      <template slot-scope="scope">
        <el-button @click="Finish(scope.$index, scope.row)" circle icon="el-icon-success"></el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
import { myPost, myGet } from '@/utils/requestFunc.js'
import { saveAs } from 'file-saver'

export default {
  components: {
  },
  props: [
    'displayData'
  ],
  data () {
    return {
      tableStatus: {
        likeIconOn: false
      },
      statusDict: {
        '-2': '未通过语法审核',
        '-1': '未通过功能审核',
        '0': '等待审核',
        '1': '审核中',
        '2': '通过审核',
        '3': '等待上星',
        '4': '即将上传',
        '5': '执行完毕'
      }
    }
  },
  computed: {
    calculateTagType () {
      return function (status) {
        if (status === 5) {
          return 'success'
        } else if (status >= 2 && status <= 4) {
          return 'warning'
        } else if (status >= 0 && status <= 1) {
          return 'info'
        } else if (status < 0) {
          return 'danger'
        }
      }
    }
  },
  methods: {
    // statusFormatter (row, column) {
    //   return this.statusDict[row.status.toString()]
    // },
    Download (index, row) {
      let tmpdata = {
        token: this.$store.getters.getUserToken,
        code_id: row.id
      }
      console.log(tmpdata)
      myGet(
        '/api/program/admin/download',
        tmpdata,
        res => {
          if (res.data.status === 1) {
            console.log(res.data.data)
            // 这回不需要更新row.status
            // row.status = 1
            // this.$message.success('开始审核！')
            var codeContent = new File([res.data.data.code.content], 'code.py', {type: 'text/plain;charset=utf-8'})
            saveAs(codeContent)
            var codeReadme = new File([res.data.data.code.readme], 'readme.txt', {type: 'text/plain;charset=utf-8'})
            saveAs(codeReadme)
          } else {
            this.$message.error(`${res.data.msg}`)
          }
        },
        err => {
          this.$message.error(`${err.message}`, 'ERROR!')
        }
      )
    },
    Onstar (index, row, approve) {
      // 首先应当下载过（根据row.status判断），否则报错
      // 如果通过，则仍然出现在列表里
      // 如果不通过，则需要删掉
      if (row.status === 4) {
        this.$message.error('已经即将上星了！')
        return
      }

      let tmpData = {
        token: this.$store.getters.getUserToken,
        code_id: row.id,
        source: 3,
        target: 4
      }

      console.log(tmpData)
      myPost(
        '/api/program/admin/status',
        tmpData,
        res => {
          if (res.data.status === 1) {
            console.log(res.data.data)
            // 需要更新row.status
            row.status = 4
          } else {
            this.$message.error(`${res.data.msg}`)
          }
        },
        err => {
          this.$message.error(`${err.message}`, 'ERROR!')
        }
      )
    },
    Finish (index, row) {
      // 首先应当已经审核通过，否则报错
      // 上传成功后，需要从列表里面删掉
      if (row.status < 4) {
        this.$message.error('您应当先点击上传！')
        return
      }
      console.log('Finish')
      console.log(row.name)
      let tmpData = {
        token: this.$store.getters.getUserToken,
        code_id: row.id,
        source: 4,
        target: 5
      }
      console.log(tmpData)
      myPost(
        '/api/program/admin/status',
        tmpData,
        res => {
          if (res.data.status === 1) {
            console.log(res.data.data)
            // 需要更新row.status
            row.status = 5
            this.displayData.splice(index, 1)
            this.$message.success('运行完毕！')
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

</style>
