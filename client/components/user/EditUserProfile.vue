<template>
	<div class="page profile">
		<div class="section section--profile profile__content">
			<div class="section__content">
				<form
					@submit.prevent="handleSubmit"
					class="form"
					method="post"
					enctype="multipart/form-data"
					accept="image/*"
				>
					<p class="lead">Edit Profile Details</p>
					<div class="profile__item">
						<label for="image">
							<img
								v-if="selected_url"
								:src="selected_url"
								class="profile__image"
							/>
							<img
								v-else
								:src="
									(!user.image.includes('www.gravatar.com/avatar')
										? 'http://localhost:5000/public/avatar/'
										: '') + user.image
								"
								alt="No picture, please select"
								class="profile__image"
							/>
						</label>
						<input
							class="form__control"
							type="file"
							id="image"
							ref="image"
							name="image"
							accept="image/*"
							@change="handleFileUpload"
							style="display: none;"
						/>
					</div>
					<br />
					<div class="form__input-group">
						<input
							type="text"
							name="handle"
							class="form__control"
							placeholder="Enter New Handle"
							v-model.trim="handle"
						/>
						<label for="username" class="form__label">Display Handle</label>
					</div>
					<div class="form__input-group">
						<select
							class="form__control"
							v-model="age"
							name="age"
							id="age"
							placeholder="How old are you"
						>
							<option
								v-for="ageOp in 30"
								:value="ageOp + 13"
								v-bind:key="ageOp + 13"
								>{{ ageOp + 13 }}</option
							>
						</select>
						<label for="age" class="form__label">Age</label>
					</div>
					<div class="form__input-group">
						<select
							class="form__control"
							v-model="sex"
							name="sex"
							id="sex"
							placeholder="Gender"
							style="font-size:18px; padding:8px 0px 8px 10px;"
						>
							<option value="male" class="padding_5">male</option>
							<option value="female" class="padding_5">female</option>
						</select>

						<label for="sex" class="form__label">Gender</label>
					</div>
					<div class="form__input-group">
						<input
							type="location"
							name="location"
							class="form__control"
							placeholder="Enter New Location"
							v-model.trim="location"
						/>
						<label for="location" class="form__label">Location</label>
					</div>
					<div class="form__input-group">
						<textarea
							name="bio"
							class="form__control"
							placeholder="Tell us more about yourself"
							v-model.trim="bio"
						></textarea>
					</div>
					<Error :errors="errors" />
					<div class="form__actions mt-3">
						<a @click="handleBackBtn" class="btn btn--info">Back</a>
						<button type="submit" class="btn btn--clear btn--info">
							Update Account
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
import axios from 'axios';
import { mapActions, mapGetters } from 'vuex';
import _ from 'lodash';
import slugify from 'arslugify';
import Error from '../error/Error.vue';

export default {
	name: 'EditUserProfile',
	components: {
		Error,
	},
	data: function() {
		return {
			selected_url: null,
			image: '',
			user: {},
			//   email: "",
			handle: '',
			location: '',
			age: '',
			sex: '',
			bio: '',
			errors: [],
		};
	},
	computed: {
		...mapGetters(['getUserData', 'isAuthorized', 'getSocket']),
	},
	methods: {
		...mapActions(['saveUserData']),

		handleFileUpload(e) {
			this.image = this.$refs.image.files[0];
			const file = e.target.files[0];
			this.selected_url = URL.createObjectURL(file);
		},
		handleBackBtn() {
			this.$router.go(-1);
		},
		checkFields() {
			if (this.handle === this.getUserData.handle) {
				return true;
			}
		},
		handleSubmit() {
			let formData = new FormData();
			const updatedUserDetails = {
				handle:
					this.handle === this.getUserData.handle ? null : slugify(this.handle),
				// email: this.email === this.getUserData.email ? null : this.email,
				age: this.age === this.getUserData.age ? null : this.age,
				sex: this.sex === this.getUserData.sex ? null : this.sex,
				location:
					this.location === this.getUserData.location ? null : this.location,
				bio: this.bio === this.getUserData.bio ? null : this.bio,
				image: this.image === this.getUserData.image ? null : this.image,
			};

			for (const property in updatedUserDetails) {
				if (updatedUserDetails[property]) {
					formData.append(property, updatedUserDetails[property]);
				}
			}

			if (localStorage.getItem('authToken')) {
				axios
					.put(`/api/user/current`, formData, {
						headers: {
							'Content-Type': 'multipart/form-data',
						},
					})
					.then(async res => {
						if (res.data.errors) {
							for (const error of res.data.errors) {
								const [key] = Object.keys(error);
								const [value] = Object.values(error);
								this.errors.push({
									key,
									value,
								});
							}
						} else {
							await this.$store.dispatch('saveUserData', res.data.user);
							this.user = res.data.user;
							this.getSocket.emit('userEdited', res.data.user);
							this.$router.push({
								name: 'UserProfile',
								params: {
									handle:
										updatedUserDetails.handle === null
											? this.getUserData.handle
											: updatedUserDetails.handle,
								},
							});
							this.$notify({
								group: 'notification_alert',
								title: 'New Alert',
								text: 'Update Successful',
								type: 'success ',
								duration: 10000,
							});
							return;
						}
					})
					.catch(err => console.log(err));

				setTimeout(() => {
					this.errors = [];
				}, 1500);
			}
		},
	},
	created() {
		if (localStorage.getItem('authToken') && _.isEmpty(this.getUserData)) {
			axios
				.get(`/api/user/current`)
				.then(res => {
					this.$store.dispatch('saveUserData', res.data);
					this.$store.dispatch('toggleAuthState', true);
					this.user = res.data;
				})
				.catch(err => err);
		} else {
			this.user = this.getUserData;
		}
		/** Assign model values */
		for (let key of Object.keys(this.$data)) {
			if (this.getUserData[key]) {
				this.$data[key] = this.getUserData[key];
			}
		}
	},
	mounted() {},
};
</script>

<style lang="scss">
@import '@/assets/scss/views/profile.scss';
@import '@/assets/scss/components/form.scss';
</style>
