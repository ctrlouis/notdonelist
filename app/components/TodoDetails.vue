<template>
  <Page>
    <StackLayout>
      <Button text="Go back" @tap="onBackTap"></Button>
      <Label :text="selectedTask.message"></Label>
      <Button :text="statusText" @tap="toggle"></Button>
      <Button text="Delete" @tap="onDeleteTap"></Button>
    </StackLayout>
  </Page>
</template>

<script>
export default {
  props: ["selectedTask"],

  data: function() {
    return {};
  },

  computed: {
    statusText: function() {
      return this.selectedTask.done ? "Done" : "Not done";
    }
  },

  methods: {
    onBackTap: function() {
      this.$navigateBack();
    },
    toggle: function() {
      this.selectedTask.done = !this.selectedTask.done;
    },
    onDeleteTap: function() {
      this.selectedTask.deleted = true;
    }
  }
};
</script>