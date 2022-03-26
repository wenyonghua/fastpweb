<script lang="ts" setup>
import { Avatar } from '@element-plus/icons-vue'
import { useStore } from '~/store/store';
import { useRouter } from 'vue-router';

const props = defineProps<{ switchLang: any, logout: any, userName: string }>();

const router = useRouter();

const goto = (url: string) => {
  router.replace({path: url})
}

</script>
<template>
  <div class="header">
    <div class="left-box">
      <div class="logo">
        <a class="goto" @click="goto('/')"><img width="60" height="60" src="../../assets/logo.png"></a>
      </div>
    </div>
    <el-menu class="el-menu-demo" mode="horizontal">
      <!-- <el-menu-item index="/">Merchant</el-menu-item> -->
      <el-sub-menu index="2">
        <template #title>{{$t("header_menu.language")}}</template>
        <el-menu-item index="2-1" @click="props.switchLang('ch')">中文</el-menu-item>
        <el-menu-item index="2-2" @click="props.switchLang('en')">English</el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="3">
        <template #title>{{props.userName}}</template>
        <el-menu-item index="3-1" @click="props.logout()">{{$t("header_menu.logout")}}</el-menu-item>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<style lang="scss" scoped>
.goto {
  cursor: pointer;
}
.header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  border-bottom: solid 1px #dcdfe6;
}
.left-box {
  width: calc(100% - 100px);
}
.logo {
  display: flex;
  align-items: center;
  a {
    display: inline-block;
    img {
      vertical-align: middle;
    }
  }
}
.el-menu--horizontal {
  border-bottom: none;
}
.el-menu {
  width: 330px;
  // margin-right: -100px;
}
.tool {
  float: right;
}
</style>
