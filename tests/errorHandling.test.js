
const { test } = require("node:test");
const errorHandler = require("../src/middleware/errorHandler");
const assert = require("node:assert/strict");
const http = require("node:http");
const app = require("../src/app");

test("returns 400 for malformed JSON", async () => {
  const server = app.listen(0);

  try {
    await new Promise((resolve) => server.once("listening", resolve));

    const port = server.address().port;

    const response = await new Promise((resolve, reject) => {
      const req = http.request(
        {
          hostname: "127.0.0.1",
          port,
          path: "/api/tasks",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        },
        (res) => {
          let body = "";

          res.on("data", (chunk) => {
            body += chunk;
          });

          res.on("end", () => {
            resolve({
              statusCode: res.statusCode,
              body: JSON.parse(body),
            });
          });
        }
      );

      req.on("error", reject);
      req.write('{"title": ');
      req.end();
    });

    assert.equal(response.statusCode, 400);
    assert.equal(response.body.message, "Invalid JSON request body");
  } finally {
    await new Promise((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  }
});

test("returns a generic 500 response for unexpected errors", () => {
  const err = new Error("Database password or internal details");

  const req = {};
  const res = {
    headersSent: false,
    statusCode: null,
    body: null,

    status(code) {
      this.statusCode = code;
      return this;
    },

    json(data) {
      this.body = data;
      return this;
    },
  };

  errorHandler(err, req, res, () => {});

  assert.equal(res.statusCode, 500);
  assert.deepEqual(res.body, {
    message: "Internal server error",
  });
  assert.equal(
    JSON.stringify(res.body).includes("Database password"),
    false
  );
});
