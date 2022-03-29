<script setup lang="ts">
import { ref, reactive, toRaw } from "vue";
import { ElMessage } from 'element-plus'
import { findMerchantSettlementRecordByPage } from '~/api/api';
import moment from "moment";

const loading = ref(false);

let pager = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0
})

const query = reactive({
  applyStartTime: '',
  applyEndTime: '',
})

let tableData = ref([]);


const getList = () => {
  let _query = {...pager, ...query};
  loading.value = true;
  findMerchantSettlementRecordByPage(_query).then((res : any) => {
    tableData.value = res.data.data.content;
    pager.total = res.data.data.total;
    loading.value = false;
  });
}

const onSubmit = () => {
  getList();
}


const handleSizeChange = (pageSize: number) => {
    pager.pageSize = pageSize;
    getList();
}

const handleCurrentChange = (pageNum: number) => {
    pager.pageNum = pageNum;
    getList();
}

getList();

</script>

<template>
  <div class="warpper">
  <div class="searchBar">
   <el-form :inline="true" :model="query" class="demo-form-inline">
    <el-form-item :label="$t('search_bar.subtime')">
        <el-date-picker v-model="query.applyStartTime" value-format="YYYY-MM-DD" type="date" :placeholder="$t('search_bar.placeholder_date')" />
        <span style="padding: 0 10px">{{$t('search_bar.to')}}</span>
        <el-date-picker v-model="query.applyEndTime" value-format="YYYY-MM-DD" type="date" :placeholder="$t('search_bar.placeholder_date')" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">{{$t('search_bar.search') }}</el-button>
    </el-form-item>
  </el-form>
  </div>
  <!-- <div class="pager-box-cus">
      <el-pagination background layout="prev, pager, next" :total="pager.total" />
  </div> -->
  <el-table v-loading="loading" :data="tableData" border style="width: 100%">
    <el-table-column prop="orderNo" :label="$t('table.order_no')"/>
    <el-table-column prop="withdrawAmount" :label="$t('table.amount')" width="120" />
    <el-table-column prop="applyTime" :label="$t('table.submit_time')" width="180" />
    <el-table-column prop="openAccountBank" :label="$t('bank.bank_name')"  width="200" />
    <el-table-column prop="bankCardAccount" :label="$t('bank.account_num')"  width="180" />
    <el-table-column prop="stateName" :label="$t('table.state_name')"  width="100" />
  </el-table>
  <div class="pager-box-cus" >
      <el-pagination 
        v-model:currentPage="pager.pageNum"
        v-model:page-size="pager.pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        background 
        layout="prev, pager, next" 
        :total="pager.total" />
  </div>
  </div>
</template>

<style>
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
.el-button {
  margin: 4px;
}
</style>
