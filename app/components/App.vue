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
import axios from 'axios';
import btoa from 'btoa';
import Auth from "./Auth";
import Todolist from "./Todolist";
import TodoCreate from "./TodoCreate";
import TodoArchived from "./TodoArchived";
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
	components: {
		Todolist,
		TodoArchived
	},

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
			.then(tasks => {
				tasks.forEach(task => this.tasks.push(tasks));
			})
			.catch(err => alert(err));
		},

		emptyTasks() {
			while(this.tasks.length > 0) this.tasks.shift();
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
		},

		beforeCreated() {
			// if (true) {
			// 	this.$navigateTo(Auth, {
			// 		props: {},
			// 		animated: true,
			// 		transitionAndroid: {
			// 			name: "fade",
			// 			duration: 1000,
			// 			curve: "easeOut"
			// 		}
			// 	});
			// }
		}
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
.message {
	vertical-align: center;
	text-align: center;
	font-size: 20;
	color: #333333;
}
</style>
