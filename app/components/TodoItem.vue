<template>
  <GridLayout columns="100, *">
    <Label col="0" :text="statusText" @tap="toggle"></Label>
    <Label col="1" :text="currentTask.content" class="task-message" :class="isDone"></Label>
    <!-- <Button v-if="isArchived" text="Recover" @tap="recover"></Button> -->
    <!-- <Button text="Delete" @tap="onDeleteTap"></Button> -->
  </GridLayout>
</template>

<script>
import axios from 'axios';
import btoa from 'btoa';
import conf from './../js/conf.json';

if (!global.btoa) global.btoa = btoa;

export default {
  props: ["currentTask"],

  data: function() {
    return {};
  },

  methods: {
    toggle: function() {
      const updatedTask = {
        uuid: this.currentTask.uuid,
        done: !this.currentTask.done
      };
      this.updateTask(updatedTask);
    },

    updateTask(updatedTask) {
      this.$emit('update', updatedTask);
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