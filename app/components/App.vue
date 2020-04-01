<template>
	<Page>
		<ActionBar title="NotDoneList">
			<ActionItem text="Add" @tap="onCreateTap"></ActionItem>
		</ActionBar>

		<StackLayout>
			<Todolist :tasks="tasks" @updateTask="onUpdateTask"/>
		</StackLayout>
	</Page>
</template>

<script>
import axios from 'axios';
import btoa from 'btoa';
import Auth from "./Auth";
import Todolist from "./Todolist";
import TodoCreate from "./TodoCreate";
import { Couchbase, ConcurrencyMode } from 'nativescript-couchbase-plugin';
import appSettings from "tns-core-modules/application-settings";

if (!global.btoa) global.btoa = btoa;


const dbTasksName = 'tasks';
const dbTask = new Couchbase(dbTasksName);
const dbCredName = 'credentials';
const dbCredentials = new Couchbase(dbCredName);

// const tasks = db.query({
// 	select: ['_id', 'message', 'done', 'deleted'],
// 	from: dbName
// });

export default {
	components: { Todolist },

	data() {
		return {
			tasks: [],
			credentials: null,
			api: "https://api.todolist.sherpa.one"
		};
	},

	methods: {
		getTasks() {
			this.emptyTasks();
			this.fetchTasks()
			.then(tasks => this.tasks = tasks)
			.catch(err => alert(err));
		},

		emptyTasks() {
			// while(this.tasks.length > 0) this.tasks.shift();
		},

		fetchTasks() {
			return new Promise((resolve, reject) => {
				const url = `${this.api}/users/${this.credentials.uuid}/todos`;
                const bearerToken = {
					headers: { Authorization: `Bearer ${this.credentials.token}` }
				};
                axios.get(url, bearerToken)
                .then(res => resolve(res.data.todos))
                .catch(err => reject(err));
            });
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
			this.updateTask(task)
			.then(task => this.getTasks())
			.catch(err => alert(err));
		},

		updateTask(task) {
			return new Promise((resolve, reject) => {
				const url = `${this.api}/users/${this.credentials.uuid}/todos/${task.uuid}`;
				const bearerToken = {
					headers: { Authorization: `Bearer ${this.credentials.token}` }
				};
				axios.patch(url, task, bearerToken)
				.then(res => resolve(res.data))
				.catch(err => reject(err));
			});
		},
	},

	created() {
		const credentials = dbCredentials.query({
			limit: 1
		});
		this.credentials = credentials[0];
		this.getTasks();
	}
};
</script>

<style scoped>
</style>
