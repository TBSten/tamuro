import { Box, Button, Card, CardActionArea, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import Emoji from "components/Emoji";
import GrayPaper from "components/GrayPaper";
import { useWorkflow } from "components/Workflow";
import { emojis } from "lib/client/emoji";
import { DialogProps, useDialog } from "lib/client/useDialog";
import { useEditDialog } from "lib/client/useEditDialog";
import { createWorkspace, getWorkspace, joinWorkspace } from "lib/client/workspace";
import { useSession } from "next-auth/react";
import { FC, useState } from "react";
import { UserId, Workspace, WorkspaceInput } from "types";
import WorkspaceEditDialog from "./WorkspaceEditDialog";

interface WorkspaceAddDialogProps extends DialogProps {
    onAddWorkspace: (ws: Workspace) => void
}
const WorkspaceAddDialog: FC<WorkspaceAddDialogProps> = ({
    open,
    onClose,
    onAddWorkspace,
}) => {
    const newDialog = useDialog()
    const joinDialog = useDialog()
    const handleNew = () => {
        newDialog.onOpen()
    }
    const handleJoin = () => {
        joinDialog.onOpen()
    }

    const { data: session } = useSession()
    const currentUserId = session?.user.id
    return (
        <>
            {/* first dialog */}
            <Dialog open={open} onClose={onClose} fullWidth>
                <DialogTitle>
                    <Emoji>{emojis.add}</Emoji>
                    ワークスペースの追加
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" px={1} pb={2}>
                        ワークスペースを追加するには、
                        <Emoji>{emojis.new}</Emoji>
                        新しいワークスペースを作成するか、
                        <Emoji>{emojis.join}</Emoji>
                        既存のワークスペースに参加してください。
                    </Typography>
                    <GrayPaper>
                        <Stack direction="row" justifyContent="space-around" py={2}>
                            <Card>
                                <CardActionArea onClick={handleNew}>
                                    <CardContent sx={{ fontSize: "min(25vw,25vh)", textAlign: "center" }}>
                                        <Typography sx={{ fontSize: "1rem", fontWeight: "bold" }}>
                                            新しいワークスペースを作成
                                        </Typography>
                                        <Box p={1}>
                                            <Emoji>{emojis.new}</Emoji>
                                        </Box>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                            <Card>
                                <CardActionArea onClick={handleJoin}>
                                    <CardContent sx={{ fontSize: "min(25vw,25vh)", textAlign: "center" }}>
                                        <Typography sx={{ fontSize: "1rem", fontWeight: "bold" }}>
                                            既存のワークスペースに参加
                                        </Typography>
                                        <Box p={1}>
                                            <Emoji>{emojis.join}</Emoji>
                                        </Box>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Stack>
                    </GrayPaper>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>キャンセル</Button>
                </DialogActions>
            </Dialog>

            {/* second dialogs */}
            {typeof currentUserId === "string" &&
                <WorkspaceNewDialog
                    currentUserId={currentUserId}
                    onAddWorkspace={onAddWorkspace}
                    {...newDialog.dialogProps}
                />
            }

            <WorkspaceJoinDialog
                onAddWorkspace={onAddWorkspace}
                {...joinDialog.dialogProps}
            />

        </>
    );
}

export default WorkspaceAddDialog;

const defaultWorkspaceInput = (userId: UserId): WorkspaceInput => ({
    name: "",
    detail: "",
    icon: {
        type: "emoji",
        emoji: "😀",
    },
    rooms: [],
    userIds: [userId],
})
interface WorkspaceNewDialogProps extends DialogProps {
    currentUserId: UserId
    onAddWorkspace: (ws: Workspace) => void
}
const WorkspaceNewDialog: FC<WorkspaceNewDialogProps> = ({ currentUserId, onAddWorkspace, ...propsDialogProps }) => {
    const { dialogProps: editDialogProps, onSave, } = useEditDialog<WorkspaceInput>(defaultWorkspaceInput(currentUserId), async (input) => {
        const newWorkspace = await createWorkspace(input)
        onAddWorkspace(newWorkspace)
    }, { dialogProps: propsDialogProps })
    const dialogProps: DialogProps = {
        ...editDialogProps,
        ...propsDialogProps,
    }
    const editWorkflow = useWorkflow()
    const handleAdd = async () => {
        await onSave()
        editWorkflow.onMove(0)
    }
    return (
        <WorkspaceEditDialog
            workflow={editWorkflow}
            {...editDialogProps}
            {...dialogProps}
            title={<>
                <Emoji>{emojis.new}</Emoji>
                ワークスペースの新規作成
            </>}
            actions={<>
                <Button variant="contained" onClick={handleAdd}>
                    新規作成
                </Button>
            </>}
        />
    );
}


interface WorkspaceJoinDialogProps extends DialogProps {
    onAddWorkspace: (ws: Workspace) => void
}
const WorkspaceJoinDialog: FC<WorkspaceJoinDialogProps> = ({ onAddWorkspace, ...dialogProps }) => {
    const [inputString, setInputString] = useState("")
    const [selectingWorkspace, setSelectingWorkspace] = useState<null | Workspace>(null)
    const requestSelect = async () => {
        alert("ワークスペースを選択してください")
    }
    const handleJoin = async () => {
        const targetWs = selectingWorkspace
        if (!targetWs) throw new Error("not implement")
        const okJoin = await joinWorkspace(selectingWorkspace.workspaceId)
        if (!okJoin) {
            throw new Error(`not implement can not join to workspace ${JSON.stringify(targetWs)}`)
        }
        const ws = await getWorkspace(selectingWorkspace.workspaceId)
        onAddWorkspace(ws)
    }
    return (
        <Dialog {...dialogProps} fullWidth>
            <DialogTitle>
                <Emoji>{emojis.join}</Emoji>
                ワークスペースに参加
            </DialogTitle>
            <DialogContent>
                参加するワークスペースのURLかIDを入力してください。
                <Box px={2} py={1}>
                    <TextField
                        label="ワークスペースのURL または ワークスペースID"
                        value={inputString}
                        onChange={e => setInputString(e.target.value)}
                        fullWidth
                    />
                </Box>
                <Box></Box>
            </DialogContent>
            <DialogActions>
                <Button variant="text" onClick={dialogProps.onClose}>キャンセル</Button>
                <Button
                    variant="contained"
                    disabled={selectingWorkspace === null}
                    onClick={() => selectingWorkspace ? handleJoin() : requestSelect()}
                >
                    ワークスペースに参加する
                </Button>
            </DialogActions>
        </Dialog>
    );
}

