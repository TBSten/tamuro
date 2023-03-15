import { ThemeProvider, createTheme } from "@mui/material";
import { ReactNode } from "react";

const theme = createTheme({
    palette: {
        primary: {
            light: "#50aa46",
            dark: "#50aa46",
            main: "#50aa46",
            contrastText: "white",
        },
        contrastThreshold: 4.5,
    }
})
export const TamuroThemeProvider = ({ children }: { children: ReactNode }) => {
    return <ThemeProvider theme={theme}>
        {children}
    </ThemeProvider>
}
