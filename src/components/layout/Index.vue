<template>
  <el-container>
    <el-header>
      <Header></Header>
    </el-header>
    <el-container>
        <Siderbar></Siderbar>
      <el-container>
        <el-main class="my-main-view">
          <!-- <Breadcrumb></Breadcrumb> -->
          <transition :name="transitionName">
   <!--         <router-view  :key="$route.fullPath"></router-view>   -->
            <router-view v-if="isReloadAlive"></router-view>
          </transition>
        </el-main>
        <el-footer>
          <Footer></Footer>
        </el-footer>
      </el-container>
    </el-container>
    <!-- <Scrolltotop></Scrolltotop> -->
  </el-container>
</template>

<script>
import Header from '@/components/essentials/header/Header'
import Breadcrumb from '@/components/essentials/breadcrumb/Breadcrumb'
import Footer from '@/components/essentials/footer/Footer'
import Siderbar from '@/components/essentials/sidebar/Sidebar'
// import Scrolltotop from '@/components/essentials/scrolltotop/Scrolltotop'
import ResizeMixin from '@/utils/resolutionUtils/resizeHandler'
export default {
  name: 'Index',
  mixins: [ResizeMixin],
  provide () {
    return {
      reload: this.reload
    }
  },

  data () {
    return {
      transitionName: 'slide-right',
      isReloadAlive: true
    }
  },
  components: {
    Header,
    Breadcrumb,
    Footer,
    Siderbar
  },
  computed: {
  },
  created () {
  },
  methods: {
    reload () {
      this.isReloadAlive = false
      this.$nextTick(function () {
        this.isReloadAlive = true
      })
    }
  }

}
</script>

<style scoped lang="stylus">
  @media (max-width: 920px)
    .el-main
      padding 0

  .el-header, .el-footer {
    color: #333;
    height: 50px !important;
    padding: 0;
    z-index : 200;
  }
  // .el-footer
  //   position absolute
  //   top 100vh
  //   margin 0
  //   left -5vw
  //   width 100vw
  .el-footer
    box-shadow 10px 10px 10px rgba(0, 0, 0, 0.15)

  .el-main {
    overflow: hidden
    height :100%;
    color: #333;
    padding: 0;
  }

  body > .el-container {
    margin-bottom: 40px;
  }
</style>
