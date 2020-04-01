<template>
    <StackLayout>
        <TextField keyboardType="email" v-model="mail" hint="Mail"></TextField>
        <TextField v-model="firstname" hint="FirstName"></TextField>
        <TextField v-model="lastname" hint="Lastname"></TextField>
        <FlexboxLayout justifyContent="center">
            <Button text="Male" class="gender" :class="maleSelected" @tap="selectMale"></Button>
            <Button text="Female" class="gender" :class="femaleSelected" @tap="selectFemale"></Button>
        </FlexboxLayout>
        <Button text="Signup" @tap="onSignup"></Button>
        <Label text="Already have account? Signin here" class="link" @tap="$emit('toggleAccount')"></Label>
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
            gender: null
        };
    },

    methods: {
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
                        .catch(err => {
                            const errorDetails = err.response.request._response;
                            console.log(errorDetails);
                            alert({
                                title: "Error",
                                message: "Mail already used.",
                                okButtonText: "Ok"
                            });
                        });
            }
        },

        selectMale() {
            this.gender = 'male';
        },

        selectFemale() {
            this.gender = 'female';
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

            if (!this.gender) {
                error = "Select a gender";
                errors.push(error);
            }

            return errors;
        }
    },

    computed: {
        maleSelected() {
            if (this.gender == 'male') {
                return 'male';
            } else {
                return 'gender';
            }
        },

        femaleSelected() {
            if (this.gender == 'female') {
                return 'female';
            } else {
                return 'gender';
            }
        }
    }
};
</script>

<style scoped>
.gender {
    background-color: darkgray;
    color: black;
}

.male {
    background-color: magenta;
    color: white;
}

.female {
    background-color: aqua;
    color: white;
}
</style>
