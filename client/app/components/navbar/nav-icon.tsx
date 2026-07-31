import type { IconType } from "react-icons";
import { NavLink } from "react-router";

type NavIconProps = {
  to: string;
  label: string;
  icon: IconType;
  end?: boolean;
};

export function NavIcon({ to, label, icon: Icon, end }: NavIconProps) {
  return (
    <NavLink
      to={to}
      end={end}
      aria-label={label}
      className={({ isActive }) => (isActive ? "text-green-500" : "text-white")}
    >
      <Icon />
    </NavLink>
  );
}
