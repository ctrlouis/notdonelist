<template>
  <Page actionBarHidden="true">
		<StackLayout>
			<Label text="The NotDoneList" fontWeight="bold" class="mainTitle"/>
			<Signin v-if="account" @toggleAccount="toggleAccount"></Signin>
			<Signup v-else @toggleAccount="toggleAccount"></Signup>
		</StackLayout>
  </Page>
</template>

<script>
import App from './App.vue';
import Signin from "./Signin";
import Signup from "./Signup";
import { Couchbase, ConcurrencyMode } from 'nativescript-couchbase-plugin';


const dbName = 'credentials';
const dbCredentials = new Couchbase(dbName);

export default {
	components: {
		Signin,
		Signup
	},

	data() {
		return {
			account: true
		};
	},

	methods: {
		toggleAccount() {
			this.account = !this.account;
		}
	}
};
</script>

<style>
Label {
    text-align: center;
}
StackLayout {
	padding: 0 10%;
	text-align: left;
	vertical-align: center;
}
</style>
