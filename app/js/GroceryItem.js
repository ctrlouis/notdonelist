import Vue from 'nativescript-vue';

export default Vue.component('GroceryItem', {
    template: `
    <GridLayout columns="100, *">
        <Button col="0" text="Done"></Button>
        <Label col="1" :text="currentTask.message"></Label>
    </GridLayout>
    `,

    props: ['currentTask']
});
