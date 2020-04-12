<template>
	<Page @navigatedTo="getTasks">
		<ActionBar title="NotDoneList">
			<ActionItem text="Add" @tap="onCreateTap"></ActionItem>
		</ActionBar>

		<StackLayout>
			<Todolist :tasks="tasks" @updateTask="onUpdateTask"/>
		</StackLayout>
	</Page>
</template>

<script>
import Todolist from "./Todolist";
import TodoCreate from "./TodoCreate";
import { Couchbase, ConcurrencyMode } from 'nativescript-couchbase-plugin';
import appSettings from "tns-core-modules/application-settings";


const dbName = 'tasks';
const db = new Couchbase(dbName);

let tasks = db.query({
	select: ['_id', 'content', 'done'],
	from: dbName
});

export default {
	components: { Todolist },

	data() {
		return {
			tasks: tasks
		};
	},

	methods: {
		getTasks() {
			tasks = db.query({
				select: ['_id', 'content', 'done'],
				from: dbName
			});
			this.tasks = tasks;
		},

		onCreateTap() {
			this.$showModal(TodoCreate)
			.then(created => {
				if (created) {
					this.getTasks();
				}
			});
		},

		onUpdateTask(task) {
			db.updateDocument(task._id, {
				"content": task.content,
				"done": task.done
			});
			this.getTasks();
		}
	}
};
</script>

<style scoped>
</style>
