/** @type {import('next').NextConfig} */

// next-transpile-modules
const withTM = require("next-transpile-modules")([
  "@stripe/firestore-stripe-payments",
]); // pass the modules you would like to see transpiled

module.exports = withTM({
  reactStrictMode: true,
  images: {
    domains: ["image.tmdb.org", "rb.gy"],
  },
});
