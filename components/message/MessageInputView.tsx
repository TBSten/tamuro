import { InsertDriveFile, QuestionMark, Send } from "@mui/icons-material";
import { IconButton, InputBase, Stack } from "@mui/material";
import { FC, useState } from "react";
import { useResponsive } from "styles/useResponsive";
import { MessageInput } from "types";

interface MessageInputViewProps {
    value: MessageInput
    onChange: (updater: (p: MessageInput) => MessageInput) => void
    onSend: (input: MessageInput) => void
}
const MessageInputView: FC<MessageInputViewProps> = ({
    value,
    onChange,
    onSend,
}) => {
    const { responsive } = useResponsive()
    return (
        <Stack direction="column">
            <Stack p={responsive(1, 0.5)} direction="row">
                <InputBase
                    value={value.content}
                    onChange={(e) => onChange(p => ({ ...p, content: e.target.value }))}
                    fullWidth multiline
                    minRows={1}
                    maxRows={responsive(20, 15)}
                    sx={{ flexGrow: 1 }}
                />
            </Stack>
            <Stack direction="row" justifyContent="space-between">
                <Stack direction="row" pr={2} flexGrow={1} overflow="auto">
                    <IconButton>
                        <InsertDriveFile />
                    </IconButton>
                    <IconButton>
                        <QuestionMark />
                    </IconButton>
                    <IconButton>
                        <QuestionMark />
                    </IconButton>
                </Stack >
                <IconButton onClick={() => onSend(value)}>
                    <Send />
                </IconButton>
            </Stack>
        </Stack>
    );
}

export default MessageInputView;

export function useMessageInputView(init: MessageInput) {
    const [input, setInput] = useState(init)
    const onChange = (updater: (p: MessageInput) => MessageInput) => {
        setInput(p => updater(p))
    }
    const inputViewProps = {
        value: input,
        onChange,
    } as const
    return {
        messageInput: input,
        setMessageInput: setInput,
        inputViewProps,
    } as const
}
