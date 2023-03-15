import { Box } from "@mui/material";
import { FC, ReactNode } from "react";

interface CenterProps {
    fill?: boolean
    children: ReactNode
}
const Center: FC<CenterProps> = ({ fill = true, children }) => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            {...fill ? { width: "100%", height: "100%" } : {}}
        >
            {children}
        </Box>
    );
}

export default Center;