<template>
    <StackLayout>
        <TextField v-model="username" hint="Username"></TextField>
        <TextField v-model="password" hint="Passsword"></TextField>
        <Button text="Signin" @tap="onSignin"></Button>
        <Label text="No account? Create one!" @tap="$emit('toggleAccount')"></Label>
    </StackLayout>
</template>

<script>
export default {
  data: function() {
    return {
      username: "",
      password: "",
    };
  },

  methods: {
    onSignin: function() {
        
    }
  }
};
</script>

<style scoped>
</style>
