import type { Route } from "./+types/game-session";
import { FollowPane } from "./follow-pane";
import { StatusBar } from "./status-bar";
import { TestPane } from "./test-pane";

export function meta({}: Route.MetaArgs) {
  return [{ title: "VimType" }, { name: "description", content: "GameSession page reached!" }];
}

export default function GameSessionRoute() {
  return (
    <main className="grid grid-cols-2 grid-rows-[1fr_auto] h-full">
      <TestPane />
      <FollowPane />
      <div className="col-span-2 h-8 border-t flex items-center">
        <StatusBar />
      </div>
    </main>
  );
}
