import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("game-session", "routes/GameSession.tsx"),
] satisfies RouteConfig;
