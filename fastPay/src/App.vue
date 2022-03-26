<template>
  <BaseHeader :switchLang="switchLang" v-if="!route.meta.hidden" :logout="onLogout" :userName="username"/>
  <div style="display: flex">
    <BaseSide v-if="!route.meta.hidden" />
    <el-config-provider :locale="locale">
      <div class="wrapper">
        <!-- <img alt="Vue logo" class="element-plus-logo" src="./assets/logo.png" /> -->
        <router-view></router-view>
      </div>
    </el-config-provider>
  </div>
</template>

<script>
  import { defineComponent, getCurrentInstance, ref } from 'vue'
  import { ElConfigProvider } from 'element-plus'

  import { useRoute, useRouter } from 'vue-router'

  import { useI18n } from 'vue-i18n'

  import { useStore } from './store/store';

  import zhCn from 'element-plus/lib/locale/lang/zh-cn'

  import en from 'element-plus/lib/locale/lang/en'

  import { logout } from '~/api/api';

  export default defineComponent({
    components: {
      ElConfigProvider
    },
    setup() {
      const store = useStore();
      const route = useRoute();
      const router = useRouter();
      const { ctx } = getCurrentInstance();
      const locale = ref(store.state.lang == 'en' ? en : zhCn);
      const username = store.state.user.username
      const switchLang = (lang) => {
          ctx.$i18n.locale=lang;
          store.action.updateLang(lang);
          locale.value = lang == 'en' ? en : zhCn;
        }
      const onLogout = () => {
        logout().then(res => {
            router.replace({
              path: '/login'
            })
        });
      }
      return {
        username,
        onLogout,
        switchLang,
        store,
        locale,
        route
      }
    },
  })
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
}
.element-plus-logo {
  width: 50%;
}
.wrapper{
    width: calc(100% - 64px);
    min-height: 650px;
}
</style>
