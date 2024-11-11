const express = require("express");
const cors = require("cors");

const userRoutes = require("./src/user/routes");
const routeHall = require("./routes/admin/routeHall");
const routeFilms = require("./routes/admin/routeFilms");
const routeChair = require("./routes/admin/routeChair");
const routeQRCode = require('./routes/admin/routeQRCode');
const routeHallChairs = require("./routes/admin/routeHallChairs");
const routeHallChairsSessions = require("./routes/admin/routeHallChairsSessions");
const routeSessions = require('./routes/admin/routeSessions');

const routeAuth = require("./routes/auth/routeAuth");
const routeRoles = require("./routes/auth/routeRoles");
const routeUsers = require("./routes/auth/routeUsers");
const routeUsersRoles = require("./routes/auth/routeUserRoles");

const app = express();
const PORT = process.env.SERVER_PORT || 3001;

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,
}));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth", routeAuth);
app.use("/api/roles", routeRoles);
app.use("/api/users", routeUsers);
app.use("/api/usersroles", routeUsersRoles);

app.use(`/${process.env.DB_SECRET}/api/v1/users`, userRoutes);
app.use("/api/chair", routeChair);
app.use("/api/hallchairs", routeHallChairs);
app.use("/api/hallchairs_of_sessions", routeHallChairsSessions);
app.use("/api/hall", routeHall);
app.use("/api/films", routeFilms);
app.use("/api/sessions", routeSessions);
app.use("/api/qrcode", routeQRCode);

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
