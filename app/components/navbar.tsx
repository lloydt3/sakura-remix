import { NavLink } from "@remix-run/react";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { ComputerDesktopIcon } from "@heroicons/react/24/outline";

export default function Navbar() {
  const [theme, setTheme] = useState<"dark" | "light" | "system">(() => {
    if (typeof window !== "undefined") {
      if (localStorage.theme === "dark") return "dark";
      if (localStorage.theme === "light") return "light";
    }
    return "system";
  });
  useEffect(() => {
    if (theme === "dark") {
      localStorage.theme = "dark";
      document.documentElement.classList.add("dark");
    } else if (theme === "light") {
      localStorage.theme = "light";
      document.documentElement.classList.remove("dark");
    } else {
      localStorage.removeItem("theme");
      document.documentElement.classList.toggle(
        "dark",
        window.matchMedia("(prefers-color-scheme: dark)").matches,
      );
    }
  }, [theme]);

  return (
    <>
      <div className="h-14 w-full"></div>
      <div className="fixed top-0 flex h-14 w-full items-center justify-center gap-5 backdrop-blur-sm">
        <div className="mx-5 flex w-full items-center justify-between">
          <div className="flex items-center gap-5">
            <NavLink
              className={({ isActive, isPending }) =>
                isPending
                  ? "pending"
                  : isActive
                    ? "rounded-md bg-sky-200 px-2 py-1 transition-all duration-200 hover:shadow-md active:shadow-sm dark:bg-sky-800"
                    : "rounded-md px-2 py-1 shadow-sm shadow-sky-300/20 transition-all duration-200 hover:shadow-md hover:shadow-sky-300/20 active:shadow-sm"
              }
              to="/"
            >
              Home
            </NavLink>
            <NavLink
              className={({ isActive, isPending }) =>
                isPending
                  ? "pending"
                  : isActive
                    ? "rounded-md bg-sky-200 px-2 py-1 transition-all duration-200 hover:shadow-md active:shadow-sm dark:bg-sky-800"
                    : "rounded-md px-2 py-1 shadow-sm shadow-sky-300/20 transition-all duration-200 hover:shadow-md hover:shadow-sky-300/20 active:shadow-sm"
              }
              to="/pdf"
            >
              PDF
            </NavLink>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="text-sm focus:outline-none">
              {theme === "system" ? (
                <ComputerDesktopIcon className="h-5 w-5 text-zinc-400" />
              ) : theme === "dark" ? (
                <MoonIcon className="h-5 w-5 text-yellow-400" />
              ) : (
                <SunIcon className="h-5 w-5 text-orange-400" />
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setTheme("system")}>
                <div className="flex gap-2">
                  <ComputerDesktopIcon className="h-5 w-5 text-zinc-400" />
                  <span>システム</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setTheme("dark")}>
                <div className="flex gap-2">
                  <MoonIcon className="h-5 w-5 text-yellow-400" />
                  <span>暗め</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setTheme("light")}>
                <div className="flex gap-2">
                  <SunIcon className="h-5 w-5 text-orange-400" />
                  <span>明るい</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
}
