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
import sha1 from 'sha1';
import { Couchbase, ConcurrencyMode } from 'nativescript-couchbase-plugin';
import * as camera from "nativescript-camera";
import * as imagepicker from "nativescript-imagepicker";
import dialogs from 'tns-core-modules/ui/dialogs';
import { Image } from "tns-core-modules/ui/image";
import { isAndroid, isIOS, device, screen } from "tns-core-modules/platform";
const bghttp = require("nativescript-background-http");
const session = bghttp.session("image-upload");
const fileSystemModule = require("tns-core-modules/file-system");
import conf from './../js/conf.json';

if (!global.btoa) global.btoa = btoa;

let fs = require("file-system");

const dbCredName = 'credentials';
const dbCredentials = new Couchbase(dbCredName);

export default {
	data: function() {
		return {
			task: "",
			credentials: null,
			media: null,
			is_sending: false
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
				// this.uploadFile(this.media);
				this.upload(this.media);
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

	 	uploadFile(img) {
			let file_path = "";

 			if (isAndroid) file_path = img.src._android;
			else if (isIOS) file_path = img.src._ios;

			if (file_path === "" || file_path === undefined) {
				this.is_sending = false;
				alert("Can't find file");
				return;
			}

			const file_name = file_path.substr(file_path.lastIndexOf("/") + 1);

			const exists = fileSystemModule.File.exists(file_path);

			if (!exists) {
				this.is_sending = false;
				alert("File does not exist");
				return;
			}

			const file = fileSystemModule.File.fromPath(file_path);
			
 			const mediaType = "image";
 			const timestamp = new Date().getTime();
 			const sign = sha1(`timestamp=${timestamp}${conf.cloudinary.secret}`);
 			const url = `${conf.cloudinary.baseUrl}/${conf.cloudinary.name}/${mediaType}/upload`;
 			const data = {
 				api_key: conf.cloudinary.key,
    			resourcetype: mediaType,
				file: file_path,
    			timestamp: timestamp,
 				signature: sign
			};
			const config = {
				"Content-Type": "application/octet-stream"
			};
			console.log(file);
 			axios.post(url, data, config)
 			.then((res) => {
 				console.log(res);
 			}).catch(err => {
 				console.error(err.response.request._response);
				alert(err);
			});
		},

		upload(img) {
			const api_key = "c8e88803013ee939a3cbbc0efc550713";

			if (api_key === "") {
				this.is_sending = false;
				alert("Please set your ImgBB API key");
				return;
			}

			const url = "https://api.imgbb.com/1/upload";
			const file_size_limit = 32000000; //32MB = 32 000 000 bytes

			let file_path = "";

			if (isAndroid) file_path = img.src._android;
			else if (isIOS) file_path = img.src._ios;

			if (file_path === "" || file_path === undefined) {
				this.is_sending = false;
				alert("Can't find file");
				return;
			}

			const file_name = file_path.substr(file_path.lastIndexOf("/") + 1);

			const exists = fileSystemModule.File.exists(file_path);

			if (!exists) {
				this.is_sending = false;
				alert("File does not exist");
				return;
			}

			const file = fileSystemModule.File.fromPath(file_path);

			const file_size = file.size; //Gets the size in bytes of the file.

			if (file_size >= file_size_limit) {
				this.is_sending = false;
				alert("File size must be less than " + file_size_limit + "MB");
				return;
			}

			this.is_sending = true;

			const request = {
				url: `${url}?key=${api_key}`,
				method: "POST",
				headers: {
					"Content-Type": "application/octet-stream"
				},
				description: "Uploading " + file_name
			};

			const params = [
				{ name: "image", filename: file_path, mimeType: "image/jpeg" }
			];

			const task = session.multipartUpload(params, request);

			task.on("progress", this.progressHandler);
			task.on("error", this.errorHandler);
			task.on("responded", this.respondedHandler);
			task.on("complete", this.completeHandler);
			task.on("cancelled", this.cancelledHandler); // Android only
		},

		progressHandler(e) {
			this.totalBytes = Number(e.totalBytes);
			this.currentBytes = Number(e.currentBytes);

			if (this.currentBytes && this.totalBytes) {
				this.currentProgress = (this.currentBytes / this.totalBytes) * 100;
			}
		},
		errorHandler(e) {
			this.is_sending = false;
			console.log("received " + e.responseCode + " code.");
			alert(`An Error has occured  (Error code : "${e.responseCode}"). Image has not been uploaded !`);
			console.error(e);
		},
		respondedHandler(e) {
			this.is_sending = false;
			const result = JSON.parse(e.data);

			const uploaded_image = result.data;

			console.log(uploaded_image.url); //URL to save

			alert({
				title: "Success",
				message: `Image has been uploaded ! Here is it's url : ${uploaded_image.url}`,
				okButtonText: "OK"
			});

			const newTask = {
				text: this.task,
				type: "picture",
				media_url: uploaded_image.url
			};
			console.log(newTask);
			this.createTask(newTask)
			.then(() => {
				alert({
					title: "Success",
					message:"`Task create !",
					okButtonText: "OK"
				});
			}).catch(err => alert(err));
		},
		completeHandler(e) {
			this.is_sending = false;
			const serverResponse = e.response;
		},
		cancelledHandler(e) {
			this.is_sending = false;
			alert("upload cancelled");
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