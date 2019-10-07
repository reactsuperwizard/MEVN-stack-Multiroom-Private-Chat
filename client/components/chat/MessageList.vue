<template>
	<div class="chat__c-messagelist">
		<ul class="chat__messages" ref="messages" v-if="messages && messages.length">
			<transition-group name="slideDown">
				<li class="chat__message" v-for="message in messages" :key="message.id">
					<!-- Message belongs to the user -->
					<div
						class="chat__message-item u-flex-right"
						v-if="!message.admin && message.user && message.user.id === user.id"
					>
						<div class="chat__message-body">
							<div class="chat__message-content chat__message-content--right">
								<!-- <img
									v-if="message.content.includes('!!!image!!!')"
									:src="'./../public_images/upload_images/'+ message.content.substring(11)"
									alt="unknowImage"
								/>-->
								<img
									v-if="message.content.includes('!!!image!!!')"
									:src="'http://localhost:5000/public/upload/'+ message.content.substring(11)"
									alt="unknowImage"
								/>
								<span v-else>{{ message.content}}</span>
							</div>
							<div class="chat__message-details">
								<span>{{ message.user.handle }}</span>
								<span>{{ moment(message.createdAt).fromNow() }}</span>
							</div>
						</div>
						<img
							:src="(!message.user.image.includes('www.gravatar.com/avatar') ? 'http://localhost:5000/public/avatar/' : '') + message.user.image"
							alt
							class="chat__user-avatar"
						/>
					</div>
					<!-- Message belongs to the admin -->
					<div class="chat__message-item u-flex-center" v-else-if="message.admin">
						<img src="@/assets/img/icons8-businessman.svg" class="chat__user-avatar" alt />
						<div class="chat__message-body">
							<div class="chat__message-content">
								<img
									v-if="message.content.includes('!!!image!!!')"
									:src="'http://localhost:5000/public/upload/'+ message.content.substring(11)"
									alt="unknowImage"
								/>
								<span v-else>{{ message.content}}</span>
							</div>
							<div class="chat__message-details">
								<span>Admin</span>
								<span>{{ moment(message.createdAt).fromNow() }}</span>
							</div>
						</div>
					</div>

					<!-- Message has been deleted -->
					<div class="chat__message-item" v-else-if="!message.user">
						<img src="@/assets/img/icons8-account-64.png" class="chat__user-avatar" alt />

						<div class="chat__message-body">
							<div class="chat__message-content chat__message-content--left">
								<img
									v-if="message.content.includes('!!!image!!!')"
									:src="'http://localhost:5000/public/upload/'+ message.content.substring(11)"
									alt="unknowImage"
								/>
								<span v-else>{{ message.content}}</span>
							</div>
							<div class="chat__message-details">
								<span>Unknown User</span>
								<span>{{ moment(message.createdAt).fromNow() }}</span>
							</div>
						</div>
					</div>

					<!-- Message belongs to another user -->
					<div class="chat__message-item" v-else>
						<img
							:src="(!message.user.image.includes('www.gravatar.com/avatar') ? 'http://localhost:5000/public/avatar/' : '') + message.user.image"
							alt
							class="chat__user-avatar"
						/>
						<div class="chat__message-body">
							<div class="chat__message-content chat__message-content--left">
								<img
									v-if="message.content.includes('!!!image!!!')"
									:src="'http://localhost:5000/public/upload/'+ message.content.substring(11)"
									alt="unknowImage"
								/>
								<span v-else>{{ message.content}}</span>
							</div>
							<div class="chat__message-details">
								<span>{{ message.user.handle }}</span>
								<span>{{ moment(message.createdAt).fromNow() }}</span>
							</div>
						</div>
					</div>
				</li>
			</transition-group>
		</ul>
	</div>
</template>


<script>
	import { mapGetters } from "vuex";

	export default {
		name: "MessageList",
		props: ["messages"],
		computed: {
			...mapGetters(["getUserData"])
		},
		data: function() {
			return {
				user: null
			};
		},
		created() {
			this.user = this.getUserData;
		},
		methods: {
			scrollMessages() {
				var container = this.$refs.messages;
				container.scrollTop = container.scrollHeight;
			}
		},
		mounted() {
			this.scrollMessages();
		},
		updated() {
			this.scrollMessages();
		}
	};
</script>


<style lang="scss" scoped>
</style>
