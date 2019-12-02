<template>
	<div class="page login">
		<section class="section section__landing">
			<div class="section__heading">
				<span class="section__title">Forgot Password?</span>
			</div>
			<div class="section__content">
				<Error :errorMessage="errorMessage" />
				<p class="section__lead">Welcome Back!</p>
				<div class="social">
					<!-- <OAuth
                        provider="facebook"
                        icon="logo-facebook"
                        classes="social__item--facebook"
                    />
          <OAuth provider="google" icon="logo-googleplus" classes="social__item--google" />-->
				</div>
				<form @submit.prevent="handleSubmit" class="form">
					<span class="form__lead">
						<ion-icon name="rocket" class="icon"></ion-icon>Please enter your
						email address to reset your password
					</span>
					<br />
					<div class="form__input-group">
						<!-- <ion-icon name="person" class="form__icon"></ion-icon> -->
						<input
							type="email"
							name="email"
							class="form__control"
							placeholder="Enter Email"
							required
							v-model.trim="email"
						/>
						<label for="email" class="form__label">Email</label>
					</div>
					<Error :errors="errors" />
					<button type="submit" class="form__submit">Send Mail</button>
				</form>
			</div>
		</section>
	</div>
</template>

<script>
import axios from 'axios';
import Error from '../error/Error.vue';
// import OAuth from '../social/OAuth.vue';
import { mapActions } from 'vuex';
import setAuthToken from '../../utils/authToken';

export default {
	name: 'ForgotPassword',
	props: ['message'],
	components: {
		Error,
		// OAuth
	},
	data: function() {
		return {
			email: '',
			errorMessage: this.message,
			errors: [],
		};
	},
	methods: {
		...mapActions(['saveUserData']),

		handleSubmit() {
			this.errors = [];
			if (this.email) {
				axios
					.post('/api/auth/forgot', {
						email: this.email,
					})
					.then(res => {
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
							// localStorage.setItem("authToken", res.data.token);
							// this.$store.dispatch("toggleAuthState", false);
							// this.$store.dispatch("saveUserData", res.data.user);
							// setAuthToken(res.data.token);
							// this.$router.push({
							//   name: "ResetPassword",
							//   params: { handle: res.data.user.email }
							// });
						}
					});
			}

			setTimeout(() => {
				this.errors = [];
			}, 1500);
		},
	},
	mounted() {
		if (this.errorMessage) {
			setTimeout(() => {
				this.errorMessage = '';
			}, 1500);
		}
	},
};
</script>

<style lang="scss">
@import '@/assets/scss/components/form.scss';
</style>
