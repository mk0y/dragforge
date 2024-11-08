"use client";
import { Moon, Sun } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";

const ModeSwitch = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    }
  }, [isDarkMode]);
  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);
  return (
    <Button
      size="icon"
      variant="secondary"
      onClick={toggleDarkMode}
      className="rounded-full w-9 h-9"
    >
      {isDarkMode ? <Moon /> : <Sun />}
    </Button>
  );
};

export default ModeSwitch;
