"use strict";


import Vue from 'nativescript-vue';
import App from './components/App';

// personnal import
// import LocalStorage from './js/LocalStorage';
import GroceryItem  from './js/GroceryItem';
import tasksData    from './js/datas/task-data.json';

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production');

// VueDevtools
// import VueDevtools from 'nativescript-vue-devtools'; // vue devtools
// Vue.use(VueDevtools); // vue devtools

new Vue({
    // render: h => h('frame', [h(App)])
    template: `
    <Frame>
        <Page>
            <StackLayout>
                <ListView v-for="task in displayTasks">
                    <v-template>
                        <!-- <Label :text="task.message"></Label> -->
                        <GroceryItem :currentTask="task"></GroceryItem>
                    </v-template>
                </ListView>
                <TextField v-model="newTask"></TextField>
                <Button text="Add task" @tap="addTask"></Button>
            <StackLayout>
        </Page>
    </Frame>
    `,

    data: {
        newTask: "",
        todolist: tasksData.tasks
    },

    methods: {
        addTask() {
            this.todolist.push({
                id: this.getId,
                message: this.newTask,
                done: false
            });
            this.newTask = "";
        },
        getId() {
            const lastIndex = this.todolist.length - 1;
            return this.todolist[lastIndex].id + 1;
        }
    },

    computed: {
        displayTasks() {
            const tempTask = [{
                message: this.newTask
            }];
            const todolist = this.todolist.concat(tempTask);
            return todolist;
        }
    }
}).$start();


function updateLocalStorage() {
    localStorage.setItem('todolist', JSON.stringify(this.todolist));
}
