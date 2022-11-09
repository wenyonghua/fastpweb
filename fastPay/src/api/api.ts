import internal from 'stream';
import { axios as request } from '../utils/request';


  interface settlementRecord {
    pageSize: number
    pageNum: number
    applyStartTime: string 
    applyEndTime: string,
    total: any
  }

  interface Settlement {
    withdrawAmount: number
    merchantBankCardId: string
    moneyPwd: string
  }

  interface BankCard {
    openAccountBank: string,
    accountHolder: string,
    bankCardAccount: number
}

  interface BankCardEdit extends BankCard {
    id?: number
  }

  interface Appeal {
    appealType: string
    actualPayAmount: number
    merchantSreenshotIds: string
    merchantOrderId: string
  }

  export const findMerchantOrderByPage = (params: any) => {
    return request.get(`/merchantOrder/findMerchantOrderByPage`, {params: params});
  }

  export const login = (params : any) => {
    return request.post(`/login`, params);
  }

  export const logout = () => {
    return request.post(`/logout`);
  }

  export const getMerchantInfo = () => {
    return request.get('/merchant/getMerchantInfo');
  }

  export const findMerchantBankCardByMerchantId = () => {
    return request.get('/merchant/findMerchantBankCardByMerchantId');
  }

  export const getSystemSetting = () => {
    return request.get('/masterControl/getSystemSetting');
  }

  export const findMerchantSettlementRecordByPage = (params: settlementRecord) => {
    return request.get('/merchant/findMerchantSettlementRecordByPage', {params: params});
  }

  export const updateNote = (params: any) => {
    return request.post('/merchantOrder/updateNote', params);
  }

  export const findMerchantOrderDetailsById = (params: any) => {
    return request.get('/merchantOrder/findMerchantOrderDetailsById', {params: params});
  }

  export const merchantStartAppeal = (params: Appeal) => {
    return request.post('/appeal/merchantStartAppeal', params);
  }

  export const applySettlement = (params: Settlement) => {
    return request.post('/merchant/applySettlement', params);
  }

  export const addOrUpdateMerchantBankCard = (params: BankCardEdit) => {
    return request.post('/merchant/addOrUpdateMerchantBankCard', params);
  }

  export const deleteMerchantBankCard = (params: any) => {
    return request.get('/merchant/deleteMerchantBankCard', {params: params});
  }

  export const merchantPaylist = (params: any) => {
    return request.get('/merchantOrder/merchantPaylist', {params: params});
  }

  export const resendMerchantNotice = (params: any) => {
    return request.get('/merchantOrder/resendMerchantNotice', {params: params});
  }

  export const modifyLoginPwd = (params: any) => {
    return request.post('/merchant/modifyLoginPwd', params);
  }

  export const modifyMoneyPwd = (params: any) => {
    return request.post('/merchant/modifyMoneyPwd', params);
  }

  export const merchantOrdernewExport = () => {
    return window.open('/merchantOrder/merchantOrdernewExport?orderNo=&merchantOrderNo=&orderState=&receiverUserName=&submitStartTime=2022-03-01&submitEndTime=2022-03-25&pageNum=1&pageSize=99999999');
  }

  // 付款订单列表
  export const findMerchantPayoutOrderByPage = (params: any) => {
    return request.get('/merchantPayoutOrder/findMerchantPayoutOrderByPage', {params: params});
  }