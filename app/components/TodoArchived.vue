<template>
  <Page>
    <Button text="Go back" @tap="onBackTap"></Button>
    <ListView v-for="task in deletedTask" @itemTap="onItemTap">
      <v-template>
        <TodoItem @toggleDone="onToggleDone" :currentTask="task"></TodoItem>
      </v-template>
    </ListView>
  </Page>
</template>

<script>
import TodoItem from "./TodoItem";

export default {
  props: ["tasks"],

  components: {
    TodoItem
  },

  methods: {
    onBackTap: function() {
      this.$navigateBack();
    }
  },

  computed: {
    deletedTask() {
      return this.tasks.filter(task => task.deleted);
    }
  }
};
</script>