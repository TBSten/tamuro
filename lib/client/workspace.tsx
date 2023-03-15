import { FC, ReactNode, createContext, useContext } from "react";
import { WorkspaceId, WorkspaceIdScheme, WorkspaceInput, WorkspaceScheme } from "types";
import { z } from "zod";

export const createWorkspace = async (input: WorkspaceInput) => {
    const res = await fetch("/api/workspaces", {
        method: "POST",
        body: JSON.stringify(input),
    }).then(r => r.json())
    return WorkspaceScheme.parse(res)
}

const JoinResScheme = z.object({
    ok: z.boolean(),
})
export const joinWorkspace = async (workspaceId: WorkspaceId) => {
    const res = await fetch(`/api/workspace/${workspaceId}/join`, {
        method: "POST",
    }).then(r => r.json())
    const joinRes = JoinResScheme.parse(res)
    return joinRes.ok
}

export const getWorkspace = async (workspaceId: WorkspaceId) => {
    const res = await fetch(`/api/workspace/${workspaceId}`).then(r => r.json())
    return WorkspaceScheme.parse(res)
}

const WorkspaceIdContext = createContext<WorkspaceId | null>(null)

interface WorkspaceIdProviderProps {
    workspaceId: WorkspaceId | null
    children: ReactNode
}
export const WorkspaceIdProvider: FC<WorkspaceIdProviderProps> = ({
    workspaceId,
    children,
}) => {
    return (
        <WorkspaceIdContext.Provider value={workspaceId}>
            {children}
        </WorkspaceIdContext.Provider>
    );
}
export function useWorkspaceId() {
    const workspaceId = useContext(WorkspaceIdContext)
    return WorkspaceIdScheme.parse(workspaceId)
}
