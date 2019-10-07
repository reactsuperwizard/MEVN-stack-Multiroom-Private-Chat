<template>
	<div class="page page--room">
		<ion-icon name="add-circle"></ion-icon>
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
								<ion-icon name="return-left" @click="leaveRoom" class="icon"></ion-icon>
								<ion-icon name="create" @click="openEditRoom" class="icon"></ion-icon>
								<ion-icon name="analytics" @click="viewRoomDetails" class="icon"></ion-icon>
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
				console.log("fe filtered", this.users);
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
				console.log(
					"chekc",
					room.users.findIndex(user => {
						return user.id === this.getUserData.id;
					})
				);
				if (
					room &&
					room.users.findIndex(user => {
						console.log(
							"user.id",
							user.id + " this.getUserData.id " + this.getUserData.id
						);
						return user.id === this.getUserData.id;
					}) === -1
				) {
					console.log("fe: u exit the room");
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
				console.log("fe: function leaveRoom");
				if (e) {
					e.preventDefault();
				}
				axios
					.post("/api/room/remove/users", {
						room_id: this.getCurrentRoom.id
					})
					.then(res => {
						console.log(
							"fe: /api/room/remove/users room data",
							res.data
						);
						this.getSocket.emit("exitRoom", {
							room: res.data,
							user: null,
							admin: true,
							content: `${this.getUserData.handle} left ${this.getCurrentRoom.name}`
						});
						this.roomLeft = true;
						if (!newPage) {
							console.log("u clicked leave room and exit");
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
			console.log("created");
			axios
				.get(`/api/room/${this.$route.params.id}`)
				.then(res => {
					console.log("fe: api room id data", res);
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
						console.log("fe:Son updateRoomData data", data);
						if (data.messages) {
							console.log(
								"fe:Son updateRoomData data Messages",
								data.messages
							);
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
						console.log("fe: reconnet");
						this.usersTyping = [];
						this.getSocket.emit("reconnectUser", {
							room: this.getCurrentRoom,
							user: this.getUserData
						});
					});

					this.getSocket.on("reconnected", () => {
						console.log("fe: reconnected");
						console.warn("Reconnected");
					});

					this.getSocket.on("disconnect", () => {
						console.log("fe: disconnect");
						console.warn("Disconnected");
					});

					/** Socket IO: User Exit Event - Update User List */
					this.getSocket.on("updateUserList", data => {
						console.log(
							"fe: updateUserList user data",
							JSON.parse(data)
						);
						this.users = JSON.parse(data);
					});

					/** Socket IO: User Exit Event - Check other tabs of the same room and redirect */
					this.getSocket.on("receivedUserExit", room => {
						console.log("fe: receivedUserExit");
						this.checkUserTabs(room);
					});

					/** Socket IO: New Messaage Event - Append the new message to the messages array */
					this.getSocket.on("receivedNewMessage", message => {
						console.log(
							"fe:Son receivedNewMessage",
							JSON.parse(message)
						);
						this.messages.push(JSON.parse(message));
					});

					/** Socket IO: User Typing Event  */
					this.getSocket.on("receivedUserTyping", data => {
						console.log("fe: receivedUserTyping");
						this.usersTyping = JSON.parse(data).filter(
							user => user !== this.getUserData.handle
						);
					});

					/** Socket IO: Room Deleted Event - Redirect all users */
					this.getSocket.on("roomDeleted", () => {
						console.log("fe: roomDeleted");
						this.$store.dispatch("saveCurrentRoom", null);
						setTimeout(() => {
							this.$router.push({ name: "RoomList" });
						}, 2000);
					});

					/** Socket IO: Room Updated Event */
					this.getSocket.on("roomUpdated", data => {
						console.log("fe: roomUpdated");
						this.room = JSON.parse(data).room;
						this.$store.dispatch(
							"saveCurrentRoom",
							JSON.parse(data).room
						);
					});
				})
				.catch(err => {
					console.log("fe Room error", err);
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
			console.log("You exit before destroy");
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
</style>
