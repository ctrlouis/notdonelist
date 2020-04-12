"use strict";


import Vue from 'nativescript-vue';
import App from './components/App';

// personnal import
// import LocalStorage from './js/LocalStorage';

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production');

// VueDevtools
// import VueDevtools from 'nativescript-vue-devtools'; // vue devtools
// Vue.use(VueDevtools); // vue devtools

new Vue({
    render: function(h) {
        return h("frame", [h(App)]);
    }
}).$start();


function updateLocalStorage() {
    localStorage.setItem('todolist', JSON.stringify(this.todolist));
}