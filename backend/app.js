const express = require("express");
const { default: mongoose } = require("mongoose");
require("dotenv").config({ path: "./.env.local" });
// const app = express();
const { Server } = require("socket.io");
const port = process.env.PORT;
const cors = require("cors");

const meal_routes = require("./src/routes/meal.route.js");
const setting_routes = require("./src/routes/setting.route.js");
const order_routes = require("./src/routes/order.route.js");
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database Connected");
    const app = express();

    app.set("port", port);
    // app.listen(port, () => {
    //   console.log("Server has started!");
    // });
    // app.get("/", (req, res) => {
    //   res.send("Hello World!");
    // });
    app.use(express.json());
    app.use(cors());
    app.use("/meals", meal_routes);
    app.use("/settings", setting_routes);
    app.use("/orders", order_routes);

    app.use("*", (req, res) => {
      return res.status(404).json({
        success: false,
        message: "API endpoint doesnt exist",
      });
    });

    const server = require("http").createServer(app);
    const io = new Server(server, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
      },
    });
    io.on("connection", (socket) => {
      console.log("user connected", socket.id);
      socket.off("disconnect", () => {
        console.log("User Disconnected", socket.id);
        // socket.off();
      });
      socket.on("join_room", (data) => {
        console.log(`${socket.id} joined room ${data}`);
        socket.join(data);
      });
      socket.on("send_order", (data) => {
        console.log(`${socket.id} sending order ${data}`);
        socket.to("admin").emit("received_order", data);
        // io.sockets
      });
    });

    server.listen(port);
    server.on("listening", () => {
      console.log(`Listening on port:: http://localhost:${port}/`);
    });
  })

  .catch((e) => console.log("Database Error " + e));
