import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return {x: 0, y: 0}
        }
    },
    routes: [
        {
            path: '*',
            redirect: '/'
        },
        {
            path: '/',
            name: 'home',
            component: () => import('@/views/HomePage.vue'),
        },
        {
            path: '/remote',
            name: 'remote',
            component: () => import('@/views/RemotePage.vue'),
        },
        {
            path: '/local',
            name: 'local',
            component: () => import('@/views/LocalPage.vue'),
        }
    ]
})

export default router
