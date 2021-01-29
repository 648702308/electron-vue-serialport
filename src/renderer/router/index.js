import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/landing',
      name: 'landing-page',
      component: require('@/components/LandingPage').default
    },
    {
      path: '/',
      name: 'Serialport',
      component: require('@/views/serialport').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
