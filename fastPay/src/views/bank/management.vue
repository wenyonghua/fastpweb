<script setup lang="ts">
import { ref, reactive, toRaw } from "vue";
import { ElMessage } from 'element-plus'
import { findMerchantBankCardByMerchantId, addOrUpdateMerchantBankCard, deleteMerchantBankCard } from '~/api/api';
import { Delete, Edit } from '@element-plus/icons-vue'
import moment from "moment";

interface BankCard {
    openAccountBank: string,
    accountHolder: string,
    bankCardAccount: number
}

 interface BankCardEdit extends BankCard {
    id?: number
  }


const loading = ref(false);

const dialogVisible = ref(false);

let tableData = ref([]);

const submitForm = reactive(<BankCardEdit>{});


const getList = () => {
  loading.value = true;
  findMerchantBankCardByMerchantId().then((res : any) => {
    tableData.value = res.data.data?.reverse();
    loading.value = false;
  });
}

const onEdit = (row: any) => {
    submitForm.id = row.id;
    submitForm.openAccountBank = row.openAccountBank;
    submitForm.accountHolder = row.accountHolder;
    submitForm.bankCardAccount = row.bankCardAccount;
    dialogVisible.value = true;
}

const onDelete = (row: any) => {
    deleteMerchantBankCard({
        merchantBankCardId: row.id
    }).then(res => {
        if (res.data.success) {
            getList();
            ElMessage.success(res.data.msg || 'success');
            dialogVisible.value = false;
        } else {
            ElMessage.error(res.data.msg || 'error');
        }
    })
}

const onAdd = () => {
    delete submitForm.id;
    submitForm.bankCardAccount = 0;
    submitForm.openAccountBank = '';
    submitForm.accountHolder = '';
    dialogVisible.value = true;
}

const onSave = () => {
    addOrUpdateMerchantBankCard(submitForm).then(res => {
        if (res.data.success) {
            getList();
            ElMessage.success(res.data.msg || 'success');
            dialogVisible.value = false;
        } else {
            ElMessage.error(res.data.msg || 'error');
        }
    })

}

getList();

</script>

<template>
  <div class="warpper">
  <div class="op">
      <el-button style="float: right" type="primary" @click="onAdd">{{$t('search_bar.bankAdd')}}</el-button>
  </div>
  <el-table v-loading="loading" :data="tableData" border style="width: 100%">
    <el-table-column prop="openAccountBank" :label="$t('bank.bank_name')"/>
    <el-table-column prop="accountHolder" :label="$t('bank.account_name')" width="180" />
    <el-table-column prop="bankCardAccount" :label="$t('bank.account_num')" width="180" />
    <el-table-column prop="createTime" :label="$t('bank.last_change_time')" width="200" />
    <el-table-column :label="$t('table.operate')" width="160">
      <template #default="scope">
          <el-button-group>
                <el-button type="primary" @click="onEdit(scope.row)" :icon="Edit"  />
                <el-popconfirm :title="$t('message.delete_text')" @confirm="onDelete(scope.row)">
                    <template #reference>
                    <el-button type="danger" :icon="Delete" />
                    </template>
                </el-popconfirm>
          </el-button-group>
      </template>
    </el-table-column>
  </el-table>
    <el-dialog
    v-model="dialogVisible"
    :title="$t('bank.edit_bank_card')"
    width="40%"
  >
      <el-form :inline="false" :model="submitForm" class="demo-form-inline">
        <el-form-item :label="$t('bank.bank_name')">
          <el-input v-model="submitForm.openAccountBank" :placeholder="$t('search_bar.placeholder')" />
        </el-form-item>
        <el-form-item :label="$t('bank.account_name')">
          <el-input v-model="submitForm.accountHolder" :placeholder="$t('search_bar.placeholder')" />
        </el-form-item>
        <el-form-item :label="$t('bank.account_num')">
          <el-input v-model="submitForm.bankCardAccount" :placeholder="$t('search_bar.placeholder')" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">{{$t('basic_text.cancel')}}</el-button>
          <el-button type="primary" @click="onSave"
            >{{$t('basic_text.confirm')}}</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.op {
    height: 50px;
}
.searchBar {
  margin-bottom: 10px;
  border-bottom: 1px solid #ccc;
}
.pager-box-cus {
  float: right;
  margin:10px 0px
}
.warpper {
  padding: 10px;
}
.el-button-group{
    .el-button{
        padding: 8px 10px;
        width: 60px;
    }
}
.el-form-item {
  display: block;
}
</style>
