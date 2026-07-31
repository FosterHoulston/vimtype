// This file will be the navbar component shared by all pages.
import { FaHome, FaKeyboard, FaInfo, FaTrophy, FaUser } from "react-icons/fa";
import { Link } from "react-router";

import logo from "./logo.svg";
import { NavIcon } from "./nav-icon";

export function Navbar() {
  return (
    <nav className="flex items-center w-full relative p-2">
      <Link to="/">
        <img src={logo} alt="Vimtype logo" />
      </Link>
      <div className="flex justify-center items-center absolute left-1/2 -translate-x-1/2 gap-4">
        <NavIcon to="/" label="Home" icon={FaHome} end />
        <NavIcon to="/game-session" label="Game Session" icon={FaKeyboard} />
        <NavIcon to="/game-info" label="Game Info" icon={FaInfo} />
        <NavIcon to="/leaderboards" label="Leaderboards" icon={FaTrophy} />
      </div>
      <div className="ml-auto">
        <NavIcon to="/profile" label="Profile" icon={FaUser} />
      </div>
    </nav>
  );
}
