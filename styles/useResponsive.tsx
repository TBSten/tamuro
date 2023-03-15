import { useMediaQuery } from "@mui/material";
import { useCallback } from "react";

export function useResponsive() {
    const isPc = useMediaQuery('(min-width:600px)');
    const responsive = useCallback(<T,>(whenPc: T, whenSp: T): T =>
        isPc ? whenPc : whenSp,
        [isPc]
    )
    return {
        isPc,
        isSp: !isPc,
        responsive,
    } as const
}
