const allowedOrigins = [
  "http://localhost:3000",
  "https://crm-frontend-live.vercel.app",
  "https://crm-frontend-eta-olive.vercel.app",
  "http://43.204.111.78",
  "http://ec2-43-204-111-78.ap-south-1.compute.amazonaws.com",
  "https://crm-frontend-43gksnlid-ashishs-projects-22853570.vercel.app",
  "https://crm-frontend-delta-ebon.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`❌ CORS blocked: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

module.exports = corsOptions;
