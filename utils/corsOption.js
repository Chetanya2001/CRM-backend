// utils/corsOption.js

const allowedOrigins = [
  "https://crm-frontend-delta-ebon.vercel.app", // ✅ production frontend
  "http://localhost:3000", // ✅ local dev
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },

  credentials: true,

  // ✅ Add your custom headers here
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "x-company-id", // <-- FIXED: your missing header
    "X-Requested-With",
    "Accept",
    "Origin",
  ],

  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],

  // ✅ Respond successfully to preflight requests
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
