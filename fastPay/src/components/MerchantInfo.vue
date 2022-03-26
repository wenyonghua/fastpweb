<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElMessage } from 'element-plus'
import { getMerchantInfo } from '~/api/api';
import { useStore } from '~/store/store';

// defineProps<{ msg: string }>();

const store = useStore();

interface Info {
  userName: string,
  merchantNum: string,
  merchantName: string,
  secretKey: string,
  createTime: string,
  latelyLoginTime: string
}

interface PassWord {
  oldPassword: string,
  newPassword: string,
  confirmed: string
}

const loading = ref(false);
const dialogVisible = ref(false);
const submitForm = reactive(<PassWord>{});

let info = reactive({
  data: <Info>{}
});

const init = () => {
  loading.value = true;
  getMerchantInfo().then(res => {
     info.data  = res.data.data;
     store.action.updateMerchantInfo(res.data.data);
     loading.value = false;
  })
}

const handleClose = () => {
  
}

const toast = () => {
  ElMessage.success('Hello')
}

init();
</script>

<template>
    <div class="wrapper-box">
      <el-card class="box-card" v-loading="loading">
        <template #header>
          <div class="card-header">
            <span>Merchant Information</span>
            <div>
              <el-button class="button" type="text" @click="dialogVisible = true">Change Password</el-button>
              <el-button class="button" type="text">Change Payment Password</el-button>
            </div>
          </div>
        </template>
        <div>
          <p><span class="label">UserName:</span><span class="text">{{info.data?.userName}}</span></p>
          <p><span class="label">Merchant No:</span><span class="text">{{info.data?.merchantNum}}</span></p>
          <p><span class="label">Merchant Name:</span><span class="text">{{info.data?.merchantName}}</span></p>
          <p><span class="label">Secret Key:</span><span class="text">{{info.data?.secretKey}}</span></p>
          <p><span class="label">Submit Time:</span><span class="text">{{info.data?.createTime}}</span></p>
          <p><span class="label">Last Login Time:</span><span class="text">{{info.data?.latelyLoginTime}}</span></p>
        </div>
    </el-card>
    <el-dialog
    v-model="dialogVisible"
    title="Change Login Password"
    width="40%"
    :before-close="handleClose"
  >
      <el-form :inline="false" :model="submitForm" class="demo-form-inline">
        <el-form-item :label="$t('account.old_password')">
          <el-input v-model="submitForm.oldPassword" :placeholder="$t('search_bar.placeholder')" />
        </el-form-item>
        <el-form-item :label="$t('account.new_password')">
          <el-input v-model="submitForm.newPassword" :placeholder="$t('search_bar.placeholder')" />
        </el-form-item>
        <el-form-item :label="$t('account.confirmed')">
          <el-input v-model="submitForm.confirmed" :placeholder="$t('search_bar.placeholder')" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="dialogVisible = false"
            >Confirm</el-button
          >
        </span>
      </template>
    </el-dialog>
    </div>
</template>

<style scoped>
.wrapper-box {
  padding: 10px;
}
.el-form-item {
  display: block;
}
.el-button {
  margin: 4px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.label {
  display: inline-block;
  width: 180px;
  text-align: right;
  margin-right: 20px;
}
</style>
