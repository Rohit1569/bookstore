const { isAuthenticated } = require("../middleware/authService");

/* eslint-disable global-require */
class RouteConfig {
  constructor() {}

  loadRouteConfig() {
    let config;

    try {
      config = require("./route.config.json");

      if (!config.routes || config.routes.length === 0) {
        throw new Error('"routes" not defined');
      }
    } catch (e) {
      throw new Error(`Unable to parse "lib/configs/route.config.json": ${e}`);
    }

    return config;
  }

  loadController(routeItem) {
    if (!routeItem || !routeItem.controller) {
      throw new Error(
        'Undefined "controller" property in "lib/configs/route.config.json"'
      );
    }

    try {
      // eslint-disable-next-line import/no-dynamic-require
      console.log("routeItem", routeItem);
      const controller = require(routeItem.controller);
      return controller;
    } catch (e) {
      throw new Error(`Unable to load ${routeItem.controller}: ${e}`);
    }
  }

  getRoute(routeItem) {
    if (!routeItem || !routeItem.route || routeItem.route.length === 0) {
      throw new Error(
        'Undefined or empty "route" property in "lib/configs/route.config.json"'
      );
    }

    return routeItem.route;
  }

  getMethod(routeItem) {
    if (!routeItem || !routeItem.method || routeItem.method.length === 0) {
      throw new Error(
        'Undefined or empty "method" property in "lib/configs/route.config.json"'
      );
    }

    const method = routeItem.method.toLowerCase();

    switch (method) {
      case "get":
      case "put":
      case "post":
      case "delete":
      case "patch":
        return method;
      default:
        throw new Error(
          `Invalid REST "method" property in "lib/configs/route.config.json": ${method}`
        );
    }
  }

  getAction(routeItem) {
    if (!routeItem || !routeItem.action || routeItem.action.length === 0) {
      return this.getMethod(routeItem);
    }
    return routeItem.action;
  }

  getSecured(routeItem) {
    return !!(routeItem?.secured ?? true);
  }

  registerRoute(
    application,
    controller,
    route,
    method,
    action,
    secured,
    settingsConfig
  ) {
    const middlewares = [];

    if (secured) {
      // Apply generic isAuthenticated middleware for all secured routes
      middlewares.push((req, res, next) =>
        isAuthenticated(settingsConfig, req, res, next)
      );
    }

    middlewares.push((req, res, next) =>
      controller[action](settingsConfig, req, res, next)
    );

    application.route(route)[method](...middlewares);
  }

  createConfigRoute(application, settingsConfig) {
    application.route("/config").get((req, res) => {
      res.status(200).json(settingsConfig.settings);
    });
  }

  registerRoutes(application, settingsConfig) {
    const config = this.loadRouteConfig();

    for (let i = 0, { length } = config.routes; i < length; i += 1) {
      const routeItem = config.routes[i];

      const controller = this.loadController(routeItem, application);
      const route = this.getRoute(routeItem);
      const method = this.getMethod(routeItem);
      const action = this.getAction(routeItem);
      const secured = this.getSecured(routeItem);

      this.registerRoute(
        application,
        controller,
        route,
        method,
        action,
        secured,
        settingsConfig
      );
    }
    if (settingsConfig.settings.environment === "local")
      this.createConfigRoute(application, settingsConfig);
  }
}

const routeConfig = new RouteConfig();

module.exports = routeConfig;
