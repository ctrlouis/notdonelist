<template>
  <GridLayout columns="100, *">
    <Button col="0" :text="statusText" @tap="toggle"></Button>
    <Label col="1" :text="currentTask.message"></Label>
  </GridLayout>
</template>

<script>
export default {
  props: ["currentTask"],

  data: function() {
    return {};
  },

  computed: {
    statusText: function() {
      return this.currentTask.done ? "Done" : "Not done";
    }
  },

  methods: {
    toggle: function() {
      this.$emit('toggleDone', this.currentTask);
    }
  }
};
</script>