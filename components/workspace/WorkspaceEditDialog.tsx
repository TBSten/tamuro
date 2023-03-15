import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { Box } from "@mui/system";
import IconEdit from "components/IconEdit";
import Workflow, { WorkflowPage, useWorkflow } from "components/Workflow";
import { EditDialogProps } from "lib/client/useEditDialog";
import { FC, ReactNode } from "react";
import { WorkspaceInput } from "types";

interface WorkspaceEditDialogProps extends EditDialogProps<WorkspaceInput> {
    title?: ReactNode
    actions?: ReactNode
    workflow: ReturnType<typeof useWorkflow>
}
const WorkspaceEditDialog: FC<WorkspaceEditDialogProps> = ({
    open, onClose,
    value, onChange,
    title = <>ワークスペースの編集</>, actions,
    workflow,
}) => {
    const { currentIndex, onNext, onBack, workflowProps } = workflow
    const workflowPages = [
        <BasicWsEditPage key={0} index={0} {...{ value, onChange }} />,
        <WsUsersEditPage key={1} index={1} />,
        <WsRoomsEditPage key={2} index={2} />,
    ]
    return (
        <Dialog {...{ open, onClose, }} fullWidth>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <Workflow {...workflowProps}>
                    {workflowPages}
                </Workflow>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>キャンセル</Button>
                <Button variant="text" onClick={onBack} disabled={currentIndex === 0}>戻る</Button>
                {currentIndex !== workflowPages.length - 1
                    ? <Button variant="contained" onClick={onNext}>次へ</Button>
                    :
                    <>{actions}</>
                }
            </DialogActions>
        </Dialog>
    );
}

export default WorkspaceEditDialog;

interface BasicWsEditPageProps {
    index: number
    value: WorkspaceInput
    onChange: EditDialogProps<WorkspaceInput>["onChange"]
}
const BasicWsEditPage: FC<BasicWsEditPageProps> = ({ index, value, onChange }) => {
    return (
        <WorkflowPage index={index}>
            <Box px={2} py={1}>
                <IconEdit
                    value={value.icon}
                    onChange={(icon) => onChange(p => ({ ...p, icon }))}
                />
                <TextField
                    label="ワークスペース名"
                    value={value.name}
                    onChange={e => onChange(p => ({ ...p, name: e.target.value }))}
                />
            </Box>
            <Box px={2} py={1}>
                <TextField
                    label="ワークスペースの説明"
                    value={value.detail}
                    onChange={e => onChange(p => ({ ...p, detail: e.target.value }))}
                    multiline minRows={2}
                    fullWidth
                />
            </Box>
        </WorkflowPage>
    );
}

interface WsUsersEditPageProps {
    index: number
}
const WsUsersEditPage: FC<WsUsersEditPageProps> = ({ index }) => {
    return (
        <WorkflowPage index={index}>
            <Box px={2} py={1}>
                select users
            </Box>
        </WorkflowPage>
    );
}

interface WsRoomsEditPageProps {
    index: number
}
const WsRoomsEditPage: FC<WsRoomsEditPageProps> = ({ index }) => {
    return (
        <WorkflowPage index={index}>
            <Box px={2} py={1}>
                create rooms
            </Box>
        </WorkflowPage>
    );
}

