<template>
	<div class="page roomList">
		<section class="section section--mmt mb-3">
			<div class="section__heading mt-6">
				<span class="section__title">Room List</span>
			</div>
			<div class="section__content">
				<Error :errorMessage="errorMessage" />
				<p class="section__lead">Enter a room and start chatting!</p>
				<div class="rooms" v-if="rooms">
					<div class="rooms__header">
						<div class="rooms__details">
							<div class="rooms__details-item">
								Total Rooms:
								<span class="badge badge--info">{{ rooms.length }}</span>
							</div>
							<div class="rooms__details-item">
								Online Users:
								<span class="badge badge--info">{{ online }}</span>
							</div>
						</div>
						<input
							type="text"
							class="rooms__search-input"
							placeholder="Search"
							v-model.trim="searchInput"
						/>
					</div>
					<transition name="slideDown">
						<ul class="rooms__list">
							<transition-group name="slideUp" v-if="filteredRooms.length > 0">
								<li
									v-for="room in filteredRooms"
									:key="room.id"
									class="rooms__list-item"
								>
									<a
										:href="`room/${room.id}`"
										class="rooms__list-item-link"
										@click.prevent="handleRoomClick(room)"
									>
										<div class="rooms__item-container">
											<div class="rooms__item-avatar">
												<img :src="srv_url + room.avatar" />
											</div>
											<div class="rooms__item-details">
												<p>{{ room.name }}</p>
												<p v-if="!room.access" class="private_name">Private</p>
												<p v-else>
													<strong>Users:</strong>
													{{ room.users }}
												</p>
												<p>
													<strong>
														{{ room.access === true ? 'Room Admin:' : '' }}
													</strong>
													{{
														room.access === false
															? 'Your private chat room'
															: room.name == 'HOME'
															? 'ADMIN'
															: room.user
															? room.user.username
															: 'Unknown User'
													}}
												</p>
											</div>
											<div class="rooms__item-actions">
												<div
													v-show="room.user && getUserData.id === room.user.id"
													class="rooms__item-action"
												>
													<a
														@click.stop="handleDelete"
														:name="room.name"
														class="btn btn--danger"
														>Delete</a
													>
												</div>
											</div>
										</div>
									</a>
								</li>
							</transition-group>
							<span v-else>No Rooms</span>
						</ul>
					</transition>
					<!-- Private Room Enter Modal -->
					<Modal name="private-room" ref="privateRoom">
						<template slot="header">
							<h2 class="text-upper">
								Enter {{ this.privateRoomName || 'Private Room' }}
							</h2>
						</template>
						<template slot="body">
							<form
								@submit="handlePrivateRoomCheck"
								slot="body"
								class="form form--nbs pt-3"
							>
								<div class="form__input-group">
									<!-- <ion-icon name="key" class="form__icon"></ion-icon> -->
									<input
										type="password"
										name="password"
										class="form__control"
										placeholder="Enter Password"
										v-model.trim="privateRoomPassword"
									/>
									<label for="password" class="form__label">Password</label>
								</div>
								<Error :errors="errors" />
								<button type="submit" class="btn btn--clear btn--info">
									Enter Room
								</button>
							</form>
						</template>
					</Modal>
					<!-- Create Room Modal -->
					<Modal name="create-room" ref="createRoom">
						<template slot="header">
							<h2 class="text-upper">Create Room</h2>
						</template>
						<template slot="body">
							<form
								@submit.prevent="handleCreateRoom"
								slot="body"
								class="form form--nbs pt-3"
								method="post"
								enctype="multipart/form-data"
							>
								<div class="form__input-group">
									<label for="room_avatar" title="Select Room Avatar">
										<img
											:src="
												selected_url
													? selected_url
													: srv_url + 'defaultRoom.png'
											"
											class="room_avatar"
										/>
									</label>
								</div>
								<div class="form__input-group">
									<!-- <ion-icon name="list-box" class="form__icon"></ion-icon> -->
									<input
										type="text"
										name="room_name"
										class="form__control"
										placeholder="Enter Room Name"
										v-model.trim="room_name"
									/>
									<label for="room_name" class="form__label">Room Name</label>
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
								<button type="submit" class="btn btn--clear btn--danger">
									Create Room
								</button>
							</form>
						</template>
					</Modal>
					<div class="rooms__actions">
						<a @click="openModal" class="btn btn--info">Create Room</a>
						<a @click="fetchRoomData" class="btn btn--info">Refresh Rooms</a>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>

<script>
import axios from 'axios';
import Modal from '@/components/layout/Modal';
import { mapActions, mapGetters } from 'vuex';
import Error from '@/components/error/Error.vue';

export default {
	name: 'RoomList',
	props: ['message'],
	components: {
		Modal: Modal,
		Error,
	},
	data: function() {
		return {
			selected_url: null,
			rooms: [],
			online: 0,
			room_name: null,
			room_avatar: '',
			privateRoomName: null,
			password: null,
			privateRoomPassword: null,
			searchInput: '',
			errorMessage: this.message,
			errors: [],
			srv_url: 'http://localhost:5000/public/room_avatar/',
		};
	},
	computed: {
		...mapGetters(['getUserData', 'getRoomData', 'getSocket']),
		getPrivateRooms() {
			return this.rooms.filter(room => room.access === false);
		},
		getPublicRooms() {
			return this.rooms.filter(room => room.access === true);
		},
		filteredRooms() {
			return this.rooms
				.slice()
				.sort(this.roomSortFunc)
				.filter(room =>
					room.name.toLowerCase().includes(this.searchInput.toLowerCase()),
				);
		},
	},
	methods: {
		...mapActions([
			'updateRoomData',
			'addRoom',
			'deleteRoom',
			'saveCurrentRoom',
			'saveCurrentSelect',
		]),
		...mapGetters(['getCurrentSelect', 'getCurrentRoom']),
		handleFileUpload(e) {
			this.room_avatar = this.$refs.room_avatar.files[0];
			const file = e.target.files[0];
			this.selected_url = URL.createObjectURL(file);

			const reset_file = this.$refs.room_avatar;
			reset_file.type = 'text';
			reset_file.type = 'file';
		},
		roomSortFunc(a, b) {
			let roomA = a.name.toUpperCase();
			let roomB = b.name.toUpperCase();

			//ROOM - HOME should be first
			if (roomA == 'HOME') return -1;
			if (roomB == 'HOME') return 1;

			//private chat room should be first
			if (!a.access) return -1;
			if (!b.access) return 1;

			//sort by users count
			if (a.users < b.users) {
				return 1;
			}
			if (a.users > b.users) {
				return -1;
			}

			return 0;
		},
		fetchRoomData() {
			axios
				.get('/api/room')
				.then(async res => {
					axios
						.put(`/api/room/remove/users/all`, {
							userid: this.getUserData.id,
						})

						.then(info => {})
						.catch(err => {});
					this.$store.dispatch('updateRoomData', res.data.rooms);
					this.rooms = res.data.rooms;
					this.online = res.data.online;
					axios.put(`/api/user/current`, {
						socketid: this.getSocket.id,
					});
				})
				.catch(err => {
					console.log('err', err);
				});
		},
		openModal() {
			this.room_name = null;
			this.selected_url = null;
			this.$refs.createRoom.open();
		},
		enterRoom(room) {
			this.$router.push({ name: 'Room', params: { id: room.id } });
		},
		enterPrivateRoom(room) {
			this.$router.push({ name: 'PrivateRoom', params: { id: room.id } });
		},
		handleCreateRoom(e) {
			e.preventDefault();
			let formData = new FormData();

			const updatedRoomData = {
				room_name: this.room_name,
				room_avatar: this.room_avatar,
			};

			for (const property in updatedRoomData) {
				if (updatedRoomData[property]) {
					formData.append(property, updatedRoomData[property]);
				}
			}

			if (localStorage.getItem('authToken')) {
				axios
					.post(`/api/room`, formData, {
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
							this.$store.dispatch('addRoom', res.data);
							this.room_name = null;
							this.selected_url = null;
							this.password = null;
							this.$refs.createRoom.close();
							this.getSocket.emit('roomAdded', res.data);
						}
					})
					.catch(err => {
						console.log(err);
					});

				setTimeout(() => {
					this.errors = [];
				}, 1500);
			}
		},
		handleDelete(e) {
			e.preventDefault();
			axios
				.delete(`/api/room/${e.target.name}`)
				.then(res => {
					if (!res.errors) {
						this.$store.dispatch('deleteRoom', res.data);
						this.getSocket.emit('roomDeleted', {
							room: res.data,
							user: this.getUserData,
							admin: true,
							content: `${res.data.user.username} deleted room ${res.data.name}`,
						});
					}
				})
				.catch(err => console.log(err));
		},
		handleRoomClick(room) {
			if (room.access) {
				this.enterRoom(room);
			} else {
				this.enterPrivateRoom(room);
			}
		},
		handlePrivateRoomCheck(e) {
			e.preventDefault();
			axios
				.post('/api/room/verify', {
					room_name: this.$refs.privateRoom.modalData.room.name,
					password: this.privateRoomPassword,
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
						this.privateRoomPassword = null;
					} else {
						if (res.data.success) {
							this.enterRoom(this.$refs.privateRoom.modalData.room);
						}
					}

					setTimeout(() => {
						this.errors = [];
					}, 1500);
				})
				.catch(err => console.log(err));
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
		this.$store.dispatch('saveCurrentRoom', null);
		this.$store.dispatch('saveCurrentSelect', null);
		this.getSocket.removeListener('msgAlertTriggered');
		this.getSocket.on('roomAdded', data => {
			this.rooms.unshift(JSON.parse(data));
		});

		this.getSocket.on('roomListUpdated', data => {
			this.rooms = this.rooms.filter(
				room => room.id !== JSON.parse(data).room.id,
			);
		});

		this.getSocket.on('updateRooms', data => {
			this.rooms = JSON.parse(data).room.rooms;
			this.online = JSON.parse(data).room.online;
		});

		this.getSocket.on('roomNameUpdated', data => {
			let updateIndex = 0;
			this.rooms.forEach((room, index) => {
				if (room.id === JSON.parse(data).room.id) {
					updateIndex = index;
				}
			});
			this.rooms.splice(updateIndex, 1, JSON.parse(data).room);
		});

		this.getSocket.on('msgAlertTriggered', message => {
			const message_parsed = JSON.parse(message);
			if (message_parsed.trig) {
				this.$notify({
					group: 'notification_alert',
					title: 'New Alert',
					text: message_parsed.content,
					type: 'error ',
					duration: 10000,
				});
				return;
			}
			if (!message_parsed['user']['status']) {
				if (
					this.getCurrentRoom().access ||
					!this.getCurrentSelect() ||
					this.getCurrentSelect() != message_parsed['user']['id']
				) {
					this.$notify({
						group: 'notification_newMsg',
						title: [
							'New Message Arrived from ' + message_parsed['user']['handle'],
							message_parsed['user']['id'],
						],
						text: this.text_truncate(
							message_parsed.content.replace('!!!image!!!', 'File name - '),
							30,
							'...',
						),
						type: 'success ',
						duration: 10000,
					});
				}
			}
		});
	},
	mounted() {
		this.fetchRoomData();
		if (this.errorMessage) {
			setTimeout(() => {
				this.errorMessage = '';
			}, 1500);
		}
	},
};
</script>

<style lang="scss">
@import '@/assets/scss/views/rooms.scss';
@import '@/assets/scss/components/form.scss';
</style>
