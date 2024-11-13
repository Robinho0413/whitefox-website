import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";

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

  const toggleTheme = (checked: boolean) => {
    if (checked) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    setIsDarkMode(checked);
  };

  return (
    <div className="flex items-center">
      {/* Icône pour mode clair */}
      <span className={`mr-2 ${isDarkMode ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}>
        <Image src="/images/MaterialSymbolsLightModeRounded.svg" alt="Light mode" width={24} height={24} />
      </span>
      {/* Le Switch */}
      <Switch checked={isDarkMode} onCheckedChange={toggleTheme} />
      {/* Icône pour mode sombre */}
      <span className={`ml-2 ${isDarkMode ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}>
        <Image src="/images/MaterialSymbolsDarkModeRounded.svg" alt="Dark mode" width={24} height={24} />
      </span>
    </div>
  );
};

export default ThemeToggle;
