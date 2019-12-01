<template>
	<div id="app">
		<c-menu></c-menu>
		<router-view/>
	</div>
</template>

<script>
import './utils/filter';
import cMenu from './components/cmenu'
export default {
	components: { cMenu }
}
</script>

<style lang="scss">
@import "./assets/style/common.scss";
@import "./assets/style/cover-elementui.scss";
#app {
	height: 100%;
  overflow-y: scroll;
}
</style>
