module.exports = {
	lintOnSave: true,
	productionSourceMap: false,
	publicPath: './',
	devServer: {
		port: 8082, // 端口号
		host: 'localhost',
		https: false, // https:{type:Boolean}
		open: false, //配置自动启动浏览器
	},
}