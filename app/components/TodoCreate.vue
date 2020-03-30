<template>
	<Page>
		<StackLayout>
			<Label text="Add new item"></Label>
			<TextField v-model="task" hint="I have to..."></TextField>
			<Button text="Take Picture" @tap="takePicture" />
			<Button text="Choose Picture" @tap="selectPicture" />
			<WrapLayout v-if="media">
				<Image :src="media.src" width="75" height="75" />
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
			media: null
		};
	},

	methods: {
		onSaveTap() {
			console.log("save");
			const newTask = {
				content: this.task,
				type: "text"
			};

			if (this.media) {
				console.log("media");
				this.uploadFile(this.media);
			} else if (this.checkForm()) {
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
				mode: 'single' 
			});

			context.authorize()
			.then(() => {
				return context.present();
			})
			.then(selection => {
				selection.forEach(selected => {
					let img = new Image();
					img.src = selected;
					this.media = img;
				});
			}).catch((e) => {
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
					this.media = img;
				})
				.catch(e => {
					console.log('error:', e);
				});
			})
			.catch(e => {
				console.log('Error requesting permission');
			});
		},

		// *********** Upload file to Cloudinary ******************** //
	 	uploadFile(file) {
			const cloudName = "ctrlouis";
			const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
			const xhr = new XMLHttpRequest();
			const fd = new FormData();
			xhr.open('POST', url, true);
			xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

			// Update progress (can be used to show progress indicator)
			xhr.upload.addEventListener("progress", function(e) {
				let progress = Math.round((e.loaded * 100.0) / e.total);

				console.log(`fileuploadprogress data.loaded: ${e.loaded}, data.total: ${e.total}`);
			});

			xhr.onreadystatechange = function(e) {
				if (xhr.readyState == 4 && xhr.status == 200) {
					// File uploaded successfully
					let response = JSON.parse(xhr.responseText);
					// https://res.cloudinary.com/cloudName/image/upload/v1483481128/public_id.jpg
					let url = response.secure_url;
					// Create a thumbnail of the uploaded image, with 150px width
					let tokens = url.split('/');
					tokens.splice(-2, 0, 'w_150,c_scale');
					let img = new Image(); // HTML5 Constructor
					img.src = tokens.join('/');
					img.alt = response.public_id;
				}
			};

			fd.append('upload_preset', 'example');
			fd.append('tags', 'browser_upload'); // Optional - add tag for image admin in Cloudinary
			fd.append('file', file);
			xhr.send(fd);
		}
	},

	created() {
		const credentials = dbCredentials.query({
			limit: 1
		});
		this.credentials = credentials[0];
		console.log("wtf");
	}
};
</script>