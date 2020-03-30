<template>
	<Page>
		<StackLayout>
			<Label text="Add new item"></Label>
			<TextField v-model="task" hint="I have to..."></TextField>
			<Button text="Take Picture" @tap="takePicture" />
			<Button text="Choose Picture" @tap="selectPicture" />
			<WrapLayout>
				<Image v-for="img in images" :src="img.src" width="75" height="75" />
			</WrapLayout>
			<Button text="Save" @tap="onSaveTap"></Button>
			<Button text="Cancel" @tap="onCancelTap"></Button>
		</StackLayout>
	</Page>
</template>

<script>
import axios from 'axios';
import btoa from 'btoa';
import { Couchbase, ConcurrencyMode } from 'nativescript-couchbase-plugin';
import dialogs from 'tns-core-modules/ui/dialogs';
import * as camera from "nativescript-camera";
import * as imagepicker from "nativescript-imagepicker";
import { Image } from "tns-core-modules/ui/image";
import conf from './../js/conf.json';

if (!global.btoa) global.btoa = btoa;


const dbCredName = 'credentials';
const dbCredentials = new Couchbase(dbCredName);

export default {
	data: function() {
		return {
			task: "",
			credentials: null,
			images: []
		};
	},

	methods: {
		onSaveTap() {
			const newTask = {
				content: this.task,
				type: "text"
			};

			if (this.checkForm()) {
 				this.createTask(newTask)
				.then(res => {
					console.log(res);
					this.$modal.close(true);
				})
				.catch(err => {
					console.log(err.response.request._response);
					this.$modal.close(false);
				});
			}
		},

		onCancelTap() {
			this.$modal.close(false);
		},

		checkForm() {
			let valid = true;
			if (this.task == "") {
				valid = false;
			}

			return valid;
		},

		createTask(newTask) {
			return new Promise((resolve, reject) => {
				const url = `${conf.api}/users/${this.credentials.uuid}/todos`;
				const bearerToken = {
					headers: { Authorization: `Bearer ${this.credentials.token}` }
				};
                axios.post(url, newTask, bearerToken)
				.then(res => {
					resolve(res);
				})
				.catch(err => {
					reject(err);
				});
            });
		},

		selectPicture() {

			let context = imagepicker.create({
				mode: 'multiple' 
			});

			context.authorize()
			.then(function() {
				return context.present();
			})
			.then(selection => {
				selection.forEach(selected => {
					
					console.log(JSON.stringify(selected));

					let img = new Image();
					img.src = selected;
					this.images.push(img);
				});
			}).catch(function (e) {
				console.log('error in selectPicture', e);
			});

		},
		takePicture() {
			camera.requestPermissions()
			.then(() => {
				camera.takePicture({ width: 300, height: 300, keepAspectRatio: true, saveToGallery:false })
				.then(imageAsset => {
					let img = new Image();
					img.src = imageAsset;
					this.images.push(img);
					console.log('ive got '+this.images.length+' images now.');
				})
				.catch(e => {
					console.log('error:', e);
				});
			})
			.catch(e => {
				console.log('Error requesting permission');
			});
		}
	},

	created() {
		const credentials = dbCredentials.query({
			limit: 1
		});
		this.credentials = credentials[0];
	}
};
</script>