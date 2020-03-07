#!/bin/env node

const httpProxy = require('http-proxy')
const connect = require('connect')
const http = require('http')
const config = require('./configLoader')
const modules = require('./modules')

// Basic Connect App
const app = connect()

// Initialize reverse proxy
const proxy = httpProxy.createProxyServer({ secure: false })

// Apply modules
if (config.modules && config.modules.length) {
  config.modules.forEach((module) => {
    if (typeof module === 'string' && modules[module]) {
      app.use(modules[module](proxy, config))
    } else {
      const [moduleName, moduleConfig] = module

      if (modules[moduleName]) {
        app.use(modules[moduleName](proxy, config, moduleConfig))
      }
    }
  })
}

http.createServer(app).listen(config.port, 'localhost', () => {
  console.log(`Server listen on http://127.0.0.1:${config.port}`)
})

// Local Variables:
// mode: js2
// End:
