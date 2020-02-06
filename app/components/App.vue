<template>
  <Page>
    <StackLayout>
      <Todolist :tasks="displayTasks" />
      <TextField v-model="newTask"></TextField>
      <Button text="Add task" @tap="addTask"></Button>
    </StackLayout>
  </Page>
</template>

<script>
import tasksData from "./../js/datas/task-data.json";
import Todolist from "./Todolist";

export default {
  components: {
    Todolist
  },

  data() {
    return {
      newTask: "",
      tasks: tasksData.tasks
    };
  },

  methods: {
    addTask() {
      this.tasks.push({
        id: this.getId,
        message: this.newTask,
        done: false
      });
      this.newTask = "";
    },
    getId() {
      const lastIndex = this.todolist.length - 1;
      return this.todolist[lastIndex].id + 1;
    }
  },

  computed: {
    displayTasks() {
      const tempTask = [
        {
          message: this.newTask
        }
      ];
      const list = this.tasks.concat(tempTask);
      return list;
    }
  }
};
</script>

<style scoped>
ActionBar {
  background-color: #53ba82;
  color: #ffffff;
}

.message {
  vertical-align: center;
  text-align: center;
  font-size: 20;
  color: #333333;
}
</style>
