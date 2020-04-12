<template>
	<Page>
		<StackLayout class="modal">
			<Label text="Add new item"></Label>
			<TextField v-model="task" hint="I have to..."></TextField>
			<Button text="Save" class="save" @tap="onSaveTap"></Button>
			<Button text="Cancel" class="cancel" @tap="onCancelTap"></Button>
		</StackLayout>
	</Page>
</template>

<script>
import { Couchbase, ConcurrencyMode } from 'nativescript-couchbase-plugin';
import dialogs from 'tns-core-modules/ui/dialogs';
import conf from './../js/conf.json';

const dbName = 'tasks';
const db = new Couchbase(dbName);

export default {
	data: function() {
		return {
			task: "",
			errors: []
		};
	},

	methods: {
		onSaveTap() {
			const newTask = {
				content: this.task,
				done: false
			};
			
			if (this.checkForm()) {
				db.createDocument({
					"content": newTask.content,
					"done": newTask.done
				});
				this.$modal.close(true);
			}
		},

		onCancelTap() {
			this.$modal.close(false);
		},

		checkForm() {
			let valid = true;

			if (this.task == "") {
				valid = false;
			}

			return valid;
		}
	}
};
</script>

<style lang="scss" scoped>
.modal {
	width: 100%;
	height: 60%;
}

.save {
	background-color: green;
}

.cancel {
	background-color: orange;
}
</style>