import { useTheme } from "../context/ThemeContext";
import { colors } from "./colors";

export const getCategoryColor = (name: string): { className: string; } => {
    const entry = colors.find((c) => c.name === name.toLowerCase());
    const { theme } = useTheme();
    if (theme === "dark") {
        return {
            className: entry?.darkBackgroundColor ?? "bg-gray-200 border-gray-400",
        };
    }
    return {
        className: entry?.backgroundColor ?? "bg-gray-200 border-gray-400",
    };

}; 