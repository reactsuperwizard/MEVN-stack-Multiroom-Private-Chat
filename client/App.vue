<template>
	<div id="app" class="app">
		<Navbar />
		<Particle name="particle-js" />
		<!-- <adsense data-ad-client="ca-pub-7640562161899788" data-ad-slot="7259870550">
		</adsense> -->

		<transition
			:name="transitionName"
			:enter-active-class="enterActive"
			:leave-active-class="leaveActive"
			mode="out-in"
		>
			<router-view />
		</transition>
		<notifications
			group="notification_alert"
			position="top right"
			type="success "
		/>

		<notifications
			group="notification_newMsg"
			position="top right"
			class="notification-wrapper cursor"
			style="transition: all 300ms ease 0s;"
		>
			<template slot="body" slot-scope="props">
				<div
					class="vue-notification-template vue-notification success"
					@click="onNotificationClick(props.item.title[1])"
				>
					<a class="notification-title">{{ props.item.title[0] }}</a>
					<a class="close" @click.stop="props.close">
						<ion-icon name="close" class="danger_close"></ion-icon>
					</a>
					<div v-html="props.item.text" class="notification-content"></div>
				</div>
			</template>
		</notifications>

		<Footer
			v-if="['Home', 'Login', 'Register', 'About'].includes($route.name)"
		/>
	</div>
</template>

<script>
import _ from 'lodash';

import Navbar from '@/components/layout/Navbar.vue';
import Footer from '@/components/layout/Footer.vue';
import Particle from '@/components/layout/Particle.vue';
import { eventBus } from './main.js';
import { mapActions, mapGetters } from 'vuex';
// import Ads from 'vue-google-adsense';

const DEFAULT_TRANSITION = 'fade';
const DEFAULT_ENTER_ACTIVE_CLASS = 'animated fadeIn';
const DEFAULT_LEAVE_ACTIVE_CLASS = 'animated fadeOut';

export default {
	name: 'App',
	components: {
		Navbar: Navbar,
		Particle,
		Footer,
	},
	data: function() {
		return {
			transitionName: DEFAULT_TRANSITION,
			leaveActive: DEFAULT_LEAVE_ACTIVE_CLASS,
			enterActive: DEFAULT_ENTER_ACTIVE_CLASS,
		};
	},
	computed: {
		...mapGetters(['getRoomData']),
	},
	methods: {
		onNotificationClick(id) {
			const privateRoom = this.getRoomData.find(
				room => (room.name = 'Private Room'),
			);
			this.$router
				.push({
					name: 'PrivateRoom',
					params: { id: privateRoom.id, pselectedUser: id },
				})
				.catch(err => {
					eventBus.$emit('set-user', id);
				});
		},
		resetTransition() {
			this.transitionName = DEFAULT_TRANSITION;
			this.enterActive = DEFAULT_ENTER_ACTIVE_CLASS;
			this.leaveActive = DEFAULT_LEAVE_ACTIVE_CLASS;
		},
		text_truncate: function(str, length, ending) {
			if (length == null) {
				length = 100;
			}
			if (ending == null) {
				ending = '...';
			}
			if (str.length > length) {
				return str.substring(0, length - ending.length) + ending;
			} else {
				return str;
			}
		},
	},
	created() {
		this.$router.beforeEach((to, from, next) => {
			if (!_.isEmpty(to.meta)) {
				if (to.meta.transitionName) {
					this.transitionName = to.meta.transitionName;
				}
				if (to.meta.enterActive) {
					this.enterActive = to.meta.enterActive;
				}
				if (to.meta.leaveActive) {
					this.leaveActive = to.meta.leaveActive;
				}
			}
			if (!to.meta.requiresAuth) {
				this.resetTransition();
			}
			next();
		});
	},
};
</script>

<style lang="scss">
@import '@/assets/scss/base/base.scss';
</style>
