import { Box, Divider, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Icon from "components/Icon";
import { useUser } from "lib/client/user/useUser";
import { FC, useMemo } from "react";
import { Message } from "types";

interface MessageViewProps {
    message: Message
    isMine?: boolean
}
const MessageView: FC<MessageViewProps> = ({
    message,
    isMine = false,
}) => {
    const theme = useTheme()
    const createDate = useMemo(() => new Date(message.createAt), [message.createAt])
    const { user: author } = useUser(message.authorId)
    return (
        <Box>
            <Stack direction="row">
                <Box>
                    {author &&
                        <Box p={1}>
                            <Icon>{author.image}</Icon>
                        </Box>
                    }
                </Box>
                <Stack flexGrow={1} p={1}>
                    <Box>
                        <Box fontWeight="bold" component="span">
                            {author?.name ?? "..."}
                        </Box>
                        {" "}
                        <DateView date={createDate} />
                    </Box>
                    {message.content}
                </Stack>
            </Stack>
            <Divider />
        </Box>
    );
}

export default MessageView;


interface DateViewProps {
    date: Date
}
const DateView: FC<DateViewProps> = ({
    date,
}) => {
    const theme = useTheme()
    return (
        <Stack component="span" display="inline-flex" direction="row" justifyContent="flex-end" color={theme.palette.grey.A700} fontSize="0.75em">
            {date.getMonth() + 1}
            :
            {date.getDate()}
            {" "}
            {date.getHours()}
            /
            {date.getMinutes()}
        </Stack>
    );
}

