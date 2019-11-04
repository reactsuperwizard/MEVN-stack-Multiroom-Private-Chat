<template functional>
	<div class="page home">
		<section class="section section__landing">
			<div class="section__heading">
				<span class="section__title">About</span>
			</div>
			<div class="section__content">
				<p
					class="section__lead"
				>Allow real time communication with emojis, images, audio & video in groups via multiple public rooms and private chat</p>
				<div class="section__graphic">
					<img src="@/assets/img/undraw_programmer_imem.svg" alt />
				</div>
			</div>
		</section>
	</div>
</template>

<script>
	// @ is an alias to /client
	export default {
		name: "About",
		props: [],
		components: {},
		mounted() {}
	};
</script>

<style lang="scss" scoped>
	@import "@/assets/scss/components/feature.scss";
</style>
