// corsOptions.js
const allowedOrigins = [
  "https://crm-frontend-delta-ebon.vercel.app", // Production frontend
  "http://localhost:3000", // Local development
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow non-browser clients like Postman/cURL
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.warn(`❌ Blocked by CORS: ${origin}`);
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

module.exports = corsOptions;
