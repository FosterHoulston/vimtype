import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("game-session", "routes/game-session/game-session.tsx"),
] satisfies RouteConfig;
