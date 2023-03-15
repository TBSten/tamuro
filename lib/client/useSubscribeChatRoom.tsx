import Pusher from "pusher-js";
import { useEffect, useRef } from "react";
import { ChatRoomId } from "../../types/id";

export function useSubscribeChatRoom(chatRoomId: ChatRoomId, onRefresh: () => void) {
    const callbackRef = useRef(onRefresh)
    callbackRef.current = onRefresh
    useEffect(() => {
        const pusher = new Pusher('5da3f99f092a84b61bd1', {
            cluster: 'ap3'
        });
        const channel = pusher.subscribe(`chatRooms/${chatRoomId}`);
        channel.bind('haveToRefresh', () => {
            callbackRef.current()
        });
        return () => {
            channel.unbind_all()
            channel.disconnect()
            pusher.disconnect()
        }
    }, [chatRoomId])
}
