import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext({
    theme: "light",
    toggleTheme: () => {},
    setTheme: () => {}
});

export function ThemeProvider({ children }) {
    const [theme, setThemeState] = useState(() => {
        try {
            return localStorage.getItem("loop_theme") || "light";
        } catch {
            return "light";
        }
    });

    useEffect(() => {
        const root = document.documentElement;
        root.setAttribute("data-theme", theme);
        if (theme === "dark") {
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
        }
        try {
            localStorage.setItem("loop_theme", theme);
        } catch {}
    }, [theme]);

    function toggleTheme() {
        setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
    }

    function setTheme(newTheme) {
        if (newTheme === "dark" || newTheme === "light") {
            setThemeState(newTheme);
        }
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export default ThemeContext;

