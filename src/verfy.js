import speakeasy from "speakeasy";
const verified = speakeasy.totp.verify({
  secret: "MdsvrxV)qaZBwx?g9mm{",
  encoding: "ascii",
  token: "267301", // Allow a 2-step window for code validation
});

//
console.log(verified);
