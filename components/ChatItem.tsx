import { FC } from "react";
import { Message } from "../types";

interface ChatItemProps {
    isMine: boolean
    message: Message
}
const ChatItem: FC<ChatItemProps> = ({ }) => {
    return (
        <div></div>
    );
}

export default ChatItem;
