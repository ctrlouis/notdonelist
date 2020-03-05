<template>
    <StackLayout>
        <TextField v-model="mail" hint="Mail"></TextField>
        <TextField v-model="firstname" hint="FirstName"></TextField>
        <TextField v-model="lastname" hint="Lastname"></TextField>
        <Label :text="gender"></Label>
        <Switch v-model="switchGender"></Switch>
        <TextField v-model="password" hint="Password"></TextField>
        <TextField v-model="confPassword" hint="Confirm password"></TextField>
        <Button text="Signup" @tap="onSignup"></Button>
        <Label text="Already have account? Signup here" @tap="$emit('toggleAccount')"></Label>
    </StackLayout>
</template>

<script>
export default {
  data: function() {
    return {
      mail: "",
      firstname: "",
      lastname: "",
      gender: "male",
      password: "",
      confPassword: ""
    };
  },

  methods: {
      toggleGender: function() {
          if (this.gender == "male") {
              this.gender = "female"
          } else {
              this.gender = "male"
          }
      },
      onSignup: function() {

      }
  },

  computed: {

  }
};
</script>

<style scoped>
</style>
