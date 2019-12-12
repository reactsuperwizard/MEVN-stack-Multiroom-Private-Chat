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
								<span class="section__title">Online Users</span>
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
							<ul
								class="chat__userlist"
								v-if="this.getCurrentRoom && filteredUsers"
							>
								<transition-group name="slideDown">
									<li
										class="chat__user"
										v-for="user in filteredUsers"
										:key="user.id"
									>
										<div class="chat__user-item">
											<div
												class="chat__user-image"
												:title="
													'Name : ' +
														user.username +
														'\nHandle : ' +
														user.handle +
														'\nAge : ' +
														(user.age || 'Unknown') +
														'\nSex : ' +
														(user.sex || 'Unknown') +
														'\nLocated : ' +
														(user.location || 'Unknown') +
														'\nBio : ' +
														(user.bio || 'Unknown')
												"
											>
												<img
													:src="
														(!user.image.includes('www.gravatar.com/avatar')
															? 'http://localhost:5000/public/avatar/'
															: '') + user.image
													"
													alt
													class="chat__user-avatar"
												/>
												<div v-if="room.user && room.user == user.id">
													<img
														src="@/assets/img/admin5.png"
														class="chat__user-adminBadge1"
														title="Room Admin"
													/>
												</div>
											</div>

											<div class="chat__user-details">
												<span>{{ text_truncate(user.handle, 10, '...') }}</span>
											</div>
											<div class="chat__user-dropupContainer">
												<div class="dropup">
													<button class="dropbtn">
														<i class="fa fa-caret-down"></i>
													</button>
													<div class="dropup-content" v-if="hovering">
														<a
															href="#"
															@click="onSelectPrivateMessage(user.id)"
														>
															<img src="@/assets/img/privateMsg_sidebar.png" />
															<span>Private Message</span>
														</a>
														<a href="#" @click="onStatusChange(user.id, 2)">
															<img src="@/assets/img/block.png" />
															<span>{{
																getStatus(user.id) == 2
																	? 'Active'
																	: room.user && room.user == getUserData.id
																	? 'Block'
																	: 'Ignore'
															}}</span>
														</a>
														<a
															href="#"
															v-if="room.user && room.user == getUserData.id"
															@click="
																getStatus(user.id) == 1
																	? onStatusChange(user.id, 0)
																	: onStatusChange(user.id, 1)
															"
														>
															<img src="@/assets/img/ban.png" />
															<span>{{
																getStatus(user.id) == 1 ? 'Unban' : 'Ban'
															}}</span>
														</a>
													</div>
												</div>
											</div>
										</div>
									</li>
								</transition-group>
							</ul>
							<div style="height:100px"></div>
						</template>
						<template slot="footer">
							<button
								@click="leaveRoom"
								class="btn btn--clear btn--danger center"
							>
								Leave Room
							</button>
						</template>
					</Sidebar>
					<div class="chat__content" v-bind:class="{ mlzero: !sidebarVisible }">
						<div class="chat__header" v-if="room">
							<span class="section__title"># {{ room.name }}</span>
							<div class="chat__actions">
								<ion-icon
									name="md-log-out"
									@click="leaveRoom"
									class="icon"
								></ion-icon>
								<ion-icon
									v-if="room.user && room.user == this.getUserData.id"
									name="create"
									@click="openEditRoom"
									class="icon"
								></ion-icon>
								<ion-icon
									name="md-stats"
									@click="viewRoomDetails"
									class="icon"
								></ion-icon>
								<ion-icon
									name="people"
									@click="toggleUserList"
									class="icon"
								></ion-icon>
							</div>
						</div>
						<MessageList :messages="filteredMessages" />
						<transition name="slideDown">
							<div class="chat__utyping" v-show="usersTyping.length > 0">
								<span>{{ getUsersTyping }}</span>
							</div>
						</transition>
						<ChatInput
							v-if="this.status == null || this.status != 1"
							:curUser="this.curUser"
						/>
					</div>
				</div>
			</div>
			<Modal name="editRoom" ref="editRoom" v-if="this.getCurrentRoom">
				<template slot="header">
					<h2 class="text-upper">Edit Room: {{ this.getCurrentRoom.name }}</h2>
				</template>
				<template slot="body">
					<form
						@submit.prevent="handleEditRoom"
						slot="body"
						class="form form--nbs pt-3"
						method="post"
						enctype="multipart/form-data"
						accept="image/*"
					>
						<div class="form__input-group">
							<label for="room_avatar" title="Select Room Avatar">
								<img
									:src="
										selected_url
											? selected_url
											: srv_url + this.getCurrentRoom.avatar
									"
									class="room_avatar"
								/>
							</label>
						</div>
						<div class="form__input-group">
							<!-- <ion-icon name="pricetags" class="form__icon"></ion-icon> -->
							<input
								type="text"
								name="roomName"
								class="form__control"
								placeholder="Enter New Room Name"
								pattern=".{3,20}"
								required
								v-model.trim="newRoomName"
							/>
							<label for="roomName" class="form__label">New Room name</label>
						</div>
						<div class="form__input-group">
							<input
								class="form__control"
								type="file"
								id="room_avatar"
								ref="room_avatar"
								name="room_avatar"
								@change="handleFileUpload"
								accept="image/*"
								style="display: none"
							/>
						</div>
						<Error :errors="errors" />
						<button type="submit" class="btn btn--clear btn--info">
							Update Room Name
						</button>
					</form>
				</template>
			</Modal>
			<Modal
				name="roomDetails"
				ref="roomDetails"
				v-if="this.getCurrentRoom && messages"
			>
				<template slot="header">
					<h2 class="lead text-upper">
						Room Details: {{ this.getCurrentRoom.name }}
					</h2>
				</template>
				<template slot="body">
					<div class="infobox">
						<div class="infobox__item">
							<ion-icon name="planet" class="icon icon-lg"></ion-icon>
						</div>
						<div class="infobox__item">
							<span class="infobox__item--left">Online Users</span>
							<span class="infobox__item--right">{{
								this.getCurrentRoom.users.length
							}}</span>
						</div>
						<div class="infobox__item">
							<span class="infobox__item--left">Messages</span>
							<span class="infobox__item--right">{{ messages.length }}</span>
						</div>
						<div class="infobox__item">
							<span class="infobox__item--left">Created</span>
							<span class="infobox__item--right">{{
								moment(this.getCurrentRoom.createdAt).fromNow()
							}}</span>
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
import $ from 'jquery';

export default {
	name: 'Room',
	components: {
		MessageList,
		ChatInput,
		Sidebar,
		Error,
		Modal,
	},
	data: function() {
		return {
			selected_url: null,
			room_avatar: '',
			room: [],
			status,
			users: [],
			privateRs: [],
			usersTyping: [],
			messages: [],
			newRoomName: '',
			sidebarVisible: window.innerWidth < 768 ? false : true,
			searchInput: '',
			errors: [],
			roomLeft: false,
			srv_url: 'http://localhost:5000/public/room_avatar/',
			curUser: null,
			hovering: true,
		};
	},
	computed: {
		...mapGetters([
			'getUserData',
			'getCurrentRoom',
			'getSocket',
			'getCurrentSelect',
		]),
		filteredUsers: function() {
			if (this.privateRs == null) {
				this.privateRs = [];
			}
			const block_members = this.privateRs.filter(
				privateR => privateR.status == 2,
			);
			return this.users
				? this.users
						.slice()
						.sort(this.sortAlphabetical)
						.filter(user => {
							let isActive = 1;
							if (block_members.length == 0) isActive = 1;
							if (
								block_members.find(blockMember => blockMember.touser == user.id)
							)
								isActive = 0;
							return (
								user.username
									.toLowerCase()
									.includes(this.searchInput.toLowerCase()) &&
								isActive &&
								user.id != this.getUserData.id
							);
						})
				: '';
		},
		getUsersTyping() {
			if (this.usersTyping.length > 0) {
				return `${this.usersTyping.join(', ')} is typing...`;
			}
		},
		filteredMessages: function() {
			if (this.privateRs == null) {
				this.privateRs = [];
			}
			const block_members = this.privateRs.filter(
				privateR =>
					//blocked / banned user's message won't be displayed
					(privateR.status == 2 || privateR.status == 1) &&
					//
					privateR.user == this.getUserData.id,
			);
			return this.messages.filter(message => {
				if (block_members.length == 0 || message.user == null) return true;

				const block = block_members.find(
					blockMember => blockMember.touser == message.user.id,
				);
				if (block) {
					return false;
				}
				return true;
			});
		},
	},
	methods: {
		...mapActions(['saveCurrentRoom', 'deleteRoom', 'saveCurrentSelect']),
		handleFileUpload(e) {
			this.room_avatar = this.$refs.room_avatar.files[0];
			const file = e.target.files[0];
			this.selected_url = URL.createObjectURL(file);
		},
		text_truncate(str, length, ending) {
			return this.$root.$children[0].text_truncate(str, length, ending);
		},
		getStatus(id) {
			if (!this.privateRs) {
				return 0;
			}
			const user = this.privateRs.find(privateR => privateR.touser == id);
			return user ? user.status : 0;
		},

		onStatusChange(id, from) {
			const user = this.users.find(x => x.id == id);
			if (this.getUserData.id != id) {
				if (
					this.getCurrentRoom.user &&
					this.getCurrentRoom.user == this.getUserData.id
				) {
					axios
						.post('/api/roomRelation', {
							room: this.getCurrentRoom.id,
							user: id,
							status: from,
						})
						.then(res => {
							if (res.data.status) {
								this.getSocket.emit('roomRelationChanged', {
									room: this.getCurrentRoom.id,
									user: id,
									status: from,
								});
							}
						})
						.catch(err => {
							console.log('err', err);
						});
					if (from == 2) {
						axios
							.post('/api/room/remove/users', {
								room_id: this.getCurrentRoom.id,
								user: id,
							})
							.then(res => {
								this.getSocket.emit('exitUserRoom', {
									exitUser: id,
									room: res.data,
									user: null,
									admin: true,
									content: `${user.handle} left ${this.getCurrentRoom.name}`,
								});
							});
					}
				}
				axios
					.post('/api/relation', { to: id, status: from })
					.then(res => {
						if (res.data.status) {
							const privateR = this.privateRs.find(
								privateR =>
									privateR.user == this.getUserData.id && privateR.touser == id,
							);

							if (!privateR)
								this.privateRs.push({
									user: this.getUserData.id,
									touser: id,
									status: from,
								});
							else privateR.status = from;
						}
					})
					.catch(err => {
						console.log('err', err);
					});
			}
		},
		onSelectPrivateMessage(id) {
			this.saveCurrentSelect(id);
			const user = this.users.find(x => x.id == id);
			this.curUser = user.username;
			this.hovering = false;

			const _this = this;
			setTimeout(function() {
				_this.hovering = true;
			}, 600);

			eventBus.$emit('focusOnInputField', event.target.value);
		},
		checkUserTabs(room) {
			if (
				this.getCurrentRoom &&
				room &&
				room.users &&
				room.users.findIndex(user => {
					return user.id === this.getUserData.id;
				}) === -1
			) {
				this.roomLeft = 1;
				this.$router.push({
					name: 'RoomList',
					params: {
						message: 'You are blocked by the room admin',
					},
				});
			}
		},
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
			axios
				.post('/api/room/remove/users', {
					room_id: this.getCurrentRoom.id,
				})
				.then(res => {
					this.getSocket.emit('exitRoom', {
						room: res.data,
						user: null,
						admin: true,
						content: `${this.getUserData.handle} left ${this.getCurrentRoom.name}`,
					});
					this.roomLeft = true;
					if (!newPage) {
						this.$router.push({ name: 'RoomList' });
					}
				});
		},
		openEditRoom() {
			this.$refs.editRoom.open();
		},
		handleEditRoom(e) {
			e.preventDefault();
			let formData = new FormData();

			const updatedRoomData = {
				room_name: this.getCurrentRoom.name,
				new_room_name: this.newRoomName,
				room_avatar: this.room_avatar,
			};

			for (const property in updatedRoomData) {
				if (updatedRoomData[property]) {
					formData.append(property, updatedRoomData[property]);
				}
			}

			if (localStorage.getItem('authToken')) {
				axios
					.post('/api/room/update/name', formData, {
						headers: {
							'Content-Type': 'multipart/form-data',
						},
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
							this.$refs.editRoom.close();
							this.getSocket.emit('roomUpdateEvent', {
								oldRoomName: this.getCurrentRoom.name,
								room: res.data,
							});
							this.getSocket.emit('newMessage', {
								room: this.getCurrentRoom,
								user: this.getUserData,
								admin: true,
								content: `${this.getUserData.username} updated room ${this.getCurrentRoom.name} to ${this.newRoomName}`,
							});
							this.newRoomName = '';
						}

						setTimeout(() => {
							this.errors = [];
						}, 1500);
					})
					.catch(err => console.log(err));
			}
		},
		viewRoomDetails() {
			this.$refs.roomDetails.open();
		},
		toggleUserList() {
			this.$refs.userList.toggle();
			this.sidebarVisible = !this.sidebarVisible;
		},
	},
	created() {
		this.getSocket.removeListener('receivedUserExit');
		axios
			.get(`/api/room/${this.$route.params.id}`)
			.then(res => {
				if (res.data.msg) {
					this.roomLeft = 1;
					this.$router.push({
						name: 'RoomList',
						params: {
							message: 'You are blocked by the room admin',
						},
					});
					return;
				}
				this.room = res.data;
				this.users = res.data.users;
				this.privateRs = res.data.privateRs;
				this.privateRs = this.privateRs ? this.privateRs : [];
				this.status = this.room.status;
				this.$store.dispatch('saveCurrentRoom', res.data);

				/** Socket IO: User join event, get latest messages from room */

				this.getSocket.on('roomRelationChanged', data => {
					const _data = JSON.parse(data);
					if (
						this.getUserData.id == _data.user &&
						this.getCurrentRoom &&
						!this.roomLeft
					) {
						this.room.status = _data.status;
						this.status = _data.status;
					}
				});

				this.getSocket.emit('userJoined', {
					room: this.getCurrentRoom,
					user: this.getUserData,
					content: `${this.getUserData.handle} joined ${this.getCurrentRoom.name}`,
					admin: true,
				});

				/** Socket IO: Received New User Event */
				this.getSocket.on('updateRoomData', data => {
					data = JSON.parse(data);
					if (data.messages) {
						this.messages = data.messages;
					}

					if (data.room) {
						this.room = data.room;
						// this.status = this.room.status;
						if (data.room.users) this.users = data.room.users;
						this.$store.dispatch('saveCurrentRoom', data.room);
					}
				});

				/** Socket IO: Reconnect User Event */
				this.getSocket.on('reconnect', () => {
					this.usersTyping = [];
					this.getSocket.emit('reconnectUser', {
						room: this.getCurrentRoom,
						user: this.getUserData,
					});
				});

				this.getSocket.on('reconnected', () => {
					console.log('Reconnected');
				});

				this.getSocket.on('disconnect', () => {
					console.log('Disconnected');
				});

				/** Socket IO: User Exit Event - Update User List */
				this.getSocket.on('updateUserList', data => {
					this.users = JSON.parse(data);
				});

				/** Socket IO: User Exit Event - Check other tabs of the same room and redirect */
				this.getSocket.on('receivedUserExit', data => {
					this.checkUserTabs(JSON.parse(data).room);
				});

				/** Socket IO: New Messaage Event - Append the new message to the messages array */
				this.getSocket.on('receivedNewMessage', message => {
					const message_parsed = JSON.parse(message);
					if (message_parsed['touser']) {
					} else {
						this.messages.push(message_parsed);
					}
				});

				/** Socket IO: Room Deleted Event - Redirect all users */
				this.getSocket.on('roomDeleted', () => {
					this.$store.dispatch('saveCurrentRoom', null);
					setTimeout(() => {
						this.roomLeft = true;
						this.$router.push({
							name: 'RoomList',
							params: {
								message: 'This room has been deleted',
							},
						});
					}, 2000);
				});

				/** Socket IO: Room Updated Event */
				this.getSocket.on('roomUpdated', data => {
					this.room = JSON.parse(data).room;
					// this.status = this.room.status;
					this.$store.dispatch('saveCurrentRoom', JSON.parse(data).room);
				});
			})
			.catch(err => {
				console.log('err', err);
				if (err.response.status === 404) {
					this.roomLeft = true;
					console.log('error occured and go to roomlist');
					this.$router.push({
						name: 'RoomList',
						params: {
							message: 'This room does not exist or has been deleted',
						},
					});
				}
			});
	},
	async beforeDestroy() {
		if (this.getCurrentRoom && !this.roomLeft) {
			this.leaveRoom(null, true);
		}
		this.getSocket.removeListener('userJoined');

		if (this.privateRs == null) {
			this.privateRs = [];
		}
		const block_members = this.privateRs.filter(
			privateR => privateR.status == 2,
		);
		const allowedUsers = this.room.users
			? await this.room.users.filter(user => {
					if (block_members.length == 0) return 1;
					else if (
						block_members.find(blockMember => blockMember.touser == user.id)
					)
						return 0;
					return 1;
			  })
			: '';

		if (
			this.getCurrentRoom &&
			(!this.allowedUsers || this.allowedUsers.length <= 2)
		) {
			axios.delete(`/api/room/${this.getCurrentRoom.name}`, {
				//set mark to make server check if there is no user in the room
				data: { check: 1 },
			});
			// .then(res => {
			// 	if (!res.errors) {
			// 		this.$store.dispatch("deleteRoom", res.data);
			// 		this.getSocket.emit("roomDeleted", {
			// 			room: res.data,
			// 			user: this.getUserData,
			// 			admin: true,
			// 			content: `${res.data.user.username} deleted room ${res.data.name}`
			// 		});
			// 	}
			// })
			// .catch(err => console.log(err));
		}
	},
	mounted() {
		axios
			.get(`/api/adsense/`)
			.then(res => {
				res.data.forEach(adsense => {
					$(adsense.adCode).appendTo(
						document.getElementById(adsense.destinationId),
					);
				});
			})
			.catch(err => {
				console.log('err', err);
			});
	},
};
</script>

<style lang="scss">
@import '@/assets/scss/views/chat.scss';
@import '@/assets/scss/components/infobox.scss';
@import '@/assets/scss/components/form.scss';
@import '@/assets/scss/views/rooms.scss';
</style>
