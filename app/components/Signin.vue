<template>
    <StackLayout>
        <TextField keyboardType="email" v-model="mail" hint="Email"></TextField>
        <TextField secure="true" v-model="password" hint="Passsword"></TextField>
        <Button text="Signin" @tap="onSignin"></Button>
        <Label text="No account? Create one!" @tap="$emit('toggleAccount')"></Label>
    </StackLayout>
</template>

<script>
import axios from 'axios';
import btoa from 'btoa';

if (!global.btoa) {
    global.btoa = btoa;
}

export default {
  data: function() {
    return {
      mail: "",
      password: "",
    };
  },

  methods: {
    checkForm: function() {
          let error = "";
          let errors = [];
          
          const emailRegex = RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);

          if (this.mail == "") {
              error = "Mail can't be empty.";
              errors.push(error);
          }

          if (!emailRegex.test(this.mail)) {
              error = "Use a valid adress mail";
              errors.push(error);
          }

          return errors;
      },
      onSignin: function() {
          const errors = this.checkForm();
          if (errors.length > 0) {
              alert(errors);
          } else {
                const basicAuth = {
                    auth: {
                        username: this.mail,
                        password: this.password
                    }
                };

                const url = "https://api.todolist.sherpa.one/users/signin";
                axios.post(url, {}, basicAuth)
                    .then((result) => {
                        alert(result.data.token);
                    })
                    .catch(err => alert(err.message));
          }
      }
  }
};
</script>

<style scoped>
</style>
