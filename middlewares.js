import routes from "./routes";

export const localMiddleware = (req, res, next) => {
  res.locals.siteName = "Wetube";
  res.locals.routes = routes;
  next();
};
