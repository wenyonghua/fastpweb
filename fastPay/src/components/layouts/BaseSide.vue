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
        <span>Create Settlement</span>
      </template>
      <el-menu-item-group>
        <template #title><span>Settlement</span></template>
        <el-menu-item index="/apply-settlement">Create Settlement</el-menu-item>
        <el-menu-item index="/history-settlement">Settlement History</el-menu-item>
      </el-menu-item-group>
    </el-sub-menu>
    <el-menu-item index="/statistical-analysis">
      <el-icon><tickets /></el-icon>
      <template #title>Merchant Order</template>
    </el-menu-item>
    <el-menu-item index="/bank-management">
      <el-icon><postcard /></el-icon>
      <template #title>Bank Management</template>
    </el-menu-item>
    <el-menu-item index="'/merchant-paylist">
      <el-icon><wallet /></el-icon>
      <template #title>Transaction History</template>
    </el-menu-item>
    <el-menu-item index="'/">
      <el-icon><setting /></el-icon>
      <template #title>Setting</template>
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
  Setting
} from '@element-plus/icons-vue'

const isCollapse = ref(true)
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

