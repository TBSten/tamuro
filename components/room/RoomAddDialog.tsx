import { Button } from "@mui/material";
import { useWorkflow } from "components/Workflow";
import { createRoom } from "lib/client/room";
import { DialogProps } from "lib/client/useDialog";
import { useEditDialog } from "lib/client/useEditDialog";
import { useWorkspaceId } from "lib/client/workspace";
import { FC } from "react";
import { Room, RoomInput } from "types";
import RoomEditDialog from "./RoomEditDialog";

const defaultRoomInput: RoomInput = {
    name: "雑談",
    detail: "和気あいあいとおしゃべりするためのルームです。",
    icon: {
        type: "emoji",
        emoji: "💡",
    },
    userIds: [],
}

interface RoomAddDialogProps extends DialogProps {
    onAddRoom: (room: Room) => void
}
const RoomAddDialog: FC<RoomAddDialogProps> = ({
    onAddRoom,
    ...propsDialogProps
}) => {
    const workspaceId = useWorkspaceId()
    const editDialog = useEditDialog<RoomInput>(defaultRoomInput, async (input) => {
        const newRoom = await createRoom(workspaceId, input)
        onAddRoom(newRoom)
    }, { dialogProps: propsDialogProps })
    const dialogProps = {
        ...editDialog.dialogProps,
        ...propsDialogProps,
    }
    const editWorkflow = useWorkflow()
    const handleAdd = async () => {
        await editDialog.onSave()
        editWorkflow.onMove(0)
    }
    return (
        <RoomEditDialog
            title="ルームの追加"
            actions={<>
                <Button variant="contained" onClick={handleAdd}>
                    追加
                </Button>
            </>}
            workflow={editWorkflow}
            {...dialogProps}
        />
    );
}

export default RoomAddDialog;