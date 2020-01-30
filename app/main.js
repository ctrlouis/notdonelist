import Vue from 'nativescript-vue';
import App from './components/App';
// import VueDevtools from 'nativescript-vue-devtools'; // vue devtools

// personnal import
// import LocalStorage from './js/LocalStorage';

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production');
// Vue.use(VueDevtools); // vue devtools

new Vue({
    // render: h => h('frame', [h(App)])
    template: `
    <Frame>
        <Page>
            <StackLayout>
                <ListView v-for="task in todolist">
                    <v-template>
                        <Label :text="task.message"></Label>
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
        todolist: [{
            id: 0,
            message: "Faire la vaisselle",
            done: false
        },
        {
            id: 1,
            message: "Nettoyer les chiottes",
            done: false
        }]
    },

    methods: {
        addTask() {
            this.todolist.push({
                id: 3,
                message: this.newTask,
                done: false
            });
            this.newTask = "";
        }
    }
}).$start();


function updateLocalStorage() {
    localStorage.setItem('todolist', JSON.stringify(this.todolist));
}
