import store from '@/store'

const { body } = document
const WIDTH = 992 // refer to Bootstrap's responsive design

// GUXY is 1600

export default {
  watch: {
    $route () {
      if (this.$store.state.device === 'mobile' && this.$store.state.sidebar.opened) {
        store.dispatch('CloseSideBar')
      }
    }
  },
  beforeMount () {
    window.addEventListener('resize', this.resizeHandler)
  },
  mounted () {
    const isMobile = this.isMobile()

    if (isMobile) {
      store.dispatch('ToggleDevice', 'mobile')
      store.dispatch('CloseSideBar')
    }
  },
  methods: {
    isMobile () {
      const rect = body.getBoundingClientRect()
      store.dispatch('SetWindowHeight', rect.height)
      return rect.width - 1 < WIDTH
    },
    resizeHandler () {
      if (!document.hidden) {
        const isMobile = this.isMobile()
        store.dispatch('ToggleDevice', isMobile ? 'mobile' : 'desktop')

        if (isMobile) {
          store.dispatch('CloseSideBar')
        }
      }
    }
  }
}
