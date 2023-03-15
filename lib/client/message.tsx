import { useCallback, useEffect, useRef, useState } from "react";
import { Message, MessageInput, MessageScheme, RoomId, WorkspaceId } from "types";
import { z } from "zod";

export const sendNewMessage = async (workspaceId: WorkspaceId, roomId: RoomId, input: MessageInput) => {
    const res = await fetch(`/api/workspace/${workspaceId}/room/${roomId}/messages`, {
        method: "POST",
        body: JSON.stringify(input),
    }).then(r => r.json())
    return MessageScheme.parse(res)
}

export const getMessages = async (
    workspaceId: WorkspaceId,
    roomId: RoomId,
    before: number,
    limit: number,
) => {
    const res = await fetch(`/api/workspace/${workspaceId}/room/${roomId}/messages/?before=${before}&limit=${limit}`).then(r => r.json())
    return z.array(MessageScheme).parse(res)
}

export const useMessages = (
    wsId: WorkspaceId,
    roomId: RoomId,
    { limit = 20, onLoadStart, onLoadEnd }: {
        limit?: number,
        onLoadStart?: () => void,
        onLoadEnd?: (msgs: Message[]) => void,
    } = {},
) => {
    const onLoadStartCallback = useRef(onLoadStart)
    onLoadStartCallback.current = onLoadStart
    const onLoadEndCallback = useRef(onLoadEnd)
    onLoadEndCallback.current = onLoadEnd
    useEffect(() => {
        setMessages([])
        setIsLoading(false)
        _isLoading.current = false
        sentinel.current = Date.now().valueOf()
        _hasMore.current = true
    }, [wsId, roomId])
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const _isLoading = useRef(false)
    const startLoad = () => {
        setIsLoading(true)
        _isLoading.current = true
    }
    const endLoad = () => {
        setIsLoading(false)
        _isLoading.current = false
    }
    const sentinel = useRef(Date.now().valueOf())
    const _hasMore = useRef(true)
    const [hasMore, setHasMore] = useState(true)
    const noneMore = () => {
        setHasMore(false)
        _hasMore.current = false
    }
    const onMore = useCallback(async () => {
        if (_isLoading.current) return
        if (!_hasMore.current) return
        startLoad()
        onLoadStartCallback.current?.()
        const messages = await getMessages(wsId, roomId, sentinel.current, limit)
        setMessages(p => [...messages, ...p,])
        sentinel.current = messages.length >= 1
            ? messages[0].createAt
            : -1
        if (messages.length !== limit) noneMore()
        endLoad()
        onLoadEndCallback.current?.(messages)
    }, [limit, roomId, wsId])
    return {
        messages,
        isLoading,
        onMore,
        hasMore,
    } as const
}
