<template>
	<div>
		<div :hidden="dialogHidden">
			<VEmojiPicker :pack="emojisNative" labelSearch="Search" @select="onSelectEmoji" />
		</div>
		<div class="chat__input">
			<input type="text" v-model="valueInput" class="chat__input-control" @focus="$emit('enterText')" />
			<input
				ref="file"
				type="file"
				accept="audio/*, image/*, video/*"
				@change="uploadImageFile"
				style="display: none;"
			/>
			<button @click="$refs.file.click()" style="width: 50px;">
				<mdb-icon icon="paperclip" size="2x" />
			</button>
			<button @click="toogleDialogEmoji" class="button-emoj" style="width: 50px; font-size:22px;">😃</button>
			<button class="btn btn--clear btn--info m-0 u-border-rad-0" @click="sendMessage">Send</button>
		</div>
	</div>
</template>


<script>
	import axios from "axios";
	import { mapGetters } from "vuex";
	import VEmojiPicker from "v-emoji-picker";
	import packEmoji from "v-emoji-picker/data/emojis.js";
	import { mdbIcon } from "mdbvue";

	export default {
		name: "ChatInput",
		data: function() {
			return {
				files: "",
				valueInput: "",
				dialogHidden: true
			};
		},
		components: {
			VEmojiPicker,
			mdbIcon
		},
		computed: {
			...mapGetters([
				"getUserData",
				"getCurrentRoom",
				"getSocket",
				"getCurrentSelect"
			]),

			emojisNative() {
				return packEmoji;
			}
		},
		methods: {
			onFocusInput() {
				alert("focus");
			},
			toogleDialogEmoji() {
				this.dialogHidden = !this.dialogHidden;
			},
			onSelectEmoji(dataEmoji) {
				this.valueInput += dataEmoji.emoji;
				// Optional
				this.toogleDialogEmoji();
			},
			sendMessage() {
				if (this.valueInput) {
					this.getSocket.emit("newMessage", {
						room: this.getCurrentRoom,
						user: this.getUserData,
						select: this.getCurrentSelect,
						content: this.valueInput
					});
					this.valueInput = "";
				}
			},
			uploadImageFile() {
				const files = this.$refs.file.files;
				if (files) {
					let formData = new FormData();
					formData.append("image", files[0]);
					axios
						.post(`/api/user/image`, formData, {
							headers: {
								"Content-Type": "multipart/form-data"
							}
						})
						.then(async res => {
							if (res.data.success) {
								this.getSocket.emit("newMessage", {
									room: this.getCurrentRoom,
									user: this.getUserData,
									select: this.getCurrentSelect,
									content: "!!!image!!!" + res.data.image
								});
							} else {
								this.$notify({
									group: "notification_newMsg",
									title: "Upload failed",
									text:
										"Upload image, audio, video less than 50 MB",
									type: "error ",
									duration: 10000
								});
							}
						})

						.catch(err => console.log(err));
				}
			}
		},
		mounted() {
			const _this = this;
			window.addEventListener("keyup", function(event) {
				if (event.keyCode === 13) {
					_this.sendMessage();
				}
			});
		}
	};
</script>
<style lang="css" scoped>
</style>