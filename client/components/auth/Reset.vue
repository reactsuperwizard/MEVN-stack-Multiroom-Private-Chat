<template>
	<div class="page profile">
		<div class="section section--profile profile__content">
			<div class="section__heading mt-10">
				<span class="section__title">Update Account</span>
			</div>
			<div class="section__content">
				<form @submit.prevent="handleSubmit" class="form">
					<p class="lead">Edit Profile Details</p>
					<div class="form__input-group">
						<!-- <ion-icon name="pricetags" class="form__icon"></ion-icon> -->
						<input
							type="text"
							name="password"
							class="form__control"
							placeholder="Enter New Password"
							v-model.trim="password"
						/>
						<label for="password" class="form__label">Password</label>
					</div>
					<Error :errors="errors" />
					<div class="form__actions mt-3">
						<button type="submit" class="btn btn--clear btn--danger">
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
import Error from '../error/Error.vue';
import setAuthToken from '../../utils/authToken';
import _ from 'lodash';
import slugify from 'slugify';

export default {
	name: 'ResetPassword',
	components: {
		Error,
	},
	data: function() {
		return {
			user: {},
			password: '',
			errors: [],
		};
	},
	computed: {
		...mapGetters(['getUserData', 'isAuthorized', 'toggleAuthState']),
	},
	methods: {
		...mapActions(['saveUserData']),

		handleSubmit() {
			//see if the token is valid
			localStorage.setItem('authToken', this.$route.params.token);
			setAuthToken(this.$route.params.token);
			if (localStorage.getItem('authToken')) {
				axios
					.get(`/api/user/current`)
					.then(res => {
						this.$store.dispatch('saveUserData', res.data);
						this.user = res.data;
					})
					.catch(err => err);
			} else {
				this.user = this.getUserData;
			}
			//if valid update the password
			const updatedUserDetails = {
				password: this.password ? this.password : null,
			};

			if (localStorage.getItem('authToken')) {
				axios
					.put(`/api/user/current`, updatedUserDetails)
					.then(async res => {
						localStorage.clear();
						setAuthToken(null);
						this.$store.dispatch('toggleAuthState', false);
						this.$router.push({
							name: 'Login',
							params: {
								message: 'Password reset Successful, please login',
								pEmail: res.data.user['email'],
								pPassword: this.password,
							},
						});
					})
					.catch(err => {
						const error = { error: 'password reset failed, please try again.' };
						const [key] = Object.keys(error);
						const [value] = Object.values(error);
						this.errors.push({
							key,
							value,
						});
						console.log('err', err);
					});

				setTimeout(() => {
					this.errors = [];
				}, 1500);
			}
		},
	},
	created() {},
	mounted() {},
};
</script>

<style lang="scss">
@import '@/assets/scss/views/profile.scss';
@import '@/assets/scss/components/form.scss';
</style>
