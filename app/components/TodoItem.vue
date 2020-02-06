<template>
  <GridLayout columns="100, *">
    <Label col="0" :text="statusText" @tap="toggle"></Label>
    <Label col="1" :text="currentTask.message" class="task-message" :class="isDone"></Label>
    <!-- <Button v-if="isArchived" text="Recover" @tap="recover"></Button> -->
    <!-- <Button text="Delete" @tap="onDeleteTap"></Button> -->
  </GridLayout>
</template>

<script>
export default {
  props: ["currentTask"],

  data: function() {
    return {};
  },

  methods: {
    toggle: function() {
      this.$emit("toggleDone", this.currentTask);
    }
  },

  computed: {
    statusText: function() {
      return this.currentTask.done ? "Done" : "Not done";
    },

    isDone: function() {
      if (this.currentTask.done) {
        return "done";
      }

      return "";
    },

    isArchived: function() {
      return this.currentTask.deleted;
    }
  }
};
</script>

<style lang="scss" scoped>
.task-message {
  animation-name: show;
  animation-duration: 4s;
  animation-fill-mode: forwards;
}

@keyframes show {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.done {
  text-decoration: line-through;
}
</style>