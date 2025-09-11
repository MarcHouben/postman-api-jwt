const { encrypt, decrypt, getRequestBody } = require("./lib");

module.exports.handleRegistration = async function (req, res, db) {
  try {
    const bodyStr = await getRequestBody(req);
    const { username, password } = JSON.parse(bodyStr);
    const query = db.prepare(
      `INSERT INTO user (username, password) VALUES (?,?)`,
    );
    query.run(username, password);

    return res
      .writeHead(201, { "content-type": "plain/text" })
      .end("message: user created successfully");
  } catch (error) {
    console.error(error);
    return res
      .writeHead(500, { "content-type": "plain/text" })
      .end("error: something bad happened. check logs");
  }
};

module.exports.handleAuthentication = async function (req, res, db) {
  try {
    const bodyStr = await getRequestBody(req);
    const { username, password } = JSON.parse(bodyStr);

    const query = db.prepare(`SELECT * FROM user WHERE username = ?`);
    const row = query.get(username);

    if (!row) {
      return res
        .writeHead(404, { "content-type": "plain/text" })
        .end("error: not found");
    }

    if (row.password != password) {
      return res
        .writeHead(401, { "content-type": "plain/text" })
        .end("error: unauthorized");
    }

    const encrypted = encrypt(
      JSON.stringify({ id: row.id, username: row.username }),
    );

    return res
      .writeHead(200, { "content-type": "plain/text" })
      .end(JSON.stringify({ token: encrypted }));
  } catch (err) {
    console.error(err);
    return res
      .writeHead(500, { "content-type": "plain/text" })
      .end("something bad happened. check logs");
  }
};

module.exports.handleAccess = function (req, res) {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res
      .writeHead(401, { "content-type": "plain/text" })
      .end("error: no authorization token");
  }

  const token = authorization.replace("Bearer ", "");
  if (!token) {
    return res
      .writeHead(401, { "content-type": "plain/text" })
      .end("error: invalid authorization token");
  }

  try {
    const decrypted = decrypt(token, iv.toString("hex"));
    const user = JSON.parse(decrypted);

    res.writeHead(200, { "content-type": "plain/text" });
    return res.end(`message: access available to ${user.username}`);
  } catch (error) {
    return res
      .writeHead(500, { "content-type": "plain/text" })
      .end("error: token mismatch. restart server");
  }
};
