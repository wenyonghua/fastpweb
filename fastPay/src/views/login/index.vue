<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElMessage } from 'element-plus'
import { Avatar as avatar, Lock as lock} from '@element-plus/icons-vue' 
import { login } from '~/api/api';
import { useRouter, useRoute } from 'vue-router'
import { useStore } from '~/store/store';

const store = useStore()

const router = useRouter();
const route = useRoute();

const capsTooltip = ref(false);
const loading = ref(false);

const showDialog = ref(false)

const loginInfo = reactive({
  username: 'AG005',
  password: '19880806'
})

const getList = () => {

}

const showPwd = () => {
    // todo
}

const handleLogin = () => {
  login(loginInfo).then(res => {
    store.action.updateUser(JSON.parse(res.data.msg));
    let hostName = route.query.redirect;  // 获取域名
    if (hostName === location.hostname) {   // 判断如果域名是你项目域名，说明是从本网站内部跳转过来的，
          router.go(-1);   // 登录成功后，返回上次进入的页面；
    } else {
       router.replace({path: '/'});
    }
  })
}
</script>

<template>
  <div class="login-container">
    <el-form ref="loginForm" class="login-form" autocomplete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">{{$t('header_menu.login') }}</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <el-icon><avatar /></el-icon>
        </span>
        <el-input
          ref="username"
          v-model="loginInfo.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <el-icon><lock /></el-icon>
          </span>
          <el-input
            ref="password"
            type="password"
            v-model="loginInfo.password"
            placeholder="Password"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.enter="handleLogin"
          />
          <!-- <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span> -->
        </el-form-item>
      </el-tooltip>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.prevent="handleLogin">Login</el-button>
    </el-form>

    <!-- <el-dialog title="Or connect with" :visible="showDialog">
      Can not be simulated on local, so please combine you own business simulation! ! !
      <br>
      <br>
      <br>
    </el-dialog> -->
  </div>
</template>

<style lang="scss">
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;
.wrapper {
  width: 100%;
  padding: 0;
}

.login-container {
  min-height: 100%;
  width: 100%;
  position: absolute;
  background-color: $bg;
  overflow: hidden;

  .el-form-item {
    border: 1px solid hsla(0,0%,100%,.1);
    background: rgba(0,0,0,.1);
    border-radius: 5px;
    color: #454545;
  }

  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    &>.el-input__inner {
      background: transparent;
      border: 0;
      border-radius: 0;
      padding: 12px 5px 12px 15px;
      color: #fff;
      height: 47px;
      caret-color: #fff;
      box-shadow: none;
      }
  }

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    display: flex;
    justify-content: center;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
