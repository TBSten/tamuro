import { Box } from "@mui/system";
import { FC, ReactNode } from "react";
import { useResponsive } from "../styles/useResponsive";

interface LayoutContentProps {
    children?: ReactNode
}
const LayoutContent: FC<LayoutContentProps> = ({ children }) => {
    const { responsive } = useResponsive()
    return (
        <Box p={responsive(3, 1)}>
            {children}
        </Box>
    );
}

export default LayoutContent;