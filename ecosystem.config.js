module.exports = {
	apps: [
		{
			name: 'pns',
			script: './build/index.js',
			watch: true,
			maxMemoryRestart: '500M',
			autorestart: true,
			restart_delay: 4000,
			max_restarts: 10
		}
	]
};
