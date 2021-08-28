import express from "express";
import mongoose from "mongoose";
import config from "config";
import path from "path";

import logger from "./modules/logger.js";
import authRouter from './api/auth/authRouter.js'
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import swaggerOptions from "./swaggerOptions.js"

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const app = express();

app.use(express.json())

// API роуты
app.use("/auth", authRouter)

app.use("/uploads", express.static("uploads"));
app.use("/file", express.static("file"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

if (process.env.NODE_ENV === "production") {
  app.use("/", express.static(path.join(__dirname, "client", "build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = config.get("port") || 4000;

async function start() {
  try {
    await mongoose.connect(config.get("mongoUrl"), {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });

    app.listen(PORT, () =>
      logger.info(`Запуск сервера порт: ${PORT}`)
    );
    
  } catch (err) {
    console.log("Ошибка запуска сервера.", err.message);
    logger.error(`Ошибка запуска сервера. ${err.message}`);
    process.exit(1);
  }
}

start();