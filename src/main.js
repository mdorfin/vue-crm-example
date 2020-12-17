import Vue from 'vue'
import Vuelidate from 'vuelidate'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import dateFilter from '@/filters/date.filter'
import currencyFilter from '@/filters/currency.filter'
import localizeFilter from '@/filters/localize.filter'
import messagePlugin from '@/utils/message.plugin'
import titlePlugin from '@/utils/title.plugin'
import Loader from '@/components/app/Loader.vue'
import tooltipDirective from '@/directives/tooltip.directive'
import Paginate from 'vuejs-paginate'
import VueMeta from 'vue-meta'
import 'materialize-css/dist/js/materialize.min'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

Vue.config.productionTip = false

Vue.use(Vuelidate)
Vue.use(messagePlugin)
Vue.use(VueMeta)
Vue.use(titlePlugin)

Vue.filter('date', dateFilter)
Vue.filter('currency', currencyFilter)
Vue.filter('localize', localizeFilter)

Vue.directive('tooltip', tooltipDirective)

Vue.component('Loader', Loader)
Vue.component('Paginate', Paginate)
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: "mdorfin-vue-crm.firebaseapp.com",
  projectId: "mdorfin-vue-crm",
  storageBucket: "mdorfin-vue-crm.appspot.com",
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGE_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
  measurementId: process.env.VUE_APP_FIREBASE_MESUREMENT_ID
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

let app

firebase.auth().onAuthStateChanged(() => { 
  if (!app) { 
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
})
