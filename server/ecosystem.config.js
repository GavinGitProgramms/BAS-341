module.exports = {
  apps: [
    {
      name: 'bas-server',
      script: 'dist/server.js', // path to the compiled JS file
      watch: ['dist'], // watch the directory where JS files are compiled
      ignore_watch: ['node_modules'], // folders to ignore watching
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'development',
      },
    },
  ],
}
