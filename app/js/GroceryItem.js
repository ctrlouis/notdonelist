import Vue from 'nativescript-vue';

export default Vue.component('GroceryItem', {
    template: `
    <GridLayout columns="100, *">
        <Button col="0" :text="statusText" @tap="toggle"></Button>
        <Label col="1" :text="currentTask.message"></Label>
    </GridLayout>
    `,

    props: ['currentTask'],

    data: function() {
        return {
            status: 0
        }
    },

    computed: {
        statusText: function() {
            return this.status === 0 ? "Not done" : "Done";
        }
    },

    methods: {
        toggle: function() {
            this.status = this.status === 0 ? 1 : 0;
        }
    }

});