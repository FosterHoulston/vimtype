import { useState } from "react";

import type { Route } from "./+types/game-lobby";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Game lobby page" }, { name: "game-lobby", content: "basic pre-game settings" }];
}

export default function GameLobbyRoute() {
  const [tabs, setTabs] = useState(true);
  const [spaces, setSpaces] = useState(false);

  function onTabsClick() {
    console.log("tabs selected", tabs);
    setTabs(true);
    setSpaces(false);
  }
  function onSpacesClick() {
    console.log("Spaces selected", spaces);
    setSpaces(true);
    setTabs(false);
  }
  return (
    <div className="h-full flex flex-col justify-center items-center">
      <div className="mb-2">
        <button className="border rounded-l-full px-2" onClick={onTabsClick}>
          tabs
        </button>
        <button className="border rounded-r-full px-2" onClick={onSpacesClick}>
          spaces
        </button>
      </div>
      <button className="border rounded-full px-2 mb-2">line numbers</button>
      <button className="border rounded-full px-2">relative line numbers</button>
    </div>
  );
}
