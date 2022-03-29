<script setup lang="ts">
import { ref, reactive, toRaw } from "vue";
import { ElMessage } from 'element-plus'
import { merchantPaylist } from '~/api/api';
import qs from 'qs';

const loading = ref(false);

let pager = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0
})

const query = reactive({
  orderNo: '',
  submitStartTime: '',
  submitEndTime: '',
  merchantOrderNo: ''
})

let tableData = ref([]);

const getList = () => {
  let _query = {...pager, ...query};
  loading.value = true;
  merchantPaylist(_query).then((res : any) => {
    tableData.value = res.data.data.content;
    pager.total = res.data.data.total;
    loading.value = false;
  });
}

const onSubmit = () => {
  getList();
}

const onExport = () => {
  let params = qs.stringify(toRaw(query))
  params += '&pageSize=99999&pageNum=1';
  // 接口更新
  window.open('http://107.182.185.162:8089/merchantOrder/newrderPayMerhantlistExport?' + params);
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
    <el-form-item :label="$t('search_bar.order_no')">
      <el-input v-model="query.orderNo" :placeholder="$t('search_bar.placeholder')" />
    </el-form-item>
    <el-form-item :label="$t('search_bar.task_no')">
      <el-input v-model="query.merchantOrderNo" :placeholder="$t('search_bar.placeholder')" />
    </el-form-item>
    <el-form-item :label="$t('search_bar.subtime')">
        <el-date-picker v-model="query.submitStartTime" value-format="YYYY-MM-DD" type="date" :placeholder="$t('search_bar.placeholder_date')" />
        <span style="padding: 0 10px">{{$t('search_bar.to')}}</span>
        <el-date-picker v-model="query.submitEndTime" value-format="YYYY-MM-DD" type="date" :placeholder="$t('search_bar.placeholder_date')" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">{{$t('search_bar.search') }}</el-button>
      <el-button type="primary" @click="onExport">{{$t('search_bar.export') }}</el-button>
    </el-form-item>
  </el-form>
  </div>
  <el-table v-loading="loading" :data="tableData" border style="width: 100%">
    <el-table-column type="expand">
      <template #default="props">
        <div class="expand_table">
          <p><span class="label">{{$t('table.proccess_time')}}:</span> {{ props.row.dealTime }}</p>
          <p><span class="label">{{$t('table.remark')}}:</span> {{ props.row.note }}</p>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="orderNo" :label="$t('table.order_no')" width="180"/>
    <el-table-column prop="merchantOrderNo" :label="$t('table.merchant_order_no')" width="180" />
    <el-table-column prop="rechargeAmount" :label="$t('table.re_change_amount')" width="100" />
    <el-table-column prop="actualPayAmount" :label="$t('table.actual_pay_amount')" width="120" />
    <el-table-column prop="serviceChange" :label="$t('table.service_change')" width="80"/>
    <el-table-column prop="merchantTotalView" :label="$t('table.merchant_total_view')" width="180" />
    <el-table-column prop="orderStateName" :label="$t('table.order_state')" />
    <el-table-column prop="createTime" :label="$t('table.submit_time')" width="160" />
    <el-table-column prop="settlementTime" :label="$t('table.settlement_time')" width="160" />
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
.expand_table {
  margin-left: 100px;
}
.label {
  display: inline-block;
  width: 180px;
  text-align: right;
  margin-right: 10px;
}
.btn-box {
  margin-left: 100px;
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
.el-button {
  padding: 8px 10px;
  margin: 4px;
}
</style>
