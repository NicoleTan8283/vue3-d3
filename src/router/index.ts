import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
// const constantFiles = require.context('./constantModules', true, /\.ts$/)
// let constantModules: Array<RouteRecordRaw> = []
// constantFiles.keys().forEach((key: string) => {
//   if (key === './index.ts') return
//   constantModules = constantModules.concat(constantFiles(key).default)
// })

// const asyncFiles = require.context('./permissionModules', true, /\.ts$/)
// let permissionModules: Array<RouteRecordRaw> = []
// asyncFiles.keys().forEach((key: string) => {
//   if (key === './index.ts') return
//   permissionModules = permissionModules.concat(asyncFiles(key).default)
// })

const constantRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: 'tools'
  },
  {
    path: '/vto',
    meta: {
      name: 'vto'
    },
    component: () => import(/* webpackChunkName: "redirect" */ '@/views/vto/index.vue')
  },
  {
    path: '/tools',
    meta: {
      name: 'tools'
    },
    component: () => import(/* webpackChunkName: "redirect" */ '@/views/tools/index.vue')
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes
})
export default router;