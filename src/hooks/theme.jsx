import { useContext, createContext, useState, useEffect } from "react";

const themeContext = createContext({
    theme: "",
    toggleTheme: () => {}
});

export default function ThemeProvider({children}){
    const [theme, setTheme] = useState(() => {
        const stored = localStorage.getItem("storedTheme");
        if(stored) return stored;
    
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    });

    useEffect(() => {
        const root = document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(theme);

        localStorage.setItem("storedTheme", theme);
    }, [theme])

    const toggleTheme = () => {
        if(!document.startViewTransition){
            setTheme((t) => t === "light" ? "dark" : "light")
            return;
        }

        document.startViewTransition(() => {
            setTheme((t) => t === "light" ? "dark" : "light")
        })
    }

    return(
        <>
            <themeContext.Provider value={{theme, toggleTheme}}>
                    {children}
            </themeContext.Provider>
        </>
    )
}

export const useTheme = () => useContext(themeContext);
