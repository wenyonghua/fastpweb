<script setup lang="ts">
import { ref, reactive, toRaw, onUnmounted } from "vue";
import { ElMessage } from 'element-plus'
import { findMerchantOrderByPage, getMerchantInfo, updateNote, resendMerchantNotice, findMerchantOrderDetailsById, merchantStartAppeal } from '~/api/api';
import moment from "moment";
import {numberToCurrencyNo} from '~/utils/tools';
import qs from 'qs';
import { Plus, Promotion } from '@element-plus/icons-vue'

const loading = ref(false);
const resendLoding = ref(false);

const dialogVisible = ref(false);

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
  platformName: '',
  orderState: '',
  gatheringChannelCode: '',
  receiverUserName: '',
  submitStartTime: '',
  submitEndTime: '',
  merchantOrderNo: ''
})

const submitForm = reactive(<AppelForm>{});

let tableData = ref([]);

const type_options = [{
    name: '微信',
    value: 'wetchat'
  }, {
    name: '支付宝',
    value: 'wetchat'
  }, {
    name: '银行卡',
    value: 'bankcard'
  }, {
    name: '云闪付',
    value: 'unionpay'
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
}]

const getList = () => {
  let _query = {...pager, ...query};
  loading.value = true;
  findMerchantOrderByPage(_query).then((res : any) => {
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
  window.open('http://107.182.185.162:8089/merchantOrder/merchantOrdernewExport?' + params);
}

const onChangeNote = () => {
  let id = toRaw(NoteDialog).id;
  let note = toRaw(submitNote.value);
    updateNote({
      id: id,
      note: note
    }).then(res =>{
        if (res.data.success) {
            getList();
            NoteDialog.visible = false;
            submitNote.value = '';
            ElMessage.success(res.data.msg || 'success');
        } else {
            ElMessage.error(res.data.msg || 'error');
        }
    })
}

const onReport = (row: any) => {
  findMerchantOrderDetailsById({
    orderId: row.id
  }).then((res: any) => {
    if (res.data.success) {
      let data = res.data.data;
      submitForm.orderNo = data.orderNo;
      submitForm.orderStateName = data.orderStateName
      submitForm.rate = data.rate
      submitForm.gatheringChannelName = data.gatheringChannelName
      submitForm.gatheringAmount = data.gatheringAmount
      submitForm.receiverUserName = data.receiverUserName
      submitForm.receivedTime = data.receivedTime
      submitForm.submitTime = data.submitTime
      dialogVisible.value = true;
    } else {
      ElMessage.error(res.data.msg || 'error');
    }
  });
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

const onSave = () => {
    merchantStartAppeal({
        appealType: submitForm.appealType,
        actualPayAmount: submitForm.actualPayAmount,
        merchantSreenshotIds: '',
        merchantOrderId: submitForm.orderNo
    }).then(res => {
        if (res.data.success) {
            getList();
            ElMessage.success(res.data.msg || 'success');
        } else {
            ElMessage.error(res.data.msg || 'error');
        }
    });
}

const onRemark = (row: any) => {
  NoteDialog.id = row.id;
  NoteDialog.visible = true;
}

const handleRemove = () => {

}

const handlePictureCardPreview = () => {

}

getList();

const timer = setInterval(() => {
  getList();
}, 10000);

onUnmounted(() => {
  clearInterval(timer);
});

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
    <el-form-item :label="$t('search_bar.status')">
      <el-select v-model="query.orderState" :placeholder="$t('search_bar.placeholder_select')">
        <el-option v-for="(item, key) in status_options" :label="item.name" :value="item.value" :key="key" />
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('search_bar.type')">
      <el-select v-model="query.gatheringChannelCode" :placeholder="$t('search_bar.placeholder_select')">
        <el-option v-for="(item, key) in type_options" :label="item.name" :value="item.value" :key="key" />
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('search_bar.agent')">
      <el-input v-model="query.receiverUserName" :placeholder="$t('search_bar.placeholder')" />
    </el-form-item>
    <el-form-item :label="$t('search_bar.subtime')">
        <el-date-picker v-model="query.submitStartTime" value-format="YYYY-MM-DD" type="date" placeholder="Pick a day" />
        <span style="padding: 0 10px">{{$t('search_bar.to')}}</span>
        <el-date-picker v-model="query.submitEndTime" value-format="YYYY-MM-DD" type="date" placeholder="Pick a day" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">{{$t('search_bar.search') }}</el-button>
      <el-button type="primary" @click="onExport">{{$t('search_bar.export') }}</el-button>
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
          <p><span class="label">Order Down Time:</span> {{ props.row.usefulTime }}</p>
          <p><span class="label">Confirm Time:</span> {{ props.row.confirmTime }}</p>
          <p><span class="label">Proccess Time:</span> {{ props.row.dealTime }}</p>
          <p><span class="label">Remark:</span> {{ props.row.note }}</p>
          <p><span class="label">Payment Address:</span> <a :href="props.row.payUrl" target="_blank">{{ props.row.payUrl }}</a></p>
          <p><span class="label">Task Number:</span> {{ props.row.merchantOrderNo }}</p>
          <p><span class="label">Callback Address:</span> {{ props.row.payInfo.returnUrl }}</p>
          <p><span class="label">Remark:</span> {{ props.row.payInfo.attch }}</p>
          <p><span class="label">Callback Time:</span> {{ props.row.noticeTime }}</p>
          <div class="btn-box">
            <el-button type="danger" v-if="props.row.orderState == 2" @click="onReport(props.row)">Report</el-button>
            <el-button type="primary" @click="onRemark(props.row)">Change Remark</el-button>
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="orderNo" label="order No" width="180"/>
    <el-table-column prop="merchantOrderNo" label="Task No" width="120" />
    <el-table-column prop="orderState" label="Status" width="100">
      <template #default="scope">
          <div>{{ formatStatus(scope.row.orderState) }}</div>
      </template>
    </el-table-column>
    <el-table-column prop="gatheringChannelName" label="Type" width="100"/>
    <el-table-column prop="gatheringAmount" label="Amount" width="180">
      <template #default="scope">
          <div>{{ numberToCurrencyNo(scope.row.gatheringAmount) }}VND</div>
      </template>
    </el-table-column>
    <el-table-column prop="gatheringChannelCode" label="Agent/Submit Time" width="220">
      <template #default="scope">
          <div v-if="scope.row.receiverUserName">{{ scope.row.receiverUserName }}/{{ scope.row.submitTime }}</div>
          <span v-else>-</span>
      </template>
    </el-table-column>
    <el-table-column prop="submitTime" label="Submit Time" width="200" />
    <el-table-column prop="note" label="Status Notice" width="120">
      <template #default="scope">
          <div>{{ scope.row.payInfo?.noticeStateName}}</div>
      </template>
    </el-table-column>
    <el-table-column label="Operate" align="center">
      <template #default="scope">
          <el-tooltip
            class="box-item"
            effect="dark"
            content="Resend Callback"
            placement="top-end"
            v-if="scope.row.payInfo?.noticeState == 3"
          >
         <el-button :icon="Promotion" type="primary" @click="resendNotice(scope.row)" :loading="resendLoding"></el-button>
          </el-tooltip>
         <span v-else>-</span>
      </template>
    </el-table-column>
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
  <el-dialog
    v-model="dialogVisible"
    :title="$t('order.send_appeal')"
    width="60%"
  >
      <el-form :inline="true" :model="submitForm" class="demo-form-inline">
        <el-form-item :label="$t('order.order_no')">
            <span>{{submitForm.orderNo}}</span>
        </el-form-item>
        <el-form-item :label="$t('order.order_status')">
          <span>{{submitForm.orderStateName}}</span>
        </el-form-item>
        <el-form-item :label="`${$t('order.bank')}/${$t('order.recive_fee')}/${$t('order.rate')}`">
          <span>{{submitForm.gatheringChannelName}}/{{submitForm.gatheringAmount}}VAND/{{submitForm.rate}}%</span>
        </el-form-item>
        <el-form-item :label="`${$t('order.agent')}/${$t('order.receivedtime')}`">
          <span>{{submitForm.receiverUserName}}/{{submitForm.receivedTime}}</span>
        </el-form-item>
        <el-form-item :label="$t('order.subtime')">
          <span>{{submitForm.submitTime}}</span>
        </el-form-item>
        <el-form-item :label="$t('order.type')">
            <el-radio-group v-model="submitForm.appealType">
              <el-radio label="2">实际支付金额小于收款金额</el-radio>
              <el-radio label="4">实际支付金额大于收款金额</el-radio>
              <el-radio label="3">已支付用户未进行确认</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label-width="120px" required :label="$t('order.amount_actual')" v-if="submitForm.appealType != '3'">
            <el-input-number controls-position="right" v-model="submitForm.actualPayAmount" :placeholder="$t('search_bar.placeholder')" />
        </el-form-item>
        <div>
        <el-form-item label-width="120px" :label="$t('order.screenshot')">
              <el-upload
                action="http://107.182.185.162:8089/storage/uploadPic"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :file-list="fileList"
              >
                <el-icon><Plus /></el-icon>
              </el-upload>
        </el-form-item>
        </div>
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
    <el-dialog
    v-model="NoteDialog.visible"
    :title="$t('order.remark')"
    width="40%"
    >
        <el-input  type="textarea" rows="4" v-model="submitNote" />
        <template #footer>
        <span class="dialog-footer">
          <el-button @click="NoteDialog.visible = false">{{$t('basic_text.cancel')}}</el-button>
          <el-button type="primary" @click="onChangeNote"
            >{{$t('basic_text.confirm')}}</el-button
          >
        </span>
      </template>
    </el-dialog>
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
