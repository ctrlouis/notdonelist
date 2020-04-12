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
import { Couchbase, ConcurrencyMode } from 'nativescript-couchbase-plugin';
import TodoConfirm from "./TodoConfirm";
import { Image } from "tns-core-modules/ui/image";
import conf from './../js/conf.json';


const dbName = 'tasks';
const db = new Couchbase(dbName);

export default {
  props: ["selectedTask"],

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
      db.updateDocument(this.selectedTask._id, {
				"content": this.selectedTask.content,
				"done": !this.selectedTask.done
      });
      this.selectedTask.done = !this.selectedTask.done;
    },

    onDeleteTap: function() {
      db.deleteDocument(this.selectedTask._id);
      this.$navigateBack();
    }
  }
};
</script>