import MuiLink from "@mui/material/Link";
import NextLink from "next/link";
import { FC, ReactNode } from "react";

interface LinkProps {
    href: string
    children: ReactNode
}
const Link: FC<LinkProps> = ({ href, children }) => {
    return (
        <NextLink {...{ href }}>
            <MuiLink>
                {children}
            </MuiLink>
        </NextLink>
    );
}

export default Link;