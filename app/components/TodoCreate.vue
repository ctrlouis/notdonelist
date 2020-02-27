<template>
  <Page>
    <StackLayout>
      <Label text="Add new item"></Label>
      <TextField v-model="newTask" hint="I have to..."></TextField>
      <Button text="Save" @tap="onSaveTap"></Button>
    </StackLayout>
  </Page>
</template>

<script>
export default {
  data: function() {
    return {
      newTask: ""
    };
  },

  methods: {
    onSaveTap: function() {
      const newTask = {
        message: this.newTask,
        done: false,
        deleted: false
      };
      this.$modal.close(newTask);
    }
  }
};
</script>