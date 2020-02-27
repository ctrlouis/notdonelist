<template>
  <Page>
    <StackLayout>
      <Button text="Go back" @tap="onBackTap"></Button>
      <Label :text="selectedTask.message"></Label>
      <Button :text="statusText" @tap="toggle"></Button>
      <Button v-if="selectedTask.done" text="Delete" @tap="onDeleteTap"></Button>
    </StackLayout>
  </Page>
</template>

<script>
import TodoConfirm from "./TodoConfirm";

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
      this.$showModal(TodoConfirm).then(confirmation => {
        if (confirmation) {
          this.selectedTask.deleted = true;
        }
      });
    }
  }
};
</script>