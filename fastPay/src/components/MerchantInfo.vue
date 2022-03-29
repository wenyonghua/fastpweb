<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElMessage } from 'element-plus'
import { getMerchantInfo, modifyLoginPwd, modifyMoneyPwd } from '~/api/api';
import { useStore } from '~/store/store';

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
const dialogVisiblePayment = ref(false);
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

const onSubmitLoginPwd = () => {
  if (submitForm.newPassword === submitForm.confirmed) {
    modifyLoginPwd({
      oldLoginPwd: submitForm.oldPassword,
      newLoginPwd: submitForm.newPassword
    }).then(res => {
      if (res.data.success) {
        submitForm.newPassword = '';
        submitForm.oldPassword = '';
        submitForm.confirmed = '';
        ElMessage.success(res.data.msg);
        dialogVisible.value = false;
      } else {
        ElMessage.error(res.data.msg);
      }
    })
  } else {
    ElMessage.error('Not same password confirm!')
  }
}

const onSubmitPaymentPwd = () => {
  if (submitForm.newPassword === submitForm.confirmed) {
    modifyMoneyPwd({
      oldMoneyPwd: submitForm.oldPassword,
      newMoneyPwd: submitForm.newPassword
    }).then(res => {
      if (res.data.success) {
        submitForm.newPassword = '';
        submitForm.oldPassword = '';
        submitForm.confirmed = '';
        ElMessage.success(res.data.msg);
        dialogVisiblePayment.value = false;
      } else {
        ElMessage.error(res.data.msg);
      }
    })
  } else {
    ElMessage.error('Not same password confirm!')
  }
}

init();
</script>

<template>
    <div class="wrapper-box">
      <el-card class="box-card" v-loading="loading">
        <template #header>
          <div class="card-header">
            <span>{{$t('basic_text.merchant_information')}}</span>
            <div>
              <el-button class="button" type="text" @click="dialogVisible = true">{{$t('account.change_login_pwd')}}</el-button>
              <el-button class="button" type="text" @click="dialogVisiblePayment = true">{{$t('account.change_payment_pwd')}}</el-button>
            </div>
          </div>
        </template>
        <div>
          <p><span class="label">{{$t('account.user_name')}}:</span><span class="text">{{info.data?.userName}}</span></p>
          <p><span class="label">{{$t('account.merchant_no')}}:</span><span class="text">{{info.data?.merchantNum}}</span></p>
          <p><span class="label">{{$t('account.merchant_name')}}:</span><span class="text">{{info.data?.merchantName}}</span></p>
          <p><span class="label">{{$t('account.secret_key')}}:</span><span class="text">{{info.data?.secretKey}}</span></p>
          <p><span class="label">{{$t('account.submit_time')}}:</span><span class="text">{{info.data?.createTime}}</span></p>
          <p><span class="label">{{$t('account.last_login_time')}}:</span><span class="text">{{info.data?.latelyLoginTime}}</span></p>
        </div>
    </el-card>
    <el-dialog
    v-model="dialogVisible"
    :title="$t('account.change_login_pwd')"
    width="40%"
  >
      <el-form :inline="false" :model="submitForm" class="demo-form-inline">
        <el-form-item :label="$t('account.old_password')">
          <el-input type="password" v-model="submitForm.oldPassword" :placeholder="$t('search_bar.placeholder')" />
        </el-form-item>
        <el-form-item :label="$t('account.new_password')">
          <el-input type="password" v-model="submitForm.newPassword" :placeholder="$t('search_bar.placeholder')" />
        </el-form-item>
        <el-form-item :label="$t('account.confirmed')">
          <el-input type="password" v-model="submitForm.confirmed" :placeholder="$t('search_bar.placeholder')" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">{{$t('basic_text.cancel')}}</el-button>
          <el-button type="primary" @click="onSubmitLoginPwd"
            >{{$t('basic_text.confirm')}}</el-button
          >
        </span>
      </template>
    </el-dialog>
     <el-dialog
    v-model="dialogVisiblePayment"
    :title="$t('account.change_payment_pwd')"
    width="40%"
  >
      <el-form :inline="false" :model="submitForm" class="demo-form-inline">
        <el-form-item :label="$t('account.old_password')">
          <el-input type="password" v-model="submitForm.oldPassword" :placeholder="$t('search_bar.placeholder')" />
        </el-form-item>
        <el-form-item :label="$t('account.new_password')">
          <el-input type="password" v-model="submitForm.newPassword" :placeholder="$t('search_bar.placeholder')" />
        </el-form-item>
        <el-form-item :label="$t('account.confirmed')">
          <el-input type="password" v-model="submitForm.confirmed" :placeholder="$t('search_bar.placeholder')" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">{{$t('basic_text.cancel')}}</el-button>
          <el-button type="primary" @click="onSubmitPaymentPwd"
            >{{$t('basic_text.confirm')}}</el-button
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
