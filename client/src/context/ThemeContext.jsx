import React, { createContext, useEffect } from "react";

export const ThemeContext = createContext({ theme: "light" });

export function ThemeProvider({ children }) {
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", "light");
        document.body.classList.remove("dark-mode");
        localStorage.removeItem("loop_theme");
    }, []);

    return (
        <ThemeContext.Provider value={{ theme: "light", toggleTheme: () => {}, setTheme: () => {} }}>
            {children}
        </ThemeContext.Provider>
    );
}

export default ThemeContext;

