<template>
  <el-table
    :data="displayData"
    style="width: 100%"
    :default-sort="{prop: 'submit_time', order: 'descending'}"
    :height="tableHeight"
  >

    <el-table-column prop="name" label="教程名" width="200" fixed="left"></el-table-column>
    <el-table-column prop="description" label="简介" width="200"></el-table-column>
    <el-table-column prop="uploader" label="上传人" width="200"></el-table-column>
    <el-table-column prop="size" label="大小" width="200"></el-table-column>
    <el-table-column prop="upload_time" label="上传时间" width="200"></el-table-column>

        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button icon="el-icon-delete"
              v-if="isPrivateAdmin || isPublicAdmin" size="small"
              @click="MakeDeleteDialogVisible(scope.$index, scope.row)"></el-button>
            <el-button icon="el-icon-video-play" size="small" @click="PlayVideo(scope.$index, scope.row)"></el-button>
          </template>
            <el-dialog
              title="提示"
              :visible.sync="deleteDialogVisible"
              width="30%"
              :append-to-body="true"
            >
              <span>确定要删除该教程吗？</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="deleteDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="DeleteCourse(selectIndex, selectRow);deleteDialogVisible=false">确 定</el-button>
              </span>
            </el-dialog>
        </el-table-column>
  </el-table>
</template>
<script>
import permissionComputer from '@/utils/functionUtils/permissionComputer'
import { myPost } from '@/utils/requestFunc.js'

export default {
  mixins: [permissionComputer],
  props: [
    'displayData'
  ],
  data () {
    return {
      tableStatus: {
        likeIconOn: false
      },
      deleteDialogVisible: false,
      selectRow: null,
      selectIndex: -1
    }
  },
  computed: {
    tableHeight () {
      return document.documentElement.clientHeight * 0.8
    }
  },
  methods: {
    MakeDeleteDialogVisible (index, row) {
      console.log(index)
      console.log(row)
      this.selectIndex = index
      this.selectRow = row
      this.deleteDialogVisible = true
    },
    DeleteCourse (index, row) {
      let tmpData = {
        token: this.$store.getters.getUserToken,
        video_id: row.id
      }
      console.log(tmpData)
      myPost(
        '/api/file/video/delete',
        tmpData,
        res => {
          if (res.data.status === 1) {
            console.log(res.data.data)
            this.$message.success('删除成功！')
            this.displayData.splice(index, 1)
          } else {
            this.$message.error(`${res.data.msg}`)
          }
        },
        err => {
          this.$message.error(`${err.message}`)
        }
      )
    },
    PlayVideo (index, row) {
      localStorage.setItem('video_id', row.id)
      this.$router.push(
        {
          name: 'videoplay',
          params: {
            token: this.$store.getters.getUserToken,
            video_id: row.id
          }
        }
      )
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.active{
    height: 50vh;
}
</style>
