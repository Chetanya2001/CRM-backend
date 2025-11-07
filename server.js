require("dotenv").config();
require("./cron/notificationCleaner");
require("./cron/blacklistExpired");

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
const cron = require("node-cron");
const notifyUpcomingMeetings = require("./cron/meetingNotifier");
const notifyScheduledFollowups = require("./cron/followupNotifier");
const { getTenantDB } = require("./config/sequelizeManager");
const { initializeNotificationHelper } = require("./utils/notificationHelper");

const app = express();
const server = http.createServer(app);

// ✅ Allowed frontend origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://crm-frontend-delta-ebon.vercel.app",
];

// ✅ Apply CORS globally — must come FIRST
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Allow mobile/curl
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

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // ✅ Preflight handler

// ✅ Ensure CORS headers on all responses (extra safety)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// ✅ Core middlewares
app.use(express.json());
app.use(cookieParser());

// ✅ Log all requests
app.use((req, res, next) => {
  console.log("📥 [REQUEST]");
  console.log("Method:", req.method);
  console.log("URL:", req.originalUrl);
  console.log("Origin:", req.headers.origin);
  next();
});

// ✅ Test route
app.get("/api/ping", (req, res) => {
  res.send("✅ Backend is reachable!");
});

// =============== SOCKET.IO ===============
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  },
});

// Attach io to request object
app.use((req, res, next) => {
  req.io = io;
  next();
});

// =============== ROUTES ===============
const auth = require("./middleware/auth");
const tenantResolver = require("./middleware/tenantResolver");

app.use("/api/masteruser", require("./routes/MasterUser.routes"));
app.use("/api/company", require("./routes/Company.routes"));
app.use("/api/crew", auth(), tenantResolver, require("./routes/Agents.routes"));
app.use("/api", tenantResolver, require("./routes/User.routes"));
app.use("/api/manager", tenantResolver, require("./routes/Manager.routes"));
app.use("/api/hr", tenantResolver, require("./routes/Hr.routes"));
app.use("/api/leads", auth(), tenantResolver, require("./routes/Lead.routes"));
app.use(
  "/api/calldetails",
  auth(),
  tenantResolver,
  require("./routes/CallDetails.routes")
);
app.use(
  "/api/meetings",
  auth(),
  tenantResolver,
  require("./routes/Meeting.routes")
);
app.use(
  "/api/opportunities",
  auth(),
  tenantResolver,
  require("./routes/Opportunity.routes")
);
app.use(
  "/api/client-leads",
  auth(),
  tenantResolver,
  require("./routes/ClientLead.routes")
);
app.use(
  "/api/invoice",
  auth(),
  tenantResolver,
  require("./routes/Invoices.routes")
);
app.use("/api", tenantResolver, require("./routes/Chatbot.routes"));
app.use(
  "/api/executive-activities",
  auth(),
  tenantResolver,
  require("./routes/ExecutiveActivity.routes")
);
app.use(
  "/api/freshleads",
  auth(),
  tenantResolver,
  require("./routes/FreshLead.routes")
);
app.use(
  "/api/converted",
  auth(),
  tenantResolver,
  require("./routes/ConvertedClient.routes")
);
app.use(
  "/api/close-leads",
  auth(),
  tenantResolver,
  require("./routes/CloseLead.routes")
);
app.use(
  "/api/notification",
  auth(),
  tenantResolver,
  require("./routes/Notification.routes")
);
app.use(
  "/api/executive-dashboard",
  auth(),
  tenantResolver,
  require("./routes/Executivedashboard.routes")
);
app.use(
  "/api/settings",
  auth(),
  tenantResolver,
  require("./routes/Settings.routes")
);
app.use(
  "/api/followup",
  auth(),
  tenantResolver,
  require("./routes/Followup.routes")
);
app.use(
  "/api/followuphistory",
  auth(),
  tenantResolver,
  require("./routes/FollowUpHistory.routes")
);
app.use(
  "/api/processperson",
  tenantResolver,
  require("./routes/ProcessPerson.routes")
);
app.use("/api/customer", tenantResolver, require("./routes/Customer.routes"));
app.use(
  "/api/revenue",
  tenantResolver,
  require("./routes/RevenueChart.routes")
);
app.use(
  "/api/customer-details",
  auth(),
  tenantResolver,
  require("./routes/CustomerDetails.routes")
);
app.use(
  "/api/customer-stages",
  auth(),
  tenantResolver,
  require("./routes/CustomerStages.routes")
);
app.use(
  "/api/eod-report",
  tenantResolver,
  require("./routes/EodReport.routes")
);
app.use("/api", auth(), tenantResolver, require("./routes/Calendar.routes"));
app.use("/api", auth(), tenantResolver, require("./routes/UserStatus.routes"));
app.use("/api", tenantResolver, require("./routes/leadCheck.routes"));
app.use("/api", tenantResolver, require("./routes/Eod.routes"));
app.use(
  "/api/customer",
  tenantResolver,
  require("./routes/CustomerDocuments.routes")
);
app.use(
  "/api/template",
  auth(),
  tenantResolver,
  require("./routes/EmailTemplate.routes")
);
app.use(
  "/api/process-history",
  auth(),
  tenantResolver,
  require("./routes/ProcessFollowupHistory.routes")
);
app.use(
  "/api/role-permissions",
  auth(),
  tenantResolver,
  require("./routes/RolePermission.routes")
);
app.use(
  "/api/processed",
  auth(),
  tenantResolver,
  require("./routes/ProcessedFinal.routes")
);
app.use(
  "/api/process-person-activities",
  auth(),
  tenantResolver,
  require("./routes/ProcessPersonActivity.routes")
);
app.use(
  "/api/manager-activities",
  auth(),
  tenantResolver,
  require("./routes/ManagerActivity.routes")
);
app.use(
  "/api/hr-activities",
  auth(),
  tenantResolver,
  require("./routes/HrActivity.routes")
);
app.use(
  "/api/leave",
  auth(),
  tenantResolver,
  require("./routes/LeaveApplication.routes")
);
app.use(
  "/api/organization",
  auth(),
  tenantResolver,
  require("./routes/Organisation.routes")
);
app.use(
  "/api/schedule",
  auth(),
  tenantResolver,
  require("./routes/FollowupNotification.routes")
);
app.use(
  "/api/payroll",
  auth(),
  tenantResolver,
  require("./routes/Payroll.routes")
);

// =============== SOCKET & CRON SETUP ===============
const connectedUsers = {};
global.connectedUsers = connectedUsers;

initializeNotificationHelper(io, connectedUsers);

io.on("connection", (socket) => {
  console.log("🟢 New socket connection:", socket.id);

  socket.on("set_user", async ({ userId, companyId }) => {
    try {
      if (!userId || !companyId) {
        console.warn("⚠️ Missing userId or companyId in socket connection");
        return;
      }

      socket.userId = userId;
      socket.companyId = companyId;
      connectedUsers[userId] = socket.id;

      const tenantDB = await getTenantDB(companyId);
      await tenantDB.Users.update(
        { is_online: true },
        { where: { id: userId } }
      );

      io.emit("status_update", { userId, is_online: true });
    } catch (err) {
      console.error("⚠️ Error setting user online:", err);
    }
  });

  socket.on("disconnect", async () => {
    const { userId, companyId } = socket;
    if (userId && companyId) {
      delete connectedUsers[userId];

      try {
        const tenantDB = await getTenantDB(companyId);
        await tenantDB.Users.update(
          { is_online: false },
          { where: { id: userId } }
        );

        io.emit("status_update", { userId, is_online: false });
        console.log("🔴 User disconnected:", userId);
      } catch (err) {
        console.error("⚠️ Error setting user offline:", err);
      }
    }
  });
});

cron.schedule("* * * * *", async () => {
  console.log("⏰ Cron job running for meeting notifications...");
  await notifyUpcomingMeetings();
  await notifyScheduledFollowups();
});

// =============== START SERVER ===============
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "test") {
  server.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  );
}

module.exports = { app };
