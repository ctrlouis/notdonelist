<template>
	<Page>
		<StackLayout>
			<Label text="Add new item"></Label>
			<TextField v-model="task" hint="I have to..."></TextField>
			<Button text="Save" @tap="onSaveTap"></Button>
		</StackLayout>
	</Page>
</template>

<script>
export default {
	data: function() {
		return {
			task: ""
		};
	},

	methods: {
			onSaveTap() {
				const newTask = {
					message: this.task,
					done: false,
					deleted: false
				};
				this.$modal.close(newTask);
			}
	}
};
</script>