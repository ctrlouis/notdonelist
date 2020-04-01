<template>
    <Page>
        <StackLayout>
            <Label text="Save your credentials" class="center" />
            <Span text="Email :" fontWeight="Bold" />
            <Span text="Password : " fontWeight="Bold" />
            <Label :text="data.email" />
            <Label :text="data.password" />
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

<style scoped>
.left {
    text-align: right;
}

.center {
    text-align: center;
}

.right {
    text-align: right;
}
</style>