import Vue from "vue";
import Room from "../components/Room.vue";

import "bootstrap/dist/css/bootstrap.min.css";

import VueIziToast from "vue-izitoast";
import "izitoast/dist/css/iziToast.min.css";
Vue.use(VueIziToast);

new Vue({
    render: h => h(Room)
}).$mount("#app");
