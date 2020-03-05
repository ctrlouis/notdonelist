<template>
    <StackLayout>
        <TextField keyboardType="email" v-model="mail" hint="Mail"></TextField>
        <TextField v-model="firstname" hint="FirstName"></TextField>
        <TextField v-model="lastname" hint="Lastname"></TextField>
        <Label :text="gender"></Label>
        <Switch v-model="switchGender" @checkedChange="toggleGender"></Switch>
        <Button text="Signup" @tap="onSignup"></Button>
        <Label text="Already have account? Signin here" @tap="$emit('toggleAccount')"></Label>
    </StackLayout>
</template>

<script>
import SignupComplete from './SignupComplete.vue';
import axios from 'axios';


export default {
  data: function() {
    return {
      mail: "",
      firstname: "",
      lastname: "",
      gender: "male"
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
      checkForm: function() {
          let error = "";
          let errors = [];
          
          const emailRegex = RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
          const nameRegex = RegExp("^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$");

          if (this.mail == "") {
              error = "Mail can't be empty.";
              errors.push(error);
          }

          if (this.firstname == "") {
              error = "Firstname can't be empty.";
              errors.push(error);
          }

          if (this.lastname == "") {
              error = "Last can't be empty.";
              errors.push(error);
          }

          if (!emailRegex.test(this.mail)) {
              error = "Use a valid adress mail";
              errors.push(error);
          }

          if (!nameRegex.test(this.firstname)) {
              error = "Use a valid firstname";
              errors.push(error);
          }

          if (!nameRegex.test(this.lastname)) {
              error = "Use a valid lastname";
              errors.push(error);
          }

          return errors;
      },
      onSignup: function() {
          const errors = this.checkForm();
          if (errors.length > 0) {
              alert(errors);
          } else {
                const newUser = {
                    firstname: this.firstname,
                    lastname: this.lastname,
                    email: this.mail,
                    gender: this.gender
                };

                const url = "https://api.todolist.sherpa.one/users/signup";
                axios.post(url, newUser)
                    .then((result) => {
                        const options = {
                            props: {
                                data: result.data
                            }
                        };
                        this.$showModal(SignupComplete, options).then(this.$emit('toggleAccount'));
                    })
                    .catch(err => alert(err.message));
          }
      }
  }
};
</script>

<style scoped>
</style>
