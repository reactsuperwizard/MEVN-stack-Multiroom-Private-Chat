<template>
	<div class="page profile">
		<section class="section section--profile mt-6 profile__content">
			<div class="section__heading mt-6 mb-3">
				<span class="section__title">Dashboard</span>
			</div>
			<div class="section__content">
				<router-link
					:to="{ name: 'RoomList' }"
					class="btn btn--info mt-3 center"
					>Start Chatting!</router-link
				>
				<div class="infobox__container" v-if="user">
					<span class="lead">Your current profile</span>
					<div class="infobox__item">
						<img
							:src="
								(!user.image.includes('www.gravatar.com/avatar')
									? 'http://localhost:5000/public/avatar/'
									: '') + user.image
							"
							alt
							class="profile__image"
						/>
					</div>
					<!-- <div class="infobox__item" v-else>
            <img :src="user.social.image" alt class="profile__image" />
					</div>-->
					<div class="infobox__item">
						<span class="infobox__item--left">Display Handle</span>
						<span class="infobox__item--right">{{ user.handle }}</span>
					</div>
					<div class="infobox__item">
						<span class="infobox__item--left">Email</span>
						<span class="infobox__item--right">{{ user.email }}</span>
						<!-- <span class="infobox__item--right" v-else>{{ user.social.email }}</span> -->
					</div>
					<div class="infobox__item">
						<span class="infobox__item--left">Username</span>
						<span class="infobox__item--right">{{ user.username }}</span>
					</div>
					<div class="infobox__item">
						<span class="infobox__item--left">Age</span>
						<span class="infobox__item--right">{{
							user.age || 'Unknown'
						}}</span>
					</div>
					<div class="infobox__item">
						<span class="infobox__item--left">Gender</span>
						<span class="infobox__item--right">{{
							user.sex || 'Unknown'
						}}</span>
					</div>
					<div class="infobox__item">
						<span class="infobox__item--left">Location</span>
						<span class="infobox__item--right">{{
							user.location || 'Unknown'
						}}</span>
					</div>
					<div class="infobox__item">
						<span class="infobox__item--left">Bio</span>
						<textarea
							class="infobox__item--right"
							v-model="user.bio"
							disabled
						></textarea>
					</div>
					<div class="infobox__actions mt-3" v-if="user">
						<router-link
							:to="{ name: 'EditUserProfile', params: { handle: user.handle } }"
							class="btn btn--info"
							>Edit Profile</router-link
						>
						<a
							href="#"
							@click.prevent="handleDeleteModal"
							class="btn btn--danger"
							>Delete Account</a
						>
					</div>
				</div>
				<Modal name="deleteUser" ref="deleteUser">
					<template slot="header">
						<h2 class="text-upper">Delete Account</h2>
					</template>
					<template slot="body">
						<p class="lead">Warning: This action cannot be undone</p>
						<p class="lead mt-6">
							Are you sure you want to permanently delete your account?
						</p>
						<div class="actions mt-6">
							<a href="#" @click.prevent="handleDelete" class="btn btn--danger"
								>Yes, Delete Account</a
							>
						</div>
					</template>
				</Modal>
			</div>
		</section>
	</div>
</template>

<script>
import axios from 'axios';
import _ from 'lodash';
import { mapActions, mapGetters } from 'vuex';
import Modal from '@/components/layout/Modal.vue';

export default {
	name: 'UserProfile',
	components: {
		Modal
	},
	data: function() {
		return {
			user: null
		};
	},
	computed: {
		...mapGetters(['getUserData', 'isAuthorized', 'getSocket'])
	},
	methods: {
		...mapActions(['saveUserData', 'toggleAuthState', 'deleteUserAccount']),
		handleDeleteModal() {
			this.$refs.deleteUser.open();
		},
		handleDelete() {
			this.$refs.deleteUser.close();
			this.$store.dispatch('deleteUserAccount');
			this.getSocket.emit('UserRegistered', '');
		}
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
	}
};
</script>

<style lang="scss">
@import '@/assets/scss/views/profile.scss';
@import '@/assets/scss/components/infobox.scss';
</style>
