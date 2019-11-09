import { myGet } from '@/utils/requestFunc.js'
export default {
  data () {
    return {
      currentSchoolId: 0,
      schoolList: [
        {
          id: 0,
          name: '在野',
          disabled: false
        },
        {
          id: localStorage.getItem('school_id'),
          name: '校内',
          disabled: Number(localStorage.getItem('school_id')) === 0
        }
      ],

      currentThemeId: -1,
      themeList: [
        {
          id: 0,
          name: 'BUG!!!',
          release_date: '9999-12-31',
          deadline: '9999-12-31',
          description: 'There is a bug',
          count: 9999
        }
      ]
    }
  },
  methods: {
    GetSchoolListNoPublic () {
      // 真香
      return new Promise(resolve => {
        let tmpData = {
          token: this.$store.getters.getUserToken
        }
        console.log(tmpData)
        myGet(
          '/api/school/school/get_list',
          tmpData,
          res => {
            if (res.data.status === 1) {
            // this.$message.success(`${res.data.msg}`)
              this.schoolList = res.data.data.school_list
              this.currentSchoolId = this.schoolList[0].id
              resolve(true)
            } else {
              this.$message.error(`${res.data.msg}`)
              resolve(false)
            }
          },
          err => {
            this.$message.error(`${err.message}`, 'ERROR!')
            resolve(false)
          }
        )
      }
      )
    },
    GetSchoolList () {
      return new Promise(resolve => {
        let tmpData = {
          token: this.$store.getters.getUserToken
        }
        console.log(tmpData)
        myGet(
          '/api/school/school/get_list',
          tmpData,
          res => {
            if (res.data.status === 1) {
            // this.$message.success(`${res.data.msg}`)
              this.schoolList = res.data.data.school_list
              this.schoolList.unshift(
                {
                  id: 0,
                  name: '公共区域'
                }
              )
              this.currentSchoolId = 0
              console.log(this.schoolList)
              resolve(true)
            } else {
              this.$message.error(`${res.data.msg}`)
              resolve(false)
            }
          },
          err => {
            this.$message.error(`${err.message}`, 'ERROR!')
            resolve(false)
          }
        )
      })
    },

    GetThemeList () {
      return new Promise(resolve => {
        let tmpData = {
          token: this.$store.getters.getUserToken,
          school_id: this.currentSchoolId
        }
        console.log(tmpData)
        myGet(
          '/api/school/theme/list',
          tmpData,
          res => {
            if (res.data.status === 1) {
              // this.$message.success(`${res.data.msg}`)
              this.themeList = res.data.data.theme_list
              console.log(this.themeList)
              resolve(true)
            } else {
              this.$message.error(`${res.data.msg}`)
              resolve(false)
            }
          },
          err => {
            this.$message.error(`${err.message}`, 'ERROR!')
            resolve(false)
          }
        )
      })
    }
  }
}
