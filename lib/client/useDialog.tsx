import { useState } from "react"

export interface DialogProps {
    open: boolean
    onClose: () => void
}

export function useDialog() {
    const [open, setOpen] = useState(false)
    const onOpen = () => setOpen(true)
    const onClose = () => setOpen(false)
    const dialogProps: DialogProps = {
        open, onClose,
    }
    return {
        open,
        onOpen,
        onClose,
        dialogProps,
    } as const
}