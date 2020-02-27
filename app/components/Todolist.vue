<template>
  <StackLayout>
    <ListView for="task in leftTask" @itemTap="onItemTap">
      <v-template>
        <TodoItem @toggleDone="onToggleDone" :currentTask="task"></TodoItem>
      </v-template>
    </ListView>
    <ListView for="task in doneTask" @itemTap="onItemTap">
      <v-template>
        <TodoItem @toggleDone="onToggleDone" :currentTask="task"></TodoItem>
      </v-template>
    </ListView>
  </StackLayout>
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
  },

  computed: {
    leftTask() {
      return this.tasks.filter(task => !task.done && !task.deleted);
    },
    doneTask() {
      return this.tasks.filter(task => task.done &&!task.deleted);
    },
    notDeletedTask() {
      return this.tasks.filter(task => !task.deleted);
    }
  }
};
</script>
