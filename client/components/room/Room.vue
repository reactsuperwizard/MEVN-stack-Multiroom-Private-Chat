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
							<ul class="chat__userlist" v-if="this.getCurrentRoom && filteredUsers">
								<transition-group name="slideDown">
									<li class="chat__user" v-for="user in filteredUsers" :key="user.id">
										<div class="chat__user-item">
											<div class="chat__user-image">
												<img
													:src="(!user.image.includes('www.gravatar.com/avatar') ? 'http://localhost:5000/public/avatar/' : '') + user.image"
													alt
													class="chat__user-avatar"
												/>
											</div>

											<div class="chat__user-details">
												<span>{{ user.handle }}</span>
											</div>
										</div>
									</li>
								</transition-group>
							</ul>
						</template>
						<template slot="footer">
							<button @click="leaveRoom" class="btn btn--clear btn--danger center">Leave Room</button>
						</template>
					</Sidebar>
					<div class="chat__content" v-bind:class="{ mlzero: !sidebarVisible }">
						<div class="chat__header" v-if="room">
							<span class="section__title"># {{ room.name }}</span>
							<div class="chat__actions">
								<ion-icon name="md-log-out" @click="leaveRoom" class="icon"></ion-icon>
								<ion-icon v-if="room.user == this.getUserData.id" name="create" @click="openEditRoom" class="icon"></ion-icon>
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
						<ChatInput />
					</div>
				</div>
			</div>
			<Modal name="editRoom" ref="editRoom" v-if="this.getCurrentRoom">
				<template slot="header">
					<h2 class="text-upper">Edit Room: {{ this.getCurrentRoom.name }}</h2>
				</template>
				<template slot="body">
					<form @submit="handleEditRoom" slot="body" class="form form--nbs pt-3">
						<div class="form__input-group">
							<ion-icon name="pricetags" class="form__icon"></ion-icon>
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
						<Error :errors="errors" />
						<button type="submit" class="btn btn--clear btn--info">Update Room Name</button>
					</form>
				</template>
			</Modal>
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
							<span class="infobox__item--right">{{ this.getCurrentRoom.users.length }}</span>
						</div>
						<div class="infobox__item">
							<span class="infobox__item--left">Messages</span>
							<span class="infobox__item--right">{{ messages.length }}</span>
						</div>
						<div class="infobox__item">
							<span class="infobox__item--left">Created</span>
							<span class="infobox__item--right">{{ moment(this.getCurrentRoom.createdAt).fromNow() }}</span>
						</div>
					</div>
				</template>
			</Modal>
		</section>
	</div>
</template>


<script>
	import axios from "axios";
	import MessageList from "@/components/chat/MessageList.vue";
	import ChatInput from "@/components/chat/ChatInput.vue";
	import Sidebar from "@/components/layout/Sidebar.vue";
	import Modal from "@/components/layout/Modal.vue";
	import Error from "@/components/error/Error.vue";
	import { mapActions, mapGetters } from "vuex";

	export default {
		name: "Room",
		components: {
			MessageList,
			ChatInput,
			Sidebar,
			Error,
			Modal
		},
		data: function() {
			return {
				room: [],
				users: [],
				usersTyping: [],
				messages: [],
				newRoomName: "",
				sidebarVisible: window.innerWidth < 768 ? false : true,
				searchInput: "",
				errors: [],
				roomLeft: false
			};
		},
		computed: {
			...mapGetters(["getUserData", "getCurrentRoom", "getSocket"]),
			filteredUsers: function() {
				return this.users
					? this.users
							.slice()
							.sort(this.sortAlphabetical)
							.filter(user =>
								user.username
									.toLowerCase()
									.includes(this.searchInput.toLowerCase())
							)
					: "";
			},
			getUsersTyping() {
				if (this.usersTyping.length > 0) {
					return `${this.usersTyping.join(", ")} is typing...`;
				}
			}
		},
		methods: {
			...mapActions(["saveCurrentRoom"]),
			checkUserTabs(room) {
				if (
					room &&
					room.users.findIndex(user => {
						return user.id === this.getUserData.id;
					}) === -1
				) {
					this.$router.push({ name: "RoomList" });
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
					.post("/api/room/remove/users", {
						room_id: this.getCurrentRoom.id
					})
					.then(res => {
						this.getSocket.emit("exitRoom", {
							room: res.data,
							user: null,
							admin: true,
							content: `${this.getUserData.handle} left ${this.getCurrentRoom.name}`
						});
						this.roomLeft = true;
						if (!newPage) {
							this.$router.push({ name: "RoomList" });
						}
					});
			},
			openEditRoom() {
				this.$refs.editRoom.open();
			},
			handleEditRoom(e) {
				e.preventDefault();
				axios
					.post("/api/room/update/name", {
						room_name: this.getCurrentRoom.name,
						new_room_name: this.newRoomName
					})
					.then(res => {
						if (res.data.errors) {
							for (const error of res.data.errors) {
								const [key] = Object.keys(error);
								const [value] = Object.values(error);
								this.errors.push({
									key,
									value
								});
							}
						} else {
							this.$refs.editRoom.close();
							this.getSocket.emit("roomUpdateEvent", {
								oldRoomName: this.getCurrentRoom.name,
								room: res.data
							});
							this.getSocket.emit("newMessage", {
								room: this.getCurrentRoom,
								user: this.getUserData,
								admin: true,
								content: `${this.getUserData.username} updated room ${this.getCurrentRoom.name} to ${this.newRoomName}`
							});
							this.newRoomName = "";
						}

						setTimeout(() => {
							this.errors = [];
						}, 1500);
					})
					.catch(err => console.log(err));
			},
			viewRoomDetails() {
				this.$refs.roomDetails.open();
			},
			toggleUserList() {
				this.$refs.userList.toggle();
				this.sidebarVisible = !this.sidebarVisible;
			}
		},
		created() {
			axios
				.get(`/api/room/${this.$route.params.id}`)
				.then(res => {
					this.room = res.data;
					this.users = res.data.users;
					this.$store.dispatch("saveCurrentRoom", res.data);

					/** Socket IO: User join event, get latest messages from room */
					this.getSocket.emit("userJoined", {
						room: this.getCurrentRoom,
						user: this.getUserData,
						content: `${this.getUserData.handle} joined ${this.getCurrentRoom.name}`,
						admin: true
					});

					/** Socket IO: Received New User Event */
					this.getSocket.on("updateRoomData", data => {
						data = JSON.parse(data);
						if (data.messages) {
							this.messages = data.messages;
						}

						if (data.room) {
							this.room = data.room;
							this.users = data.room.users;
							this.$store.dispatch("saveCurrentRoom", data.room);
						}
					});

					/** Socket IO: Reconnect User Event */
					this.getSocket.on("reconnect", () => {
						this.usersTyping = [];
						this.getSocket.emit("reconnectUser", {
							room: this.getCurrentRoom,
							user: this.getUserData
						});
					});

					this.getSocket.on("reconnected", () => {
						console.log("Reconnected");
					});

					this.getSocket.on("disconnect", () => {
						console.log("Disconnected");
					});

					/** Socket IO: User Exit Event - Update User List */
					this.getSocket.on("updateUserList", data => {
						this.users = JSON.parse(data);
					});

					/** Socket IO: User Exit Event - Check other tabs of the same room and redirect */
					this.getSocket.on("receivedUserExit", room => {
						this.checkUserTabs(room);
					});

					/** Socket IO: New Messaage Event - Append the new message to the messages array */
					this.getSocket.on("receivedNewMessage", message => {
						const message_parsed = JSON.parse(message);
						if (message_parsed["touser"]) {
						} else {
							this.messages.push(message_parsed);
						}
					});

					/** Socket IO: Room Deleted Event - Redirect all users */
					this.getSocket.on("roomDeleted", () => {
						this.$store.dispatch("saveCurrentRoom", null);
						setTimeout(() => {
							this.$router.push({
								name: "RoomList",
								params: {
									message: "This room has been deleted"
								}
							});
						}, 2000);
					});

					/** Socket IO: Room Updated Event */
					this.getSocket.on("roomUpdated", data => {
						this.room = JSON.parse(data).room;
						this.$store.dispatch(
							"saveCurrentRoom",
							JSON.parse(data).room
						);
					});
				})
				.catch(err => {
					if (err.response.status === 404) {
						this.$router.push({
							name: "RoomList",
							params: {
								message:
									"This room does not exist or has been deleted"
							}
						});
					}
				});
		},
		beforeDestroy() {
			if (this.getCurrentRoom && !this.roomLeft) {
				this.leaveRoom(null, true);
			}
			this.getSocket.removeListener("userJoined");
		},
		mounted() {}
	};
</script>


<style lang="scss">
	@import "@/assets/scss/views/chat.scss";
	@import "@/assets/scss/components/infobox.scss";
	@import "@/assets/scss/components/form.scss";
	@import "@/assets/scss/views/rooms.scss";
</style>
