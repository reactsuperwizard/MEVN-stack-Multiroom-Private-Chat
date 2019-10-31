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
												<span>{{ text_truncate(user.handle, 10, '...') }}</span>
											</div>
											<div class="chat__user-checkboxs">
												<label class="cursor">
													<span>
														<img
															src="@/assets/img/block.png"
															:title="'You blocked ' + user.handle"
															v-bind:class="{chkselected:getStatus(user.id) == 2}"
															@click="onStatusChange(user.id, 2)"
														/>
													</span>
													<span>
														<img
															src="@/assets/img/ban.png"
															:title="'You banned ' + user.handle + ', you will not receive notifications from this user.'"
															v-bind:class="{chkselected:getStatus(user.id) == 1}"
															@click="onStatusChange(user.id, 1)"
														/>
													</span>
													<span>
														<img
															src="@/assets/img/active.png"
															:title="'You actived ' + user.handle"
															v-bind:class="{chkselected: getStatus(user.id) == 0}"
															@click="onStatusChange(user.id, 0)"
														/>
													</span>
												</label>
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
								<ion-icon
									v-if="room.user && room.user == this.getUserData.id"
									name="create"
									@click="openEditRoom"
									class="icon"
								></ion-icon>
								<ion-icon name="md-stats" @click="viewRoomDetails" class="icon"></ion-icon>
								<ion-icon name="people" @click="toggleUserList" class="icon"></ion-icon>
							</div>
						</div>
						<MessageList :messages="filteredMessages" />
						<transition name="slideDown">
							<div class="chat__utyping" v-show="usersTyping.length > 0">
								<span>{{ getUsersTyping }}</span>
							</div>
						</transition>
						<ChatInput v-if="this.status==null || this.status != 1" />
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
				status,
				users: [],
				privateRs: [],
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
				if (this.privateRs == null) {
					this.privateRs = [];
				}
				const block_members = this.privateRs.filter(
					privateR => privateR.status == 2
				);
				return this.users
					? this.users
							.slice()
							.sort(this.sortAlphabetical)
							.filter(user => {
								let isActive = 1;
								if (block_members.length == 0) isActive = 1;
								if (
									block_members.find(
										blockMember => blockMember.touser == user.id
									)
								)
									isActive = 0;
								return (
									user.username
										.toLowerCase()
										.includes(this.searchInput.toLowerCase()) &&
									isActive
								);
							})
					: "";
			},
			getUsersTyping() {
				if (this.usersTyping.length > 0) {
					return `${this.usersTyping.join(", ")} is typing...`;
				}
			},
			filteredMessages: function() {
				if (this.privateRs == null) {
					this.privateRs = [];
				}
				const block_members = this.privateRs.filter(
					privateR =>
						privateR.status == 2 && privateR.user == this.getUserData.id
				);
				return this.messages.filter(message => {
					if (block_members.length == 0 || message.user == null)
						return true;

					const block = block_members.find(
						blockMember => blockMember.touser == message.user.id
					);
					if (block) {
						return false;
					}
					return true;
				});
			}
		},
		methods: {
			...mapActions(["saveCurrentRoom"]),
			text_truncate(str, length, ending) {
				return this.$root.$children[0].text_truncate(str, length, ending);
			},
			getStatus(id) {
				console.log("gettingn Status ", id, this.privateRs);
				if (!this.privateRs) {
					console.log("_______________0", id);
					return 0;
				}
				const user = this.privateRs.find(privateR => privateR.touser == id);
				console.log("_______________", user ? user.status : 0, id);
				return user ? user.status : 0;
			},
			FfilteredUsers: function() {
				return this.users
					? this.users
							.slice()
							.sort(this.sortAlphabetical)
							.filter(user => {
								console.log("filter", user.from);
								return (
									user.username
										.toLowerCase()
										.includes(this.searchInput.toLowerCase()) &&
									user.from != 2
								);
							})
					: "";
			},

			onStatusChange(id, from) {
				const user = this.users.find(x => x.id == id);
				if (this.getUserData.id != id) {
					if (
						this.getCurrentRoom.user &&
						this.getCurrentRoom.user == this.getUserData.id
					) {
						axios
							.post("/api/roomRelation", {
								room: this.getCurrentRoom.id,
								user: id,
								status: from
							})
							.then(res => {
								if (res.data.status) {
									this.getSocket.emit("roomRelationChanged", {
										room: this.getCurrentRoom.id,
										user: id,
										status: from
									});
									console.log("status change", user);
								}
							})
							.catch(err => {
								console.log("err", err);
							});
					}
					axios
						.post("/api/relation", { to: id, status: from })
						.then(res => {
							if (res.data.status) {
								this.users = this.FfilteredUsers();
								const privateR = this.privateRs.find(
									privateR =>
										privateR.user == this.getUserData.id &&
										privateR.touser == id
								);

								if (!privateR)
									this.privateRs.push({
										user: this.getUserData.id,
										touser: id,
										status: 2
									});
								else privateR.status = from;
							}
						})
						.catch(err => {
							console.log("err", err);
						});
				}
			},
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
						console.log("leave room", res.data);
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
					if (res.data.msg) {
						this.roomLeft = 1;
						setTimeout(() => {
							this.$router.push({
								name: "RoomList",
								params: {
									message: "You are blocked by the room admin"
								}
							});
						}, 0);
						return;
					}
					this.room = res.data;
					this.users = res.data.users;
					this.privateRs = res.data.privateRs;
					this.privateRs = this.privateRs ? this.privateRs : [];
					this.users = this.FfilteredUsers();
					this.status = this.room.status;
					console.log(
						"created and saveCurrentRoom",
						this.privateRs,
						res.data
					);
					this.$store.dispatch("saveCurrentRoom", res.data);

					/** Socket IO: User join event, get latest messages from room */

					this.getSocket.on("roomRelationChanged", data => {
						const _data = JSON.parse(data);
						console.log(this.getUserData.id, _data.user, _data.status);
						if (
							this.getUserData.id == _data.user &&
							this.getCurrentRoom &&
							!this.roomLeft
						) {
							console.log("roomRelation Changed", _data.status);
							this.room.status = _data.status;
							this.status = _data.status;
							if (_data.status == 2) {
								this.leaveRoom();
								return;
							}
						}
					});

					console.log("user Joined Emitting", this.getCurrentRoom);
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
							// this.status = this.room.status;
							this.users = data.room.users;
							console.log("son updateRoomData", data.room.users);
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
						console.log("updateUserList", this.users);
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
						// this.status = this.room.status;
						this.$store.dispatch(
							"saveCurrentRoom",
							JSON.parse(data).room
						);
					});
				})
				.catch(err => {
					console.log("err", err);
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
