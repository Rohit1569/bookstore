require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const UUID = require("uuid");
const util = require("util");
const errors = require("throw.js");
const { get } = require("lodash");
const { StatusCodes } = require("http-status-codes");

const SettingsConfig = require("./app/configs/settings/settings-config");
const settingsConfig = new SettingsConfig();
const routeConfig = require("./app/configs/route-config");
const { initLogger } = require("./app/utils/logger");

const Logger = initLogger(get(settingsConfig, "settings.logger.level", null));
const application = express();

function configureApplication(app) {
    const whitelist = ["http://localhost:3000", "http://localhost:20200"];

    app.use(
        cors({
            origin: (origin, callback) => {
                if (!origin || whitelist.includes(origin)) {
                    callback(null, true);
                } else {
                    callback(new Error("Not allowed by CORS"));
                }
            },
            exposedHeaders: ["X-Total-Count"],
        })
    );

    // ✅ Middleware to parse JSON request bodies
    app.use(express.json({ limit: "50mb" })); // Remove duplicate express.json() calls
    app.use(express.urlencoded({ extended: true })); // Support form-encoded bodies

    // ✅ Debug incoming request body
    app.use((req, res, next) => {
        console.log("Incoming request body:", req.body);
        console.log("Incoming request headers:", req.headers);
        next();
    });

    app.use((req, res, next) => {
        res.set("Cache-Control", "no-cache, no-store, must-revalidate");
        res.set("Pragma", "no-cache");
        res.set("Expires", "0");
        res.type("application/json");
        next();
    });

    // Assign a unique request ID for logging
    app.use((req, res, next) => {
        req.id = UUID.v4();
        settingsConfig.logger = Logger.child({ requestId: req.id });
        next();
    });
}

function configureErrorHandler(app) {
    app.use((req, res, next) => {
        next(new errors.NotFound("API Not Found"));
    });

    app.use((err, req, res, next) => {
        const log = Logger.child({ requestId: req.id });
        log.error("Error for Request:", err);

        const errorStatusCode =
            err.statusCode || err.status || StatusCodes.INTERNAL_SERVER_ERROR;

        res.status(errorStatusCode).json({ message: err.message });
    });
}

function configureRoutes(app) {
    routeConfig.registerRoutes(app, settingsConfig);
}

function startServer(app) {
    const server = http.createServer(app);

    server.listen(settingsConfig.settings.thisNode.port, () => {
        Logger.info(
            "Server running at http://%s:%s",
            settingsConfig.settings.thisNode.hostName,
            settingsConfig.settings.thisNode.port
        );
    });
}

function configureWorker(app) {
    configureApplication(app);
    configureRoutes(app);
    configureErrorHandler(app);
    startServer(app);
}

configureWorker(application);
