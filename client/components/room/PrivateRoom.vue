<template>
	<div class="page page--room">
		<section class="section section--room section--mmt p-0">
			<div class="section__content u-max-height p-0">
				<div class="chat">
					<Sidebar name="userlist" ref="userList">
						<template slot="header">
							<div class="userlist__actions">
								<div>
									<ion-icon name="contacts" class="icon"></ion-icon>
								</div>
								<span class="section__title">All Users</span>
								<div @click="toggleUserList">
									<ion-icon name="backspace" class="icon"></ion-icon>
								</div>
							</div>
						</template>
						<template slot="body">
							<input
								type="text"
								class="rooms__search-input"
								placeholder="Search user by name"
								v-model.trim="searchInput"
							/>
							<ul class="chat__userlist" v-if="this.getCurrentRoom && filteredUsers">
								<transition-group name="slideDown">
									<li class="chat__user" v-for="user in filteredUsers" :key="user.id">
										<div
											:id="user.id"
											class="chat__user-item"
											v-bind:class="{
											selected: user.id == getCurrentSelect,
											blocked: user.from == 2,
											banned: user.from == 1
										}"
											@click="selectUser(`${user.id}`)"
											v-if="user.status_active"
										>
											<div class="chat__user-image">
												<img
													:src="
														(!user.image.includes('www.gravatar.com/avatar')
															? 'http://localhost:5000/public/avatar/'
															: '') + user.image
													"
													alt
													class="chat__user-avatar"
												/>
											</div>
											<div class="chat__user-details">
												<span>{{ text_truncate(user.handle, 10, '...') }}</span>
												<span v-show="newMessage.includes(user.id)">
													<img src="@/assets/img/newMsg.png" style="width:30px; height:30px; margin-left:5px;" />
												</span>
											</div>
											<!-- <div class="chat__user-checkboxs">
												<label>
													<span v-if="user.to == 2">
														<img src="@/assets/img/block.png" :title="user.handle + ' blocked you'" />
													</span>
													<span v-else-if="user.to == 1">
														<img src="@/assets/img/ban.png" :title="user.handle + ' banned you'" />
													</span>
													<span v-else>
														<img src="@/assets/img/active.png" :title="user.handle + ' actived you'" />
													</span>
												</label>
											</div>-->
											<div class="chat__user-dropupContainer">
												<div class="dropup">
													<button class="dropbtn">
														<i class="fa fa-caret-down"></i>
													</button>
													<div class="dropup-content">
														<a
															href="#"
															@click="
																user.from == 2
																	? onStatusChange(user.id, 0)
																	: onStatusChange(user.id, 2)
															"
														>
															<img src="@/assets/img/block.png" />
															<span>
																{{
																user.from == 2 ? 'Active' : 'Ignore'
																}}
															</span>
														</a>
														<!-- <a
															href="#"
															@click="
																user.from == 1
																	? onStatusChange(user.id, 0)
																	: onStatusChange(user.id, 1)
															"
														>
															<img src="@/assets/img/ban.png" />
															<span>
																{{
																user.from == 1 ? 'Unban' : 'Ban'
																}}
															</span>
														</a> -->
													</div>
												</div>
											</div>
											<!-- <div class="chat__user-checkboxs">
												<label>
													<span v-if="user.to == 2">
														<img src="@/assets/img/block.png" :title="user.handle + ' blocked you'" />
													</span>
													<span v-else-if="user.to == 1">
														<img src="@/assets/img/ban.png" :title="user.handle + ' banned you'" />
													</span>
													<span v-else>
														<img src="@/assets/img/active.png" :title="user.handle + ' actived you'" />
													</span>
												</label>
												<label class="cursor" @click="onStatusChange(user.id)">
													<span v-if="user.from == 2">
														<img src="@/assets/img/block.png" :title="'You blocked ' + user.handle" />
													</span>
													<span v-else-if="user.from == 1">
														<img
															src="@/assets/img/ban.png"
															:title="'You banned ' + user.handle + ', you will not receive notifications from this user.'"
														/>
													</span>
													<span v-else>
														<img src="@/assets/img/active.png" :title="'You actived ' + user.handle" />
													</span>
												</label>
											</div>-->
										</div>
									</li>
								</transition-group>
							</ul>
							<div style="height:100px"></div>
						</template>
						<template slot="footer">
							<button @click="leaveRoom" class="btn btn--clear btn--danger center">Leave Room</button>
						</template>
					</Sidebar>
					<div class="chat__content" v-bind:class="{ mlzero: !sidebarVisible }">
						<div class="chat__header" v-if="room">
							<span class="section__title private"># {{ room.name }}</span>
							<div class="chat__actions">
								<ion-icon name="md-log-out" @click="leaveRoom" class="icon"></ion-icon>
								<ion-icon name="md-stats" @click="viewRoomDetails" class="icon"></ion-icon>
								<ion-icon name="people" @click="toggleUserList" class="icon"></ion-icon>
							</div>
						</div>
						<MessageList :messages="messages" />
						<transition name="slideDown">
							<div class="chat__utyping" v-show="usersTyping.length > 0">
								<span>{{ getUsersTyping }}</span>
							</div>
						</transition>
						<ChatInput v-on:enterText="onEnterText()" v-if="getStatus" />
					</div>
				</div>
			</div>
			<Modal name="roomDetails" ref="roomDetails" v-if="this.getCurrentRoom && messages">
				<template slot="header">
					<h2 class="lead text-upper">Room Details: {{ this.getCurrentRoom.name }}</h2>
				</template>
				<template slot="body">
					<div class="infobox">
						<div class="infobox__item">
							<ion-icon name="planet" class="icon icon-lg"></ion-icon>
						</div>
						<div class="infobox__item">
							<span class="infobox__item--left">Online Users</span>
							<span class="infobox__item--right">
								{{
								this.getCurrentRoom.users.length
								}}
							</span>
						</div>
						<div class="infobox__item">
							<span class="infobox__item--left">Messages</span>
							<span class="infobox__item--right">{{ messages.length }}</span>
						</div>
						<div class="infobox__item">
							<span class="infobox__item--left">Created</span>
							<span class="infobox__item--right">
								{{
								moment(this.getCurrentRoom.createdAt).fromNow()
								}}
							</span>
						</div>
					</div>
				</template>
			</Modal>
		</section>
	</div>
</template>

<script>
	import axios from 'axios';
	import MessageList from '@/components/chat/MessageList.vue';
	import ChatInput from '@/components/chat/ChatInput.vue';
	import Sidebar from '@/components/layout/Sidebar.vue';
	import Modal from '@/components/layout/Modal.vue';
	import Error from '@/components/error/Error.vue';
	import { mapActions, mapGetters } from 'vuex';
	import { eventBus } from '../../main.js';

	export default {
		name: 'Room',
		props: ['pselectedUser'],
		components: {
			MessageList,
			ChatInput,
			Sidebar,
			Error,
			Modal
		},
		data: function() {
			return {
				newMessage: [],
				room: [],
				users: [],
				usersTyping: [],
				messages: [],
				newRoomName: '',
				sidebarVisible: window.innerWidth < 768 ? false : true,
				searchInput: '',
				errors: [],
				roomLeft: false,
				selectedUser: this.pselectedUser
			};
		},
		computed: {
			...mapGetters([
				'getUserData',
				'getCurrentRoom',
				'getSocket',
				'getCurrentSelect'
			]),
			filteredUsers: function() {
				return this.users
					? this.users
							.slice()
							.sort(this.sortAlphabetical)
							.filter(
								user =>
									user.username
										.toLowerCase()
										.includes(this.searchInput.toLowerCase()) &&
									user.id != this.getUserData.id
							)
					: '';
			},
			getUsersTyping() {
				if (this.usersTyping.length > 0) {
					return `${this.usersTyping.join(', ')} is typing...`;
				}
			},
			getStatus() {
				const id = this.getCurrentSelect;
				if (!id || !this.users) return true;
				const touser = this.users.find(x => x.id == id);
				return !touser || (touser.from != 2 && touser.to != 2);
			},
			isUnread(id) {
				// return this.newMessage ? this.newMessage.includes(id) : false;
			}
		},
		methods: {
			...mapActions(['saveCurrentRoom', 'saveCurrentSelect']),
			text_truncate(str, length, ending) {
				return this.$root.$children[0].text_truncate(str, length, ending);
			},
			onStatusChange(id, from) {
				const user = this.users.find(x => x.id == id);
				axios
					.post('/api/relation', { to: id, status: from })
					.then(res => {
						if (res.data.status) {
							user.from = from;
							this.getSocket.emit('statusChanged', {
								user: this.getUserData.id,
								touser: user.id,
								status: user.from
							});
						}
					})
					.catch(err => {
						console.log('err', err);
					});
			},
			onEnterText() {
				const index = this.newMessage.indexOf(Number(this.getCurrentSelect));
				if (index > -1) {
					this.newMessage.splice(index, 1);
				}
			},
			// checkUserTabs(room) {
			// 	if (
			// 		room &&
			// 		room.users.findIndex(user => {
			// 			return user.id === this.getUserData.id;
			// 		}) === -1
			// 	) {
			// 		this.$router.push({ name: "RoomList" });
			// 	}
			// },
			sortAlphabetical(a, b) {
				let userA = a.username.toUpperCase();
				let userB = b.username.toUpperCase();
				if (userA < userB) {
					return -1;
				}
				if (userA > userB) {
					return 1;
				}
				return 0;
			},
			leaveRoom(e, newPage) {
				if (e) {
					e.preventDefault();
				}
				this.roomLeft = true;
				this.$store.dispatch('saveCurrentSelect', null);
				if (!newPage) {
					this.$router.push({ name: 'RoomList' });
				}
			},
			viewRoomDetails() {
				this.$refs.roomDetails.open();
			},
			toggleUserList() {
				this.$refs.userList.toggle();
				this.sidebarVisible = !this.sidebarVisible;
			},
			selectUser(id) {
				if (id != this.getCurrentSelect) {
					const index = this.newMessage.indexOf(Number(id));
					if (index > -1) {
						this.newMessage.splice(index, 1);
					}
					const roomname = this.users.filter(obj => obj.id == id);
					this.room.name = `Chat with ${roomname[0]['handle']}`;
					axios.get(`/api/privateMsg/${id}`).then(res => {
						this.$store.dispatch('saveCurrentSelect', id);
						this.messages = res.data.message;
					});
				}
			},
			fetchUsers() {
				axios.get(`/api/user/users`).then(res => {
					this.users = res.data.users;
					// this.users = res.data.users.filter(user => user.status_active == 1);
				});
			}
		},
		created() {
			axios
				.get(`/api/room/${this.$route.params.id}`)
				.then(res => {
					this.room = res.data;
					this.users = res.data.users;
					this.$store.dispatch('saveCurrentRoom', res.data);
					/** Socket IO: User join event, get latest messages from room */
					this.getSocket.emit('userJoined', {
						room: this.getCurrentRoom,
						user: this.getUserData,
						content: `${this.getUserData.handle} joined ${this.getCurrentRoom.name}`,
						admin: true
					});

					// /** Socket IO: Received New User Event */
					// this.getSocket.on("updateRoomData", data => {
					// 	data = JSON.parse(data);
					// 	if (data.messages) {
					// 		this.messages = data.messages;
					// 	}

					// 	if (data.room) {
					// 		this.room = data.room;
					// 		this.users = data.room.users;
					// 		this.$store.dispatch("saveCurrentRoom", data.room);
					// 	}
					// });

					/** Socket IO: Reconnect User Event */
					this.getSocket.on('reconnect', () => {
						this.usersTyping = [];
						this.getSocket.emit('reconnectUser', {
							room: this.getCurrentRoom,
							user: this.getUserData
						});
					});

					this.getSocket.on('reconnected', () => {
						console.warn('Reconnected');
					});

					this.getSocket.on('disconnect', () => {
						console.warn('Disconnected');
					});

					/** Socket IO: User Exit Event - Check other tabs of the same room and redirect */
					// this.getSocket.on("receivedUserExit", room => {
					// 	this.checkUserTabs(room);
					// });
					/** Socket IO: New Messaage Event - Append the new message to the messages array */
					const _this = this;
					this.getSocket.on('receivedNewMessage', message => {
						const msg = JSON.parse(message);
						if (msg['touser'] && msg['user']) {
							const msg_sender = Number(msg['user']['id']);
							if (
								msg_sender == _this.getCurrentSelect ||
								msg_sender == _this.getUserData.id
							) {
								_this.messages.push(msg);
							}
							if (!this.newMessage.includes(msg_sender)) {
								this.newMessage.push(msg_sender);
							}
						}
					});

					/** Socket IO: Room Updated Event */
					this.getSocket.on('roomUpdated', data => {
						this.room = JSON.parse(data).room;
						this.$store.dispatch('saveCurrentRoom', JSON.parse(data).room);
					});

					this.getSocket.on('UserRegistered', data => {
						this.fetchUsers();
					});
					this.getSocket.on('userListUpdated', data => {
						this.fetchUsers();
					});
					this.getSocket.on('statusChanged', data => {
						const _data = JSON.parse(data);
						const user = this.users.find(x => x.id == _data.user);
						user.to = _data.status;
					});

					if (this.selectedUser) {
						this.selectUser(this.selectedUser);
					}
				})
				.catch(err => {
					console.log('err', err);
					if (err.response.status === 404) {
						this.$router.push({
							name: 'RoomList',
							params: {
								message: 'This room does not exist or has been deleted'
							}
						});
					}
				});
		},
		beforeDestroy() {
			if (this.getCurrentRoom && !this.roomLeft) {
				this.leaveRoom(null, true);
			}
			this.getSocket.removeListener('userJoined');
		},
		mounted() {
			eventBus.$on('set-user', id => {
				this.selectedUser = id;
				this.selectUser(this.selectedUser);
			});
		}
	};
</script>

<style lang="scss">
	@import '@/assets/scss/views/chat.scss';
	@import '@/assets/scss/components/infobox.scss';
	@import '@/assets/scss/components/form.scss';
	@import '@/assets/scss/views/rooms.scss';
</style>
