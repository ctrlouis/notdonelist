<template>
  <Page>
    <StackLayout>
      <Button text="Go back" @tap="onBackTap"></Button>
      <Label :text="selectedTask.content"></Label>
      <Button :text="statusText" @tap="toggle"></Button>
      <Button v-if="selectedTask.done" text="Delete" @tap="onDeleteTap"></Button>
    </StackLayout>
  </Page>
</template>

<script>
import axios from 'axios';
import btoa from 'btoa';
import { Couchbase, ConcurrencyMode } from 'nativescript-couchbase-plugin';
import TodoConfirm from "./TodoConfirm";
import conf from './../js/conf.json';

if (!global.btoa) global.btoa = btoa;


const dbTaskName = 'tasks';
const dbTask = new Couchbase(dbTaskName);
const dbCredName = 'credentials';
const dbCredentials = new Couchbase(dbCredName);

export default {
  props: ["selectedTask"],

  data: function() {
    return {
      credentials: null
    };
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
      const updatedTask = {
        uuid: this.selectedTask.uuid,
        done: !this.selectedTask.done
      };
      this.updateTask(updatedTask)
      .then(task => this.selectedTask.done = task.done)
      .catch(err => alert(err));
    },

    updateTask(task) {
      return new Promise((resolve, reject) => {
        const url = `${conf.api}/users/${this.credentials.uuid}/todos/${task.uuid}`;
        const bearerToken = {
          headers: { Authorization: `Bearer ${this.credentials.token}` }
        };
        axios.patch(url, task, bearerToken)
        .then(res => resolve(res.data.todo))
        .catch(err => reject(err));
      });
    },

    onDeleteTap: function() {
      prompt({
        title: "Warning",
        message: "This task will be delete forever",
        okButtonText: "Delete",
        cancelButtonText: "Keep it"
      }).then(result => {
        if (result.result) {
          this.deleteTask(this.selectedTask.uuid)
          .then(res => this.$navigateBack())
          .catch(err => alert(err));
        }
      });
    },

    deleteTask(taskUuid) {
      return new Promise((resolve, reject) => {
        const url = `${conf.api}/users/${this.credentials.uuid}/todos/${taskUuid}`;
        console.log(url);
        const bearerToken = {
          headers: { Authorization: `Bearer ${this.credentials.token}` }
        };
        axios.delete(url, bearerToken)
        .then(res => resolve(res.data.todo))
        .catch(err => reject(err));
    });
    }
  },

  created() {
		const credentials = dbCredentials.query({
			limit: 1
		});
		this.credentials = credentials[0];
  }
};
</script>