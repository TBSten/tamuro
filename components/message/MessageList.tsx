import { Box } from "@mui/system";
import Center from "components/Center";
import { useMessages } from "lib/client/message";
import { FC, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { RoomId, UserId, WorkspaceId } from "types";
import MessageView from "./MessageView";

interface MessageListProps {
    workspaceId: WorkspaceId
    roomId: RoomId
    currentUserId: UserId
}
const MessageList: FC<MessageListProps> = (props) => {
    return <MessageListContent key={[props.workspaceId, props.roomId].join("")} {...props} />
}

export default MessageList;

type MessageListContentProps = MessageListProps
const MessageListContent: FC<MessageListContentProps> = ({
    workspaceId,
    roomId,
    currentUserId,
}) => {
    const scrollerRef = useRef<HTMLElement>(null)
    const scrollBottomRef = useRef(0)
    const { messages, onMore, isLoading, hasMore } = useMessages(workspaceId, roomId, {
        onLoadStart() {
            const top = scrollerRef.current!.scrollTop ?? 0
            const height = scrollerRef.current!.scrollHeight ?? 0
            const bottom = height - top
            scrollBottomRef.current = bottom
            console.log("start", top, height, bottom)
        },
    })
    useEffect(() => {
        const bottom = scrollBottomRef.current
        const height = scrollerRef.current!.scrollHeight ?? 0
        const top = -bottom + height
        scrollerRef.current!.scrollTop = top
        console.log("end", top, height, bottom)
    }, [messages])
    const [sentinelRef,] = useInView({
        onChange(inView, entry) {
            if (!inView) return
            onMore()
        },
    })
    return (
        <Box width="100%" height="100%" overflow="auto" ref={scrollerRef}>
            {hasMore
                ? <Box ref={sentinelRef} />
                : <Center fill={false}>
                    これ以上ありません
                </Center>
            }
            {messages.map(msg =>
                <MessageView
                    key={msg.messageId}
                    message={msg}
                    isMine={msg.authorId === currentUserId}
                />
            )}
        </Box>
    );
}

