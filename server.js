const express = require("express");
const userRoutes = require("./src/user/routes");
const routeHall = require("./routes/routeHall");
const routeFilms = require("./routes/routeFilms");
const routeChair = require("./routes/routeChair");
const routeHallChairs = require("./routes/routeHallChairs");
const routeHallChairsSessions = require("./routes/routeHallChairsSessions");
const routeSessions = require('./routes/routeSessions');

const app = express();
const PORT = process.env.SERVER_PORT || 3001;
const cors = require('cors');

app.use(express.json());
app.use(cors());

//const whitelist = [
  //'https://b1c849c5-8eba-45e0-8e6a-dfcf73f6745d-00-tblmp5ul2xcl.riker.replit.dev', 
  //'https://f8d59f01-e4ef-4ba3-9500-b0fe931750ab-00-ylebfj2olvum.worf.replit.dev',
//  'http://localhost:5000/'
//];

//const corsOptions = {
//  origin: function (origin, callback) {
//    if (whitelist.indexOf(origin) !== -1) {
//      callback(null, true)
//    } else {
//      callback(new Error('Not allowed by CORS'))
//    }
//  }
//};

//app.get("/", cors(corsOptions), (req, res) => {
//  res.send("Hello World!");
//});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//app.use(`/${process.env.DB_SECRET}/api/v1/users`, cors(corsOptions), userRoutes);

app.use(`/${process.env.DB_SECRET}/api/v1/users`, userRoutes);
app.use("/api/chair", routeChair);
app.use("/api/hallchairs", routeHallChairs);
app.use("/api/hallchairs_of_sessions", routeHallChairsSessions);
app.use("/api/hall", routeHall);
app.use("/api/films", routeFilms);
app.use("/api/sessions", routeSessions);

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
