<template>
    <div class="page">
        <div id="filePicker">选择文件</div>
          <el-select v-model="currentSchoolId" placeholder="学校">
            <el-option
              v-for="item in schoolList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
        <div class="file-panel">
            <h2>文件列表</h2>
            <div class="file-list">
                <ul class="file-item" :class="`file-${file.id}`" v-for="file in fileList" :key="file">
                    <li class="file-type" :icon="fileCategory(file.ext)"></li>
                    <li class="file-name" >{{file.name}}</li>
                    <li class="file-size">{{fileSize(file.size)}}</li>
                    <li class="file-status">上传中...</li>
                    <li class="file-operate">
                        <el-button icon="el-icon-video-play" @click="resume(file)"></el-button>
                        <el-button icon="el-icon-video-pause" @click="stop(file)"></el-button>
                        <el-button icon="el-icon-remove" @click="remove(file)"></el-button>
                    </li>
                    <li class="progress"></li>
                </ul>
                <div class="no-file" v-if="!fileList.length"><i class="iconfont icon-empty-file"></i> 暂无待上传文件</div>
            </div>
        </div>

        <vue-upload
                ref="uploader"
                uploadButton="#filePicker"
                multiple
                :fileList="fileList"
                :school_id="currentSchoolId"
                :description="videoDescription"
                :title="videoTitle"
                @uploadProgress="uploadProgress"
                @ClearText="ClearText"
        ></vue-upload>
        <el-col :span="3">
          <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4}"
          placeholder="请输入教程名，呵呵"
          v-model="videoTitle"
          maxlength="10"
          show-word-limit>
          </el-input>
        </el-col>
        <el-col :span="20">
          <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4}"
          placeholder="请输入视频简介，呵呵"
          v-model="videoDescription"
          maxlength="30"
          show-word-limit>
          </el-input>
        </el-col>
    </div>
</template>

<script>
import vueUpload from '@/components/course/upload/uploader'
import WebUploader from 'webuploader'
import $ from 'jquery'
import getSchoolAndThemeMixin from '@/utils/functionUtils/getThemeAndSchoolListMixin'
import { checkSession } from '@/utils/sessionUtils/sessionFunc'

export default {
  mixins: [getSchoolAndThemeMixin],
  beforeCreate () {
    checkSession(this, '', '/')
  },
  data () {
    return {
      fileList: [],
      keys: [],
      videoDescription: '',
      videoTitle: ''
    }
  },
  mounted () {
    if (localStorage.getItem('permission_public') >= 8) {
      this.GetSchoolList()
    } else {
      if (localStorage.getItem('permission_public') < 2) {
        console.log('呃？？？')
        this.schoolList[0].disabled = true
        this.currentSchoolId = this.schoolList[1].id // 在野权限不够，版块切换至校内
      }
      if (localStorage.getItem('permission_private') < 2) {
        this.schoolList[1].disabled = true
      }
    }
  },
  computed: {
    uploader () {
      return this.$refs.uploader
    }
  },
  methods: {
    ClearText () {
      this.videoTitle = ''
      this.videoDescription = ''
    },

    uploadProgress (file, percent) {
      $(`.file-${file.id} .progress`).css('width', percent * 100 + '%')
      $(`.file-${file.id} .file-status`).html((percent * 100).toFixed(2) + '%')
    },

    resume (file) {
      this.uploader.upload(file)
    },
    stop (file) {
      this.uploader.stop(file)
    },
    remove (file) {
      // 取消并中断文件上传
      this.uploader.cancelFile(file)
      // 在队列中移除文件
      this.uploader.removeFile(file, true)

      // 在ui上移除
      let index = this.fileList.findIndex(ele => ele.id === file.id)
      this.fileList.splice(index, 1)
    },

    fileSize (size) {
      return WebUploader.Base.formatSize(size)
    },
    fileCategory (ext) {
      let type = ''

      const typeMap = {
        image: ['gif', 'jpg', 'jpeg', 'png', 'bmp', 'webp'],
        video: ['mp4', 'm3u8', 'rmvb', 'avi', 'swf', '3gp', 'mkv', 'flv'],
        text: ['doc', 'txt', 'docx', 'pages', 'epub', 'pdf', 'numbers', 'csv', 'xls', 'xlsx', 'keynote', 'ppt', 'pptx']
      }

      Object.keys(typeMap).forEach((_type) => {
        const extensions = typeMap[_type]
        if (extensions.indexOf(ext) > -1) {
          type = _type
        }
      })

      return type
    }
  },
  watch: {},
  components: {
    vueUpload
  }
}
</script>

<style lang="scss">

    $h-row: 50px;

    .file-panel {
        width: 1300px;
        margin-top: 10px;
        box-shadow: 0 2px 12px 1px rgba(0, 0, 0, 0.1);

        > h2 {
            height: 40px;
            line-height: 40px;
            padding: 0 10px;
            border-radius: 4px 4px 0 0;
            border-bottom: 1px solid #ccc;
            background-color: #fff;
        }

        .file-list {
            position: relative;
            height: 360px;
            overflow-y: auto;
            background-color: rgb(250, 250, 250);
        }

        .file-item {
            position: relative;
            height: $h-row -1;
            line-height: $h-row;
            width: 1500px;
            padding: 0 10px;
            border-bottom: 1px solid #ccc;
            background-color: #fff;
            z-index: 1;

            > li {
                display: inline-block;
            }
        }
        .file-type {
            width: 24px;
            height: 24px;
            vertical-align: -5px;
        }
        .file-name {
            width: 20%;
            margin-left: 10px;
        }
        .file-size {
            width: 20%;
        }
        .file-status {
            width: 20%;
        }
        .file-operate {
            width: 20%;

            > a {
                padding: 10px 5px;
                cursor: pointer;
                color: #666;

                &:hover {
                    color: #ff4081;
                }
            }
        }

        .file-type[icon=text] {
            background: url(~@/assets/icon/text-icon.png);
        }
        .file-type[icon=video] {
            background: url(~@/assets/icon/video-icon.png);
        }
        .file-type[icon=image] {
            background: url(~@/assets/icon/image-icon.png);
        }

        .progress {
            position: absolute;
            top: 0;
            left: 0;
            height: $h-row - 1;
            width: 0;
            background-color: #E2EDFE;
            z-index: -1;
        }

        .no-file {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 16px;
        }
    }
</style>
