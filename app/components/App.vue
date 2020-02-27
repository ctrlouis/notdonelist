<template>
  <Page>
    <ActionBar title="Todolist">
      <ActionItem text="Add" @tap="onCreateTap"></ActionItem>
    </ActionBar>

    <StackLayout>
      <Todolist :tasks="tasks" />
      <Button text="Archived" @tap="onArchivedTap"></Button>
    </StackLayout>
  </Page>
</template>

<script>
// import tasksData from "./../js/datas/task-data.json";
import Todolist from "./Todolist";
import TodoCreate from "./TodoCreate";
import TodoArchived from "./TodoArchived";
import { Couchbase, ConcurrencyMode } from 'nativescript-couchbase-plugin';
import appSettings from "tns-core-modules/application-settings";

const dbName = 'tasks';
const db = new Couchbase(dbName);

const tasks = db.query({
  select: ['_id', 'message', 'done', 'deleted'],
  from: dbName
});

export default {
  components: {
    Todolist,
    TodoArchived
  },

  data() {
    return {
      tasks: tasks
    };
  },

  methods: {
    onCreateTap() {
      this.$showModal(TodoCreate).then(newTask => {
        db.createDocument(newTask);

        if (newTask) {
          this.tasks.unshift(newTask);
        }
      });
    },

    onArchivedTap() {
      this.$navigateTo(TodoArchived, {
        props: {
          tasks: this.tasks
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

<style scoped>
.message {
  vertical-align: center;
  text-align: center;
  font-size: 20;
  color: #333333;
}
</style>
