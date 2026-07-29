import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("game-session", "routes/game-session/game-session.tsx"),
  route("game-info", "routes/game-info.tsx"),
  route("leaderboards", "routes/leaderboards.tsx"),
  route("profile", "routes/profile.tsx"),
] satisfies RouteConfig;
