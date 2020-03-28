const express = require("express");
const path = require("path");
require("dotenv").config();
const jwt = require("express-jwt"); // Validate JWT and set req.user
const jwksRsa = require("jwks-rsa"); // Retrieve RSA keys from a JSON Web Key set (JWKS) endpoint
const checkScope = require("express-jwt-authz"); // Validate JWT scopes

const checkJwt = jwt({
  // Dynamically provide a signing key based on the kid in the header
  // and the singing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true, // cache signing key
    rateLimit: true,
    jwksRequestsPerMinute: 5, // prevent attackers from requesting more than 5 per minute
    jwksUri: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: process.env.REACT_APP_AUTH0_AUDIENCE,
  issuers: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/`,

  // This must match the algorithm selected in the Auth0 dashboard
  // under your app's advanced settings under the 0Auth tab
  algorithms: ["RS256"]
});

const app = express();

function checkRole(role) {
  return function(req, res, next) {
    const assignedRoles = req.user["https://auth0-lahn.herokuapp.com/roles"];
    if (Array.isArray(assignedRoles) && assignedRoles.includes(role)) {
      return next();
    } else {
      return res.status(401).send("Insufficient role");
    }
  };
}

app.use(express.static(path.join(__dirname, "view/build")));

app.get("/public", function(req, res) {
  res.json({
    message: "Hello from a public API!"
  });
});

app.get("/private", checkJwt, function(req, res) {
  res.json({
    message: "Hello from a private API!"
  });
});

app.get("/admin", checkJwt, checkRole("admin"), function(req, res) {
  res.json({
    message: "Hello admin!"
  });
});

app.get("/course", checkJwt, checkScope(["read:courses"]), function(req, res) {
  res.json({
    courses: [
      { id: 1, title: "Building Apps with React Redux" },
      { id: 2, title: "Creating Reusable React Components" }
    ]
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/view/build/index.html"));
});

const port = process.env.PORT || 5001;
app.listen(port);

console.log("API SERVER listening on " + process.env.REACT_APP_API_URL);
