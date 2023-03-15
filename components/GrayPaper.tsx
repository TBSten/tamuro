import { Paper as MuiPaper, PaperProps as MuiPaperProps, useTheme } from "@mui/material";
import { FC } from "react";

interface PaperProps extends MuiPaperProps {
}
const Paper: FC<PaperProps> = ({ children, sx, ...props }) => {
    const theme = useTheme()
    return (
        <MuiPaper elevation={0} sx={{ bgcolor: theme.palette.grey[300], ...sx, }} {...props}>
            {children}
        </MuiPaper>
    );
}

export default Paper;
