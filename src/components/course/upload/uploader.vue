<template>
    <div class="upload">
    </div>
</template>

<script>
import WebUploader from 'webuploader'
import { myPost } from '@/utils/requestFunc.js'

export default {
  name: 'vue-upload',
  props: {
    fileList: {
      type: Array,
      default: null
    },
    description: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    school_id: {
      type: Number,
      default: 0
    },
    accept: {
      type: String,
      default: 'video'
    },
    // 上传地址
    url: {
      type: String,
      default: '/api/file/video/chunk' // hard-code...
    },
    // 上传最大数量 默认为100
    fileNumLimit: {
      type: Number,
      default: 100
    },
    // 单个文件大小限制 默认1G
    fileSingleSizeLimit: {
      type: Number,
      default: 1 * 1024 * 1024 * 1024
    },
    // 上传时传给后端的参数，一般为token，key等
    formData: {
      key: Object,
      default: null
    },
    // 生成formData中文件的key，下面只是个例子，具体哪种形式和后端商议

    multiple: {
      type: Boolean,
      default: false
    },
    // 上传按钮ID
    uploadButton: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      uploader: null,
      keys: []
    }
  },
  mounted () {
    this.initWebUpload()
  },
  methods: {
    FindKey (file) {
      let index = this.fileList.findIndex(ele => ele.id === file.id)
      return this.keys[index]
    },
    initWebUpload () {
      this.uploader = WebUploader.create({
        auto: false, // 选完文件后，是否自动上传
        swf: '/static/lib/webuploader/Uploader.swf', // swf文件路径 //这玩意儿有啥用？？？啊♂？
        server: this.url, // 文件接收服务端
        pick: {
          id: this.uploadButton, // 选择文件的按钮
          multiple: this.multiple, // 是否多文件上传 默认false
          label: ''
        },
        accept: this.getAccept(this.accept), // 允许选择文件格式。
        threads: 3,
        fileNumLimit: this.fileNumLimit, // 限制上传个数
        // fileSingleSizeLimit: this.fileSingleSizeLimit, // 限制单个上传图片的大小
        formData: this.formData, // 上传所需参数  // 这玩意儿咋没用啊，妈的
        chunked: true, // 分片上传
        chunkSize: 512 * 1024, // 分片大小
        duplicate: true // 重复上传
      })

      // 当有文件被添加进队列的时候，添加到页面预览
      this.uploader.on('fileQueued', (file) => {
        console.log('fileQueued')
        if (!file.size) return
        this.fileList.push(file)
        this.keys.push(this.keyGenerator())
        console.log(file)
        console.log(this.keys)
      })

      this.uploader.on('uploadStart', (file) => {
        console.log('uploadStart')
        // 在这里可以准备好formData的数据
        let tmpData = {
          token: this.$store.getters.getUserToken,
          school_id: this.school_id,
          category_id: 0,
          filename: file.name,
          video_title: this.title,
          description: this.description,
          key: this.FindKey(file)
        }
        myPost(
          '/api/file/video/start',
          tmpData,
          res => {
            if (res.data.status === 1) {
              console.log(res.data)
            } else {
              this.$message.error(`${res.data.msg}`)
            }
          },
          err => {
            this.$message.error(`${err.message}`, 'ERROR!')
          }
        )
      })

      this.uploader.on('uploadBeforeSend', (object, data, headers) => {
        console.log('uploadBeforeSend')
        data.token = this.$store.getters.getUserToken
        data.key = this.FindKey(data)
        console.log(object)
        console.log(data)
        console.log(headers)
      })

      // 文件上传过程中创建进度条实时显示。
      this.uploader.on('uploadProgress', (file, percentage) => {
        this.$emit('uploadProgress', file, percentage)
      })

      this.uploader.on('uploadSuccess', (file, response) => {
        let tmpData = {
          token: this.$store.getters.getUserToken,
          key: this.FindKey(file)
        }
        myPost(
          '/api/file/video/done',
          tmpData,
          res => {
            if (res.data.status === 1) {
              this.title = ''
              this.description = ''
              this.$emit('ClearText')
              this.$message.success(`${file.name}: ${response}`)
              console.log(this.fileList)
            } else {
              console.log(res.data)
              this.$message.error(`${res.data.msg}`)
            }
          },
          err => {
            this.$message.error(`${err.message}`, 'ERROR!')
          }
        )
      })

      this.uploader.on('uploadError', (file, reason) => {
        this.$message.error(`${file.name}: ${reason}`)
      })

      this.uploader.on('error', (type) => {
        let errorMessage = ''
        if (type === 'F_EXCEED_SIZE') {
          errorMessage = `文件大小不能超过${this.fileSingleSizeLimit / (1024 * 1000)}M`
        } else if (type === 'Q_EXCEED_NUM_LIMIT') {
          errorMessage = '文件上传已达到最大上限数'
        } else {
          errorMessage = `上传出错！请检查后重新上传！错误代码${type}`
        }
        console.error(errorMessage)
        this.$message.error(`${errorMessage}`)
      })
    },

    upload (file) {
      this.uploader.upload(file)
    },
    stop (file) {
      this.uploader.stop(file)
    },
    // 取消并中断文件上传
    cancelFile (file) {
      this.uploader.cancelFile(file)
    },
    // 在队列中移除文件
    removeFile (file, bool) {
      let index = this.fileList.findIndex(ele => ele.id === file.id)
      this.keys.splice(index, 1)
      this.uploader.removeFile(file, bool)
    },

    getAccept (accept) {
      switch (accept) {
        case 'text':
          return {
            title: 'Texts',
            exteensions: 'doc,docx,xls,xlsx,ppt,pptx,pdf,txt',
            mimeTypes: '.doc,docx,.xls,.xlsx,.ppt,.pptx,.pdf,.txt'
          }
        case 'video':
          return {
            title: 'Videos',
            exteensions: 'mp4,m3u8,rmvb,avi,swf,3gp,mkv,flv',
            mimeTypes: '.mp4,.m3u8,.rmvb,.avi,.swf,.3gp,.mkv,.flv'
          }
        case 'image':
          return {
            title: 'Images',
            exteensions: 'gif,jpg,jpeg,bmp,png',
            mimeTypes: '.gif,.jpg,.jpeg,.bmp,.png'
          }
        default: return accept
      }
    },
    randomString (len) {
      var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
      var maxPos = $chars.length
      var pwd = ''
      for (var i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
      }
      return pwd
    },
    keyGenerator () {
      const currentTime = new Date().getTime()
      const key = `${currentTime}` + this.randomString(12)
      return key
    }

  }
}
</script>

<style lang="scss">
    .webuploader-container {
        position: relative;
    }
    .webuploader-element-invisible {
        position: absolute !important;
        clip: rect(1px 1px 1px 1px); /* IE6, IE7 */
        clip: rect(1px,1px,1px,1px);
    }
    .webuploader-pick {
        position: relative;
        display: inline-block;
        cursor: pointer;
        background: #00b7ee;
        padding: 10px 15px;
        color: #fff;
        text-align: center;
        border-radius: 3px;
        overflow: hidden;
    }
    .webuploader-pick-hover {
        background: #00a2d4;
    }

    .webuploader-pick-disable {
        opacity: 0.6;
        pointer-events:none;
    }

</style>
