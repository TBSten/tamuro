import { useState } from "react"
import { DialogProps, useDialog } from "./useDialog"

type Updater = <T, >(p: T) => T
export interface EditDialogProps<T> extends DialogProps {
    open: boolean
    onClose: () => void
    value: T
    onChange: (updater: Updater) => void
    onSave: (value: T) => void
}

export function useEditDialog<T>(
    init: T,
    onSave: (value: T) => (Promise<void> | void),
    { closeOnSave = true, inputClearOnSave = true, awaitSave = false, dialogProps: optionsDialogProps }: {
        closeOnSave?: boolean,
        inputClearOnSave?: boolean,
        awaitSave?: boolean,
        dialogProps?: DialogProps,
    } = {},
) {
    const defaultDialog = useDialog()
    const { onOpen, onClose, dialogProps } = {
        ...defaultDialog,
        ...optionsDialogProps,
        dialogProps: optionsDialogProps ?? defaultDialog.dialogProps,
    }
    const [value, setValue] = useState(init)
    const onChange = (updater: Updater) => setValue(p => updater(p))
    const handleSave = async () => {
        if (awaitSave) {
            await onSave(value)
        } else {
            onSave(value)
        }
        if (closeOnSave) onClose()
        if (inputClearOnSave) setValue(init)
    }

    const editDialogProps: EditDialogProps<T> = {
        ...dialogProps,
        value,
        onChange,
        onSave: handleSave,
    }
    return {
        onOpen,
        value,
        setValue,
        onSave: handleSave,
        dialogProps: editDialogProps,
    } as const
}