import type { Route } from "./+types/GameSession";
import { GameSession } from "../GameSession/GameSession";
export function meta({}: Route.MetaArgs) {
  return [{ title: "VimType" }, { name: "description", content: "GameSession page reached!" }];
}

export default function GameSession() {
  return <GameSession />;
}
