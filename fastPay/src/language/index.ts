//语言
import { createI18n } from 'vue-i18n'		//引入vue-i18n组件
import ch from './ch';
import en from './en';
// import { 引入的组件 export 出来的 变量} from 'vue-i18n'
  //注册i8n实例并引入语言文件
const lc = localStorage.getItem('--APP-STORAGE--') || '';
let lo = lc ? JSON.parse(lc)?.default?.lang : 'en';
 const i18n = createI18n({
      locale: lo,		//默认显示的语言 
      messages: {
        ch: ch,	//引入语言文件
        en: en
      }
  })
export default i18n;