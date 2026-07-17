import type { Route } from "./+types/game-session";
import { GameSessionCard } from "./game-session-card";

export function meta({}: Route.MetaArgs) {
  return [{ title: "VimType" }, { name: "description", content: "GameSession page reached!" }];
}

export default function GameSessionRoute() {
  return <GameSessionCard />;
}
