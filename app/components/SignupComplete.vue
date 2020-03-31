<template>
    <Page>
        <GridLayout columns="*, 2*" rows="2*, 3*">
            <Label text="Your credentials" row="0" col="0" class="center" />
            <TextView editable="false" row="1" col="0" class="left">
                <FormattedString>
                    <Span text="Email :" fontWeight="Bold" />
                    <Span text="Password : " fontWeight="Bold" />
                </FormattedString>
            </TextView>
            <TextView editable="false" row="1" col="1" class="right">
                <FormattedString>
                    <Span text="You can use text attributes such as " />
                    <Span text="bold, " fontWeight="Bold" />
                    <Label :text="data.email" />
                    <Label :text="data.password" />
                </FormattedString>
            </TextView>
        </GridLayout>
        <StackLayout>
            <Label text="Keep this information !"/>
            <Label :text="data.email"/>
            <Label :text="data.password"/>
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