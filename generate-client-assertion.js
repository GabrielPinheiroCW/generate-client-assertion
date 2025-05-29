#!/usr/bin/env node

const fs = require("fs");
const { SignJWT, importPKCS8 } = require("jose");
const path = require("path");
const os = require("os");

// Load .env from project directory (where this script is located)
require("dotenv").config({ path: path.join(__dirname, ".env") });

const [, , argIss, argSub, argAud, argKid, argPrivateKeyPath] = process.argv;

const iss = argIss || process.env.ISS;
const sub = argSub || process.env.SUB;
const aud = argAud || process.env.AUD;
const kid = argKid || process.env.KID;
const privateKeyPath =
  argPrivateKeyPath?.replace("~", os.homedir()) ||
  process.env.PRIVATE_KEY_PATH?.replace("~", os.homedir());

if (!iss || !sub || !aud || !kid) {
  console.error("Error: Required parameters not provided!");
  console.error(
    "Uso: node generate-client-assertion.js [iss] [sub] [aud] [kid] [privateKeyPath]"
  );
  console.error("");
  console.error("You can define default values in the .env file:");
  console.error("ISS=your-issuer");
  console.error("SUB=your-subject");
  console.error("AUD=your-audience");
  console.error("KID=your-key-id");
  console.error("PRIVATE_KEY_PATH=path/to/key.key");
  console.error("");
  console.error(
    "The command line parameters override the values in the .env file"
  );
  process.exit(1);
}

const privateKeyPem = fs.readFileSync(privateKeyPath, "utf8");
const alg = "PS256";

async function generateJWT() {
  const privateKey = await importPKCS8(privateKeyPem, alg);
  const now = Math.floor(Date.now() / 1000);

  const payload = {
    iss,
    sub,
    aud,
    jti: Array.from(
      { length: 20 },
      () =>
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"[
          Math.floor(Math.random() * 62)
        ]
    ).join(""),
    iat: now,
    exp: now + 60, // expires in 60 seconds (1 minute)
  };

  const jwt = await new SignJWT(payload)
    .setProtectedHeader({
      alg,
      kid,
    })
    .sign(privateKey);

  console.log(jwt);

  try {
    const clipboardy = await import("clipboardy");
    await clipboardy.default.write(jwt);
    console.log("✅ JWT copied to the clipboard!");
  } catch (error) {
    console.log("⚠️ Could not copy to the clipboard:", error.message);
  }
}

generateJWT().catch(console.error);
