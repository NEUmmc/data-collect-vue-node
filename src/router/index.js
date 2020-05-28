import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: resolve => require(['../components/Login.vue'], resolve)
    },
    {
      path: '/main',
      component: resolve => require(['../components/common/Main.vue'], resolve),
      children:[
        {
          path: '/',
          component: resolve => require(['../components/page/Home.vue'], resolve)
        },
        {
          path: '/scoretable',
          component: resolve => require(['../components/page/ScoreTable.vue'], resolve)
        },
        {
          path: '/table',
          component: resolve => require(['../components/page/AnswerTable.vue'], resolve)
        },
        {
          path: '/client',
          component: resolve => require(['../components/page/Client.vue'], resolve)
        },
      ]
    }
  ]
})
