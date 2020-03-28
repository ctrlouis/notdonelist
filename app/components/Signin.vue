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
import { Couchbase, ConcurrencyMode } from 'nativescript-couchbase-plugin';

import App from './App.vue';

if (!global.btoa) { global.btoa = btoa; }


const dbName = 'credentials';
const dbCredentials = new Couchbase(dbName);

export default {
    data: function() {
        return {
            mail: "",
            password: "",
            api: "https://api.todolist.sherpa.one"
        };
    },

    methods: {
        onSignin() {
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

                const url = `${this.api}/users/signin`;
                axios.post(url, {}, basicAuth)
                .then((result) => {
                    this.saveToken(result.data.token);
                    this.goToApp();
                })
                .catch(err => alert(err.message));
            }
        },

        checkForm() {
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

        getToken(token) {
            const credentials = dbCredentials.query({
                select: [],
                limit: 1
            });
            if (credentials.length <= 0) {
                return null;
            } else {
                return credentials[0].token;
            }
        },

        saveToken(token) {
            this.removeCredentials();
            dbCredentials.createDocument({
                "token": token
            });
        },

        removeCredentials() {
            const credentials = dbCredentials.query({
                select: []
            });
            credentials.forEach(credential => dbCredentials.deleteDocument(credential.id));
        },

        isConnected() {
            return new Promise((resolve, reject) => {
                const credentials = dbCredentials.query({
                    select: [],
                    limit: 1
                });
                resolve(credentials.length > 0);
            });
        },

        verifyToken() {
            return new Promise((resolve, reject) => {
                const url = `${this.api}/users/check-token`;
                axios.post(url, {}, )
            });
        },

        goToApp() {
            this.$navigateTo(App);
        },
    },

    created() {
        this.isConnected()
        .then(connected => {
            if (connected) this.goToApp();
        })
        .catch(err => alert(err));
    }
};
</script>

<style scoped>
</style>
