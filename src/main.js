import Vue from 'vue';
import App from './App';
import Filters from './filters';

Vue.config.productionTip = false;

Vue.use(Filters);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
});
