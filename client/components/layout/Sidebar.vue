<template>
	<transition name="slideLeft" mode="out-in">
		<div v-if="visible" class="sidebar">
			<div class="ads_sidebar" id="sideBarAdsExpr">
				<ins
					class="adsbygoogle adsense-mobile"
					style="display:block"
					:data-ad-client="'ca-pub-' + this.adsenseClientId"
					:data-ad-slot="this.adsenseSlotId"
				></ins>
			</div>
			<div class="sidebar__header">
				<slot name="header">
					<h4>Default Header</h4>
				</slot>
			</div>
			<div class="sidebar__body">
				<slot name="body"></slot>
			</div>
			<div class="sidebar__footer">
				<slot name="footer"></slot>
			</div>
		</div>
	</transition>
</template>

<script>
import axios from 'axios';
export default {
	name: 'Sidebar',
	data: function() {
		return {
			visible: window.innerWidth < 768 ? false : true,
			adsenseClientId: '',
			adsenseSlotId: '',
		};
	},
	methods: {
		toggle() {
			this.visible = !this.visible;
		},
	},
	mounted() {},
	created() {
		axios
			.get(`/api/adsense/`)
			.then(res => {
				this.adsenseClientId = res.data.sidebarClientId;
				this.adsenseSlotId = res.data.sidebarSlotId;
				(adsbygoogle = window.adsbygoogle || []).push({});
			})
			.catch(err => {
				console.log('err', err);
			});
	},
};
</script>

<style lang="scss" scoped>
.ads_sidebar {
	width: 300px !important;
	height: 50px !important;
	background-color: #402d31;
	overflow: hidden;
}
.sidebar {
	height: 100vh;
	position: fixed;
	left: 0;
	background: rgba($color: #101113, $alpha: 0.9);
	width: 300px;
	overflow: auto;
	display: flex;
	flex-flow: column;
	transition: all 0.5s ease;
	z-index: 10;

	&__header {
		display: flex;
		align-items: center;
		padding: 1rem 0;
		margin: 0 1rem;
		border-bottom: 1px solid #fff;
	}

	&__body {
		height: auto;
		overflow-y: auto;
		overflow-x: hidden;
		margin-bottom: 20px;
	}

	&__footer {
		height: auto;
		flex-grow: 1;
		display: flex;
		justify-content: center;
		align-items: flex-end;
		margin-bottom: 85px;
		z-index: 3;
	}
}
</style>
