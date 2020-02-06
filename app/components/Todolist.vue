<template>
  <ListView v-for="task in tasks">
    <v-template>
      <Todo @toggleDone="onToggleDone" :currentTask="task"></Todo>
    </v-template>
  </ListView>
</template>

<script>
import Todo from "./Todo";

export default {
  components: {
    Todo
  },

  props: ["tasks"],

  methods: {
      onToggleDone(currentTask) {
        //   currentTask.done = !currentTask.done;
        const replaceTask = Object.assign(currentTask, { done: !currentTask.done });

        const index = this.tasks.findIndex(i => i.id === currentTask.id);

        this.tasks = Object.assign([], this.tasks, { index: replaceTask });
      }
  }
};
</script>