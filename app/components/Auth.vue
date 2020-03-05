<template>
  <Page>
    <StackLayout>
        <Signin v-if="account" @toggleAccount="toggleAccount"></Signin>
        <Signup v-else @toggleAccount="toggleAccount"></Signup>
    </StackLayout>
  </Page>
</template>

<script>
import Signin from "./Signin";
import Signup from "./Signup";
import appSettings from "tns-core-modules/application-settings";

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

<style scoped>

</style>
