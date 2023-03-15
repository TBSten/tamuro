import { useSession } from "next-auth/react";
import { useQuery } from "react-query";
import { WorkspaceScheme } from "types";
import { z } from "zod";

const workspacesFetcher = async () => {
    const res = await fetch(`/api/workspaces`).then(r => r.json())
    return z.array(WorkspaceScheme).parse(res)
}

export function useCurrentUserWorkspaces() {
    const { data: session } = useSession({
        required: true,
    })
    const userId = session?.user.id
    const { data: workspaces, isFetching, refetch } = useQuery(
        ["workspaces", userId],
        workspacesFetcher,
    )
    return {
        workspaces: workspaces ?? null,
        isLoading: isFetching,
        resresh: refetch,
    } as const
}
