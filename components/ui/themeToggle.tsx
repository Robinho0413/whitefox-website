import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "./button";

const ThemeToggle: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDarkMode(false);
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
  };

  return (
    <Button onClick={toggleTheme} variant={"icon"} size={"icon"} className="flex items-center justify-center self-center">
      {isDarkMode ? (
        <Image src="/icon/IcOutlineLightMode.svg" alt="Light mode" width={20} height={20} />
      ) : (
        <Image src="/icon/IcOutlineDarkMode.svg" alt="Dark mode" width={20} height={20} />
      )}
    </Button>
  );
};

export default ThemeToggle;