<template>
	<div>
		<div :hidden="dialogHidden">
			<VEmojiPicker :pack="emojisNative" labelSearch="Search" @select="onSelectEmoji" />
		</div>
		<div class="chat__input">
			<textarea type="text" v-model="valueInput" class="chat__input-control" />
			<input type="file" ref="file" style="display: none" />
			<button @click="$refs.file.click()" style="width: 50px;">open file dialog</button>
			<button @click="toogleDialogEmoji" class="button-emoj" style="width: 50px;">😃</button>
			<button class="btn btn--clear btn--info m-0 u-border-rad-0" @click="sendMessage">Send</button>
		</div>
	</div>
</template>


<script>
	import { mapGetters } from "vuex";
	import VEmojiPicker from "v-emoji-picker";
	import packEmoji from "v-emoji-picker/data/emojis.js";
	import $ from "jquery";

	export default {
		name: "ChatInput",
		data: function() {
			return {
				valueInput: "",
				dialogHidden: true
			};
		},
		components: {
			VEmojiPicker
		},
		computed: {
			...mapGetters(["getUserData", "getCurrentRoom", "getSocket"]),

			emojisNative() {
				return packEmoji;
			}
		},
		methods: {
			toogleDialogEmoji() {
				this.dialogHidden = !this.dialogHidden;
			},
			onSelectEmoji(dataEmoji) {
				this.valueInput += dataEmoji.emoji;
				// Optional
				this.toogleDialogEmoji();
			},
			sendUserTyping() {
				this.getSocket.emit("userTyping", {
					room: this.getCurrentRoom,
					user: this.getUserData
				});
			},
			sendUserNotTyping() {
				this.getSocket.emit("removeUserTyping", {
					room: this.getCurrentRoom,
					user: this.getUserData
				});
			},
			triggerMessageSend(e) {
				e.preventDefault();
				if (e.keyCode === 13 && !e.shiftKey) {
					this.sendMessage();
				} else {
					if (this.valueInput !== "") {
						this.sendUserTyping();
					} else {
						this.sendUserNotTyping();
					}
				}
			},
			sendMessage() {
				this.getSocket.emit("newMessage", {
					room: this.getCurrentRoom,
					user: this.getUserData,
					content: this.valueInput
				});
				this.valueInput = "";
				this.sendUserNotTyping();
			}
		},
		mounted() {}
	};
</script>
<style lang="css" scoped>
</style>