import { Paper as MuiPaper, PaperProps as MuiPaperProps } from "@mui/material";
import { FC } from "react";

interface PaperProps extends MuiPaperProps {
}
const Paper: FC<PaperProps> = ({ children, ...props }) => {
    return (
        <MuiPaper {...props}>
            {children}
        </MuiPaper>
    );
}

export default Paper;