// utils/corsOption.js
const allowedOrigins = [
  "https://crm-frontend-delta-ebon.vercel.app", // production
  "http://localhost:3000", // dev
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("❌ Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "x-company-id",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
