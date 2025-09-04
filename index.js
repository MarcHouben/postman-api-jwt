const http = require("node:http")
const { DatabaseSync } = require("node:sqlite")

const handlers = require("./handlers")

const db = new DatabaseSync("data.db", { open: true })
db.exec(`
  CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  ) STRICT`);


const server = http.createServer(function (req, res) {
  const method = req.method.toUpperCase()
  const path = req.url

  if (method == "GET" && path == "/") {
    res.writeHead(200, { "content-type": "plain/text" })
    return res.end("OK")
  }

  if (method == "POST" && path == "/registration") {
    return handlers.handleRegistration(req, res, db)
  }

  if (method == "POST" && path == "/authentication") {
    return handlers.handleAuthentication(req, res, db)
  }

  if (method == "GET" && path == "/access") {
    return handlers.handleAccess(req, res)
  }

  return res.writeHead(400, { "content-type": "plain/text" })
    .end("error: unsupported request")
})

const port = 8888
server.listen(port, function () {
  console.log(`Server is running on port ${port}`)
})

process.on("uncaughtException", function (error, origin) {
  console.error({ error, origin })
  process.exit(1)
})
