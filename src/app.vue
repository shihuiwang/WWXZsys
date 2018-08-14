<template>
    <div id="main" class="app-main">
        <router-view></router-view>
    </div>
</template>

<script>
	import myIDB from './assets/js/indexedDB'

    export default {
        data () {
            return {
                theme: this.$store.state.app.themeColor
            };
        },
        mounted () {

        },
        beforeDestroy () {

        },
        methods: {

        }
    };
</script>

<style>
html,body{
    width: 100%;
    height: 100%;
    background: #f0f0f0;
    overflow: hidden;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
}
.app-main{
    width: 100%;
    height: 100%;
}
</style>
