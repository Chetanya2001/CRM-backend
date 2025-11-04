const allowedOrigins = [
  "http://localhost:3000",
  "https://crm-frontend-live.vercel.app",
  "https://crm-frontend-eta-olive.vercel.app",
  "http://43.204.111.78",
  "http://ec2-43-204-111-78.ap-south-1.compute.amazonaws.com",
  "https://crm-frontend-43gksnlid-ashishs-projects-22853570.vercel.app",
];

module.exports = {
  origin: allowedOrigins,
  credentials: true,
};
