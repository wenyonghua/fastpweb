import { createRouter, createWebHistory } from 'vue-router'

import MerchantInfo from '../components/MerchantInfo.vue'
import statisticalAnalysis from '../views/statistical-analysis/index.vue'
import login from '../views/login/index.vue';

import createSettlement from '../views/settlement/create.vue';
import historySettlement from '../views/settlement/history.vue';

import bankManagement from '../views/bank/management.vue';

import merchantPaylist from '../views/bank/history.vue';

const routerHistory = createWebHistory()
// createWebHashHistory hash 路由
// createWebHistory history 路由
// createMemoryHistory 带缓存 history 路由
const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: '/',
      component: MerchantInfo
    },
    {
      path: '/statistical-analysis',
      component: statisticalAnalysis
    },
    {
        path: '/login',
        component: login,
        meta: {
          hidden: true
        },
    },
    {
      path: '/apply-settlement',
      component: createSettlement
    },
    {
      path: '/history-settlement',
      component: historySettlement
    },
    {
      path: '/bank-management',
      component: bankManagement
    },
    {
      path: '/merchant-paylist',
      component: merchantPaylist
    }
  ]
})
 
export default router