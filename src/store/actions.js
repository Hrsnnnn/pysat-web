import * as types from './mutation-types'

const actions = {
  // actions中的函数接受一个与store实例有相同属性和方法的context对像
  // 因此可以调用context中包含的state,getters以及mutations中定义的方法
  // setToken(context){
  //   context.commit(types.LOGIN);
  // }
  // 在.vue文件中通过store.dispatch('setToken') 即可触发状态改变了
  // 这里的data是因为提交mutations时需要获取从/api/login传回的user对象

  // setUser canbe found in login.vue
  setUser (context, identity) {
    context.commit(types.SETUSER, identity)
  },

  setToken (context, data) {
    context.commit(types.LOGIN, data)
  }, // 啊这里两种写法都对
  delUserSession ({
    commit
  }) {
    commit(types.DELSESSION)
  },
  userLogOut ({
    commit
  }) {
    commit(types.LOGOUT)
  },
  checkSession ({
    commit
  }, data) {
    commit(types.CHECKSESSION, data)
  },

  // Used in responsive-view
  SetWindowHeight ({commit}) {
    commit(types.SET_WINDOW_HEIGHT)
  },
  ToggleSideBar ({ commit }) {
    commit(types.TOGGLE_SIDEBAR)
  },
  CloseSideBar ({ commit }) {
    commit(types.CLOSE_SIDEBAR)
  },
  ToggleDevice ({ commit }, device) {
    commit(types.TOGGLE_DEVICE, device)
  },

  // Used in chat system
  initData ({ commit }, data) {
    commit(types.INIT_DATA, data)
  },

  setCurrentSessionData ({commit}, data) {
    commit(types.SET_CURRENT_SESSION_DATA, data)
  },
  changeCurrentSessionId ({ commit }, id) {
    commit(types.CHANGE_CURRENT_SESSION_ID, id)
  },
  setUnreadToZero ({commit}) {
    commit(types.SET_UNREAD_TO_ZERO)
  }
}

export default actions
