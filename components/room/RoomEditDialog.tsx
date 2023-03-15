import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { Box } from "@mui/system";
import IconEdit from "components/IconEdit";
import Workflow, { WorkflowPage, useWorkflow } from "components/Workflow";
import { EditDialogProps } from "lib/client/useEditDialog";
import { FC, ReactNode } from "react";
import { RoomInput } from "types";

export interface RoomEditDialogProps extends EditDialogProps<RoomInput> {
    title?: ReactNode
    actions?: ReactNode
    workflow: ReturnType<typeof useWorkflow>
}
const RoomEditDialog: FC<RoomEditDialogProps> = ({
    open, onClose,
    value, onChange,
    title = <>ルームの編集</>, actions,
    workflow,
}) => {
    const { currentIndex, onNext, onBack, workflowProps } = workflow
    const workflowPages = [
        <BasicRoomEditPage key={0} index={0} {...{ value, onChange }} />,
        <RoomUsersEditPage key={1} index={1} />,
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

export default RoomEditDialog;

interface BasicRoomEditPageProps {
    index: number
    value: RoomInput
    onChange: EditDialogProps<RoomInput>["onChange"]
}
const BasicRoomEditPage: FC<BasicRoomEditPageProps> = ({ index, value, onChange }) => {
    return (
        <WorkflowPage index={index}>
            <Box px={2} py={1}>
                <IconEdit
                    value={value.icon}
                    onChange={(icon) => onChange(p => ({ ...p, icon }))}
                />
                <TextField
                    label="ルーム名"
                    value={value.name}
                    onChange={e => onChange(p => ({ ...p, name: e.target.value }))}
                />
            </Box>
            <Box px={2} py={1}>
                <TextField
                    label="ルームの説明"
                    value={value.detail}
                    onChange={e => onChange(p => ({ ...p, detail: e.target.value }))}
                    multiline minRows={2}
                    fullWidth
                />
            </Box>
        </WorkflowPage>
    );
}

interface RoomUsersEditPageProps {
    index: number
}
const RoomUsersEditPage: FC<RoomUsersEditPageProps> = ({ index }) => {
    return (
        <WorkflowPage index={index}>
            <Box px={2} py={1}>
                select users
            </Box>
        </WorkflowPage>
    );
}
