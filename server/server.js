require("dotenv").config();

const http = require('http')

const app = require('./lib/app')

const httpServer = http.createServer(app)

const PORT = process.env.SERVER_PORT || 3002;
httpServer.listen(PORT, () => {
    console.log('Server is listening on port ' + PORT)
})