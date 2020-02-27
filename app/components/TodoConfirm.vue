<template>
  <Page>
    <StackLayout>
      <Label text="Do you really want to delete this ???"></Label>
      <Button text="DO IT" @tap="onConfirm"></Button>
      <Button text="NO PLS, NO!" @tap="onCancel"></Button>
    </StackLayout>
  </Page>
</template>

<script>
export default {
  props: ["id"],

  data: function() {
    return {
      newTask: ""
    };
  },

  methods: {
    onConfirm: function() {
      this.$modal.close(true);
    },
    onCancel: function() {
      this.$modal.close(false);
    }
  }
};
</script>