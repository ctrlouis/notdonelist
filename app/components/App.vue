<template>
  <Page>
    <ActionBar title="Todolist">
      <ActionItem text="Add" @tap="onCreateTap"></ActionItem>
    </ActionBar>
    <StackLayout>
      <Todolist :tasks="tasks" />
    </StackLayout>
  </Page>
</template>

<script>
import tasksData from "./../js/datas/task-data.json";
import Todolist from "./Todolist";
import TodoCreate from "./TodoCreate";

export default {
  components: {
    Todolist
  },

  data() {
    return {
      tasks: tasksData.tasks
    };
  },

  methods: {
    onCreateTap() {
      const newId = this.generateId();
      this.$showModal(TodoCreate, { props: { id: newId } })
        .then((newTask) => {
            if (newTask) {
                this.tasks.push(newTask);
            }
        });
    },
    generateId() {
      const lastIndex = this.tasks.length - 1;
      return this.tasks[lastIndex].id + 1;
    }
  }
};
</script>

<style scoped>
.message {
  vertical-align: center;
  text-align: center;
  font-size: 20;
  color: #333333;
}
</style>
