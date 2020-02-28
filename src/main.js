import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import store from './store/'
import '@babel/polyfill'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'
import VueVideoPlayer from 'vue-video-player'

Vue.config.productionTip = false
Vue.use(VueVideoPlayer)
new Vue({
	store,
	vuetify,
	render: h => h(App),
}).$mount('#app')
