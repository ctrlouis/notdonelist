<template>
  <ListView v-for="task in tasks" @itemTap="onItemTap">
    <v-template>
      <TodoItem @toggleDone="onToggleDone" :currentTask="task"></TodoItem>
    </v-template>
  </ListView>
</template>

<script>
import TodoItem from "./TodoItem";
import TodoDetails from "./TodoDetails";

export default {
  components: {
    TodoItem,
    TodoDetails
  },

  props: ["tasks"],

  methods: {
    onToggleDone(currentTask) {
      //   currentTask.done = !currentTask.done;
      const replaceTask = Object.assign(currentTask, {
        done: !currentTask.done
      });

      const index = this.tasks.findIndex(i => i.id === currentTask.id);

      this.tasks = Object.assign([], this.tasks, { index: replaceTask });
    },

    onItemTap(task) {
      this.$navigateTo(TodoDetails, {
        props: {
          selectedTask: task.item
        },
        animated: true,
        transitionAndroid: {
          name: "explode",
          duration: 1000,
          curve: "easeOut"
        }
      });
    }
  }
};
</script>