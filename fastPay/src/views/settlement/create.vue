<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElMessage } from 'element-plus'
import { findMerchantBankCardByMerchantId, applySettlement } from '~/api/api';
import { useStore } from '~/store/store';

// defineProps<{ msg: string }>();

const store = useStore();

interface BankAccount {
    accountHolder: string
    bankCardAccount: string
    id: string
    openAccountBank: string
}

interface Settlement {
  withdrawAmount: number,
  merchantBankCardId: string,
  moneyPwd: string
}

const loading = ref(false);
const dialogVisible = ref(false);
const submitForm = reactive(<Settlement>{});

let BankAccount = reactive({
  data: [<BankAccount>{}]
});

const init = () => {
  findMerchantBankCardByMerchantId().then(res => {
     BankAccount.data  = res.data.data;
  })
}

const handleClose = () => {
  
}

const onSubmit = () => {
    applySettlement(submitForm).then(res => {
        if (res.data.success) {
            ElMessage.success(res.data.msg);
        } else {
            ElMessage.error(res.data.msg);
        }
    });
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
        <span>{{$t('settlement.create_settlement')}}</span>
        </div>
    </template>
      <el-form :inline="false" :model="submitForm" class="demo-form-inline" label-width="150px">
        <div class="el-form-item"  style="color: red;">
          <label for="" class="el-form-item__label" style="width: 150px;color: red;">{{$t('settlement.available_balance')}}</label>
          <div class="el-form-item__content"><span>{{store.state.info?.withdrawableAmount}}</span>
        </div></div>
        <el-form-item :label="$t('settlement.amount')">
          <el-input-number controls-position="right" v-model="submitForm.withdrawAmount" :placeholder="$t('search_bar.placeholder')" style="width: 400px" />
        </el-form-item>
        <el-form-item :label="$t('settlement.to_bank_account')">
            <el-select v-model="submitForm.merchantBankCardId" :placeholder="$t('search_bar.placeholder_select')" style="width: 400px">
                <el-option
                v-for="item in BankAccount.data"
                :key="item.id"
                :label="item.bankCardAccount"
                :value="item.id"
                >
                <span
                    style="
                    float: left;
                    color: var(--el-text-color-secondary);
                    font-size: 13px;
                    width: 150px
                    "
                    >{{ item.openAccountBank }}</span
                >
                <span style="float: left;">{{ item.accountHolder }}</span>
                <span
                    style="
                    float: right;
                    color: var(--el-text-color-secondary);
                    font-size: 13px;
                    "
                    >{{ item.bankCardAccount }}</span
                >
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item :label="$t('settlement.payment_pwd')">
          <el-input type="password" v-model="submitForm.moneyPwd" :placeholder="$t('search_bar.placeholder')" style="width: 400px" />
        </el-form-item>
        <el-form-item>
           <el-button type="primary" @click="onSubmit">{{$t('search_bar.submint')}}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    </div>
</template>

<style scoped lang="scss">
.wrapper-box {
  padding: 10px;
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
.box-card {
    width: 600px;
    margin: 0 auto;
}
</style>
