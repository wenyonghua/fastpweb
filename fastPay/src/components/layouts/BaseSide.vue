<template>
  <el-menu
    default-active="2"
    class="el-menu-vertical-demo"
    router
    :collapse="isCollapse"
    @open="handleOpen"
    @close="handleClose"
  >
    <el-sub-menu index="1">
      <template #title>
        <el-icon><notebook /></el-icon>
        <span>{{$t('side_bar.create_settlement')}}</span>
      </template>
      <el-menu-item-group>
        <template #title><span>{{$t('side_bar.settlement')}}</span></template>
        <el-menu-item index="/apply-settlement">{{$t('side_bar.create_settlement')}}</el-menu-item>
        <el-menu-item index="/history-settlement">{{$t('side_bar.settlement_history')}}</el-menu-item>
      </el-menu-item-group>
    </el-sub-menu>
    <el-menu-item index="/statistical-analysis">
      <el-icon><tickets /></el-icon>
      <template #title>{{$t('side_bar.merchant_order')}}</template>
    </el-menu-item>
    <el-menu-item index="/bank-management">
      <el-icon><postcard /></el-icon>
      <template #title>{{$t('side_bar.bank_management')}}</template>
    </el-menu-item>
    <el-menu-item index="'/paylist">
      <el-icon><wallet /></el-icon>
      <template #title>{{$t('side_bar.transaction_history')}}</template>
    </el-menu-item>
    <el-menu-item index="'/payoutmerchant-order">
      <el-icon><creditCard /></el-icon>
      <template #title>{{$t('side_bar.payoutmerchant_order')}}</template>
    </el-menu-item>
    <el-menu-item index="'/">
      <el-icon><setting /></el-icon>
      <template #title>{{$t('side_bar.merchant_info')}}</template>
    </el-menu-item>
  </el-menu>
</template>

<style scoped>
</style>

<script lang="ts" setup>
import { ref } from 'vue'
import {
  Notebook,
  Postcard,
  Tickets,
  Wallet,
  Setting,
  CreditCard
} from '@element-plus/icons-vue'

const isCollapse = ref(true)
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

