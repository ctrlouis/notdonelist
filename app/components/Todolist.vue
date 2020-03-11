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
import { Couchbase, ConcurrencyMode } from 'nativescript-couchbase-plugin';

const dbName = 'tasks';
const db = new Couchbase(dbName);

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
	
		db.updateDocument(currentTask._id, {
			done: replaceTask.done
		});

		const index = this.tasks.findIndex(i => i._id === currentTask._id);
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
		},

		onEmit(value) {
			console.log(value);
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
