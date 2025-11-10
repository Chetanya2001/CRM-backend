// utils/corsOption.js
const corsOptions = {
  origin: [
    "https://crm-frontend-delta-ebon.vercel.app",
    "http://localhost:3000",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Cache-Control",
    "X-Requested-With",
  ],
  credentials: true,
};

module.exports = corsOptions;
