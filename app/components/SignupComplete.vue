<template>
    <Page>
        <StackLayout>
            <Label text="Save this informations !"></Label>
            <Label :text="data.email"></Label>
            <Label :text="data.password"></Label>
            <Label :text="data.uuid"></Label>
            <Button text="Close" @tap="onConfirm"></Button>
        </StackLayout>
    </Page>
</template>

<script>
export default {
    props: ['data'],

    methods: {
        onConfirm: function() {
            this.$modal.close();
        }
    }
};
</script>