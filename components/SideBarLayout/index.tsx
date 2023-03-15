import { Box, Divider, List, ListItem, ListItemButton, ListItemButtonProps, ListProps, SxProps } from "@mui/material";
import { FC, ReactNode, createContext, useCallback, useContext, useState } from "react";

interface SideBarLayoutProps {
    openSideBar?: boolean
    onOpenSideBar?: () => void
    onCloseSideBar?: () => void
    sidebar: ReactNode
    children: ReactNode
    // width?: CSSProperties["width"]
    sideBarSx?: SxProps
    disableDivider?: boolean
}
const SideBarLayout: FC<SideBarLayoutProps> = ({
    sidebar, children,
    openSideBar = true, onOpenSideBar, onCloseSideBar,
    sideBarSx,
    disableDivider = false,
}) => {
    return (
        <Box
            width="100%"
            height="100%"
            display="flex"
            flexDirection="row"
        >
            {openSideBar &&
                <Box flexGrow={0} flexShrink={0} sx={{ overflow: "auto", ...sideBarSx }}>
                    {sidebar}
                </Box>
            }
            {!disableDivider &&
                <Divider orientation="vertical" flexItem />
            }
            <Box flexGrow={1} flexShrink={1} sx={{ overflow: "auto" }}>
                {children}
            </Box>
        </Box>
    );
}

export default SideBarLayout;

export function useSideBarLayout(initOpen: boolean = true) {
    const [openSideBar, setOpenSideBar] = useState(initOpen)
    const onOpenSideBar = useCallback(() => setOpenSideBar(true), [])
    const onCloseSideBar = useCallback(() => setOpenSideBar(false), [])
    const onToggleSideBar = useCallback(() => setOpenSideBar(p => !p), [])
    const sideBarLayoutProps = {
        openSideBar,
        onOpenSideBar,
        onCloseSideBar,
    } as const
    return {
        openSideBar: onOpenSideBar,
        closeSideBar: onCloseSideBar,
        toggleSideBar: onToggleSideBar,
        sideBarLayoutProps,
    } as const
}

interface SideBarListProps extends ListProps {
    children?: ReactNode
}
export const SideBarList: FC<SideBarListProps> = ({ children, ...listPorps }) => {
    return (
        <List {...listPorps}>{children}</List>
    );
}

interface SideBarListItemProps {
    children?: ReactNode
}
export const SideBarListItem: FC<SideBarListItemProps> = ({ children }) => {
    return (
        <ListItem>{children}</ListItem>
    );
}

interface SideBarListButtonProps extends ListItemButtonProps {
    children?: ReactNode
}
export const SideBarListButton: FC<SideBarListButtonProps> = ({ children, ...liButtonProps }) => {
    return (
        <ListItem disablePadding>
            <ListItemButton {...liButtonProps}>{children}</ListItemButton>
        </ListItem>
    );
}

const accordionContext = createContext({
    open: true as boolean,
    toggle: () => { },
} as const)
interface SideBarListAccordionProps {
    title: ReactNode
    children: ReactNode
}
export const SideBarListAccordion: FC<SideBarListAccordionProps> = ({
    title, children,
}) => {
    const [open, setOpen] = useState(false)
    const toggle = useCallback(() => setOpen(p => !p), [])
    return (
        <>
            <accordionContext.Provider value={{ open, toggle }}>
                <SideBarListButton onClick={toggle}>
                    {title}
                </SideBarListButton>
                {open &&
                    <Box pl={2}>{children}</Box>
                }
            </accordionContext.Provider>
        </>
    );
}

interface SideBarListAccordionTitleProps {
    children: ReactNode
}
export const SideBarListAccordionTitle: FC<SideBarListAccordionTitleProps> = ({ children }) => {
    const context = useContext(accordionContext)
    return (
        <SideBarListButton onClick={context.toggle}>
            {children}
        </SideBarListButton>
    );
}
interface SideBarListAccordionContentProps {
    children: ReactNode
}
export const SideBarListAccordionContent: FC<SideBarListAccordionContentProps> = ({ children }) => {
    const context = useContext(accordionContext)
    if (context.open) {
        return (
            <Box pl={2}>
                {children}
            </Box>
        );
    } else {
        return <></>
    }
}


