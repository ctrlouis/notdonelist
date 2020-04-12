<template>
	<StackLayout>
		<Label v-if="leftTask.length > 0" text="Left to do"></Label>
		<ListView for="task in leftTask" @itemTap="onItemTap">
			<v-template>
				<TodoItem :currentTask="task" @update="onUpdateTask"></TodoItem>
			</v-template>
		</ListView>
		<Label v-if="doneTask.length > 0">Task done</Label>
		<ListView for="task in doneTask" @itemTap="onItemTap">
			<v-template>
				<TodoItem :currentTask="task" @update="onUpdateTask"></TodoItem>
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
		onUpdateTask(updatedTask) {
			this.$emit('updateTask', updatedTask);
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
			return this.tasks.filter(task => !task.done);
		},
		doneTask() {
			return this.tasks.filter(task => task.done);
		}
	}
};
</script>

<style scoped>
Label {
	color: #512da8;
}
</style>
