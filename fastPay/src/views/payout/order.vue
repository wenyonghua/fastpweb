<script setup lang="ts">
import { ref, reactive, toRaw, watch } from "vue";
import { ElMessage } from 'element-plus'
import { findMerchantPayoutOrderByPage, resendMerchantNotice, } from '~/api/api';
import moment from "moment";
import {numberToCurrencyNo} from '~/utils/tools';
import qs from 'qs';
import { Plus, Promotion } from '@element-plus/icons-vue'

const loading = ref(false);
const resendLoding = ref(false);

const dialogVisible = ref(false);

const reflash = ref(false);

let timer = ref();

watch(reflash, (value) => {
    if (value) {
        timer.value = setInterval(() => {
            getList();
        }, 60000);
    } else {
        clearInterval(timer.value);
    }
})

const NoteDialog = reactive({
  visible: false,
  id: ''
});
const submitNote = ref('');

const fileList = ref([]);

interface  AppelForm {
  orderNo: string
  orderStateName: string
  rate: number
  gatheringChannelName: string
  gatheringAmount: string
  receiverUserName: string
  receivedTime: string
  submitTime: string
  actualPayAmount: number
  appealType: string
}

let pager = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0
})

const query = reactive({
    orderNo: '',
    merchantName: '',
    merchantOrderNo: '',
    orderState: '',
    gatheringChannelCode: '',
    receiverUserName: '',
    submitStartTime: moment().format('YYYY-MM-DD'),
    submitEndTime: moment().format('YYYY-MM-DD'),
    bankCardAccount: '',
    note: '',
    gatheringAmountView: '',
    attch: '',
    systemSource: '',
    merchantNum: '',
    shoukuBankNumber: '',
    fukuBankNumber: '',
})

const submitForm = reactive(<AppelForm>{});

let tableData = ref([]);

const type_options = [{
    name: '微信',
    value: 'wetchat'
  }, {
    name: '支付宝',
    value: 'alipay'
  }, {
    name: '银行卡',
    value: 'bankcard'
  }, {
    name: '云闪付',
    value: 'unionpay',
  }, {
    name: '银联扫码',
    value: 'UnionPayScan'
  }]

const status_options = [{
  name: '全部',
  value: ''
},{
  name: '等待接单',
  value: 1
}, {
  name: '已接单',
  value: 2
}, {
  name: '已支付',
  value: 4
}, {
  name: '超时取消',
  value: 5
}, {
  name: '人工取消',
  value: 6
}, {
  name: '未确认超时取消',
  value: 7
}, {
  name: '申诉中',
  value: 8
}, {
  name: '取消订单退款',
  value: 9
}, {
  name: '代付成功',
  value: 10
}]

const getList = () => {
  let _query = {...pager, ...query};
  loading.value = true;
  findMerchantPayoutOrderByPage(_query).then((res : any) => {
    tableData.value = res.data.data.content;
    pager.total = res.data.data.total;
    loading.value = false;
  });
}

const onSubmit = () => {
  console.log(query);
  getList();
}

const onExport = () => {
  let params = qs.stringify(toRaw(query))
  params += '&pageSize=99999&pageNum=1';
  // 接口更新
  window.open('http://107.182.185.162:8089/merchantPayoutOrder/orderNewExport?' + params);
}


const resendNotice = (row: any) => {
   resendLoding.value = true;
   resendMerchantNotice(row).then(res => {
     resendLoding.value = false;
        if (res.data.success) {
            getList();
            ElMessage.success(res.data.msg || 'success');
        } else {
            ElMessage.error(res.data.msg || 'error');
        }
   })
}

const handleSizeChange = (pageSize: number) => {
    pager.pageSize = pageSize;
    getList();
}

const handleCurrentChange = (pageNum: number) => {
    pager.pageNum = pageNum;
    getList();
}

const formatStatus = (status: string) => {
    return status_options.filter(item => {
      return item.value == status;
    })[0].name;
}

const handleRemove = () => {

}

const handlePictureCardPreview = () => {

}

getList();

// const timer = setInterval(() => {
//   getList();
// }, 10000);

// onUnmounted(() => {
//   clearInterval(timer);
// });

</script>

<template>
  <div class="warpper">
  <div class="searchBar">
   <el-form :inline="true" :model="query" class="demo-form-inline">
    <el-form-item :label="$t('search_bar.order_no')">
      <el-input v-model="query.orderNo" :placeholder="$t('search_bar.placeholder')" />
    </el-form-item>
    <el-form-item :label="$t('search_bar.merchant_name')">
      <el-input v-model="query.merchantName" :placeholder="$t('search_bar.placeholder')" />
    </el-form-item>
    <el-form-item :label="$t('search_bar.task_no')">
      <el-input v-model="query.merchantOrderNo" :placeholder="$t('search_bar.placeholder')" />
    </el-form-item>
    <el-form-item :label="$t('search_bar.shoukuan_bank_num')">
      <el-input v-model="query.shoukuBankNumber" :placeholder="$t('search_bar.placeholder')" />
    </el-form-item>
    <el-form-item :label="$t('search_bar.status')">
      <el-select v-model="query.orderState" :placeholder="$t('search_bar.placeholder_select')">
        <el-option v-for="(item, key) in status_options" :label="item.name" :value="item.value" :key="key" />
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('search_bar.channelCode')">
      <el-select v-model="query.gatheringChannelCode" :placeholder="$t('search_bar.placeholder_select')">
        <el-option v-for="(item, key) in type_options" :label="item.name" :value="item.value" :key="key" />
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('search_bar.agent')">
      <el-input v-model="query.receiverUserName" :placeholder="$t('search_bar.placeholder')" />
    </el-form-item>
    <el-form-item :label="$t('search_bar.subtime')">
        <el-date-picker v-model="query.submitStartTime" value-format="YYYY-MM-DD" type="date" :placeholder="$t('search_bar.placeholder_date')" />
        <span style="padding: 0 10px">{{$t('search_bar.to')}}</span>
        <el-date-picker v-model="query.submitEndTime" value-format="YYYY-MM-DD" type="date" :placeholder="$t('search_bar.placeholder_date')" />
    </el-form-item>
    <el-form-item :label="$t('search_bar.note')">
      <el-input v-model="query.note" :placeholder="$t('search_bar.placeholder')" />
    </el-form-item>
    <el-form-item :label="$t('search_bar.attch')">
      <el-input v-model="query.attch" :placeholder="$t('search_bar.placeholder')" />
    </el-form-item>
        <el-form-item :label="$t('search_bar.fukuan_bank_num')">
      <el-input v-model="query.fukuBankNumber" :placeholder="$t('search_bar.placeholder')" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">{{$t('search_bar.search') }}</el-button>
      <el-button type="primary" @click="onExport">{{$t('search_bar.export') }}</el-button>
    </el-form-item>
    <el-form-item>
      <el-checkbox v-model="reflash">60s定时刷新</el-checkbox>
    </el-form-item>
  </el-form>
  </div>
  <!-- <div class="pager-box-cus">
      <el-pagination background layout="prev, pager, next" :total="pager.total" />
  </div> -->
  <el-table v-loading="loading" :data="tableData" border style="width: 100%">
    <el-table-column type="expand">
      <template #default="props">
        <div class="expand_table">
          <p><span class="label">{{$t('table.order_down_time')}}</span> {{ props.row.usefulTime }}</p>
          <p><span class="label">{{$t('table.confirm_time')}}</span> {{ props.row.confirmTime }}</p>
          <p><span class="label">{{$t('table.proccess_time')}}</span> {{ props.row.dealTime }}</p>
          <p><span class="label">{{$t('table.order_amout')}}</span> {{ props.row.gatheringAmountView }}</p>
           <p><span class="label">{{$t('table.bankcard_total_amount')}}</span></p>
          <p><span class="label">{{$t('table.receiving_bank_card')}}</span> {{ props.row.shoukuBankNumber }}</p>
          <p><span class="label">{{$t('table.payee')}}</span> {{ props.row.shoukuBankPayee }}</p>
          <p><span class="label">{{$t('table.receiving_bank_name')}}</span> {{ props.row.shoukuBankName }}</p>
          <p><span class="label">{{$t('table.receiving_bank_branch')}}</span> {{ props.row.shoukuBankBranch }}</p>
          <p><span class="label">{{$t('table.payment_bank_card_list')}}</span></p>
          <p><span class="label">{{$t('table.remark')}}</span> {{ props.row.note }}</p>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="orderNo" :label="$t('table.order_no')" width="180"/>
    <el-table-column prop="merchantNum" :label="$t('table.merchant_num')" width="120" />
    <el-table-column prop="platformName" :label="$t('table.platform_name')" width="120" />
    <el-table-column prop="merchantOrderNo" :label="$t('table.merchant_order_no')" width="120" />
    <el-table-column prop="shoukuBankNumber" :label="$t('table.receiving_bank_card')" width="120" />
    <el-table-column prop="shoukuBankPayee" :label="$t('table.payee')" width="120" />
    <el-table-column prop="shoukuBankName" :label="$t('table.receiving_bank_name')" width="120" />
    <el-table-column prop="shoukuBankBranch" :label="$t('table.receiving_bank_branch')" width="120" />
    <el-table-column prop="gatheringAmountView" :label="$t('table.amount')" width="120" />
    <el-table-column prop="fukuBankNumber" :label="$t('table.payment_bank_card')" width="120" />
    <el-table-column prop="systemSource" :label="$t('table.system_source')" width="120" />
    <el-table-column prop="note" :label="$t('table.remark')" width="120" />
    <el-table-column prop="orderState" :label="$t('table.order_state')" width="100">
      <template #default="scope">
          <div v-if="scope.row.orderState == 2" style="color: #e6a23c">{{ formatStatus(scope.row.orderState) }}</div>
          <div v-else-if="scope.row.orderState == 4" style="color: #67c23a">{{ formatStatus(scope.row.orderState) }}</div>
          <div v-else-if="scope.row.orderState == 5 || scope.row.orderState == 6 || scope.row.orderState == 7" style="color: #f56c6c">{{ formatStatus(scope.row.orderState) }}</div>
          <div v-else>{{ formatStatus(scope.row.orderState) }}</div>
      </template>
    </el-table-column>
    <el-table-column prop="bounty" :label="$t('table.bounty')" width="90"/>
    <el-table-column prop="gatheringChannelName" :label="$t('table.channel')" width="90"/>
    <el-table-column prop="submitTime" :label="$t('table.submit_time')" width="200" />
    <el-table-column prop="confirmTime" :label="$t('table.complete_time')" width="200" />
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
