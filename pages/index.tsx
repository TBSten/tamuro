
import { Add } from '@mui/icons-material'
import { Avatar, Button, CircularProgress, Divider, IconButton, TextField, useTheme } from '@mui/material'
import { Box } from '@mui/system'
import Center from 'components/Center'
import Icon from 'components/Icon'
import Link from 'components/Link'
import MessageInputView, { useMessageInputView } from 'components/message/MessageInputView'
import MessageList from 'components/message/MessageList'
import RoomAddDialog from 'components/room/RoomAddDialog'
import WorkspaceAddDialog from 'components/workspace/WorkspaceAddDialog'
import { sendNewMessage } from 'lib/client/message'
import { useCurrentUserWorkspaces } from 'lib/client/useCurrentUserWorkspaces'
import { useDialog } from 'lib/client/useDialog'
import { useUserId } from 'lib/client/user/useUserId'
import { WorkspaceIdProvider } from 'lib/client/workspace'
import { FC, useMemo, useState } from 'react'
import LayoutContent from '../components/LayoutContent'
import SideBarLayout, { SideBarList, SideBarListButton, SideBarListItem, useSideBarLayout } from '../components/SideBarLayout'
import { MessageInput, Room, RoomId, UserId, Workspace, WorkspaceId } from '../types'

type Props = {}

export default function Home({ }: Props) {
  const workSpacesSideBar = useSideBarLayout(true)
  const chatRoomsSideBar = useSideBarLayout(true)
  const {
    workspaces,
    isLoading: isLoadingWorkspaces,
    resresh: refreshWorkspaces,
  } = useCurrentUserWorkspaces()
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<WorkspaceId | null>(null)
  const [selectedRoomId, setSelectedRoomId] = useState<RoomId | null>(null)
  const selectedWorkspace = useMemo(() =>
    workspaces?.find(ws => ws.workspaceId === selectedWorkspaceId),
    [selectedWorkspaceId, workspaces]
  )
  const rooms = selectedWorkspace?.rooms
  const selectedRoom = useMemo(() =>
    rooms?.find(room => room.roomId === selectedRoomId),
    [rooms, selectedRoomId])
  const handleSelectWorkspace = (workspaceId: WorkspaceId) => {
    setSelectedWorkspaceId(p => p === workspaceId ? null : workspaceId)
    setSelectedRoomId(null)
  }
  const handleSelectRoom = (roomId: RoomId) => {
    setSelectedRoomId(p => p === roomId ? null : roomId)
  }

  const addWsDialog = useDialog()
  const handleRequestAddWorkspace = () => {
    addWsDialog.onOpen()
  }
  const handleAddWorkspace = async (ws: Workspace) => {
    setSelectedWorkspaceId(ws.workspaceId)
    refreshWorkspaces()
    addWsDialog.onClose()
  }
  const addRoomDialog = useDialog()
  const handleRequestAddRoom = () => {
    addRoomDialog.onOpen()
  }
  const handleAddRoom = async (room: Room) => {
    setSelectedRoomId(room.roomId)
    refreshWorkspaces()
    addWsDialog.onClose()
  }
  const currentUserId = useUserId()

  const handleSendNewMessage = async (input: MessageInput) => {
    if (!selectedWorkspaceId || !selectedRoomId) {
      console.error("invalid workspace or room", selectedWorkspaceId, selectedRoomId)
      throw new Error("not implement")
    }
    await sendNewMessage(selectedWorkspaceId, selectedRoomId, input)
    //TODO refresh messages
  }

  const theme = useTheme()
  return (
    <>
      <WorkspaceIdProvider workspaceId={selectedWorkspaceId}>
        {/* Workspaces */}
        <SideBarLayout
          {...workSpacesSideBar.sideBarLayoutProps}
          sidebar={
            workspaces
              ? <WorkspacesSideBar
                selected={selectedWorkspaceId}
                onSelect={handleSelectWorkspace}
                workspaces={workspaces}
                onAddWorkspace={handleRequestAddWorkspace}
              />
              : <CircularProgress />
          }
          sideBarSx={{
            bgcolor: theme.palette.primary.main,
          }}
          disableDivider
        >
          {/* Rooms */}
          <SideBarLayout
            {...chatRoomsSideBar.sideBarLayoutProps}
            sidebar={
              rooms && <RoomsSideBar
                workspace={selectedWorkspace}
                rooms={rooms}
                selected={selectedRoomId}
                onAdd={handleRequestAddRoom}
                onSelect={handleSelectRoom}
              />
            }
          >
            {selectedWorkspace && selectedRoom && currentUserId ?
              <WorkspaceRoomTalks
                currentUserId={currentUserId}
                workspace={selectedWorkspace}
                room={selectedRoom}
                onSendNewMessage={handleSendNewMessage}
              />
              :
              selectedWorkspace ?
                <AboutWorkspace
                  workspace={selectedWorkspace}
                />
                :
                <>...</>
            }
          </SideBarLayout>
        </SideBarLayout>

        <WorkspaceAddDialog
          onAddWorkspace={handleAddWorkspace}
          {...addWsDialog.dialogProps}
        />

        {selectedWorkspaceId &&
          <RoomAddDialog
            onAddRoom={handleAddRoom}
            {...addRoomDialog.dialogProps}
          />
        }
      </WorkspaceIdProvider>
    </>
  )
}

interface WorkspacesSideBarProps {
  selected: WorkspaceId | null
  workspaces: Workspace[]
  onSelect: (wsId: WorkspaceId) => void
  onAddWorkspace: () => void
}
const WorkspacesSideBar: FC<WorkspacesSideBarProps> = ({
  workspaces, selected,
  onSelect, onAddWorkspace,
}) => {
  const theme = useTheme()
  return (
    <SideBarList sx={{ width: "auto", maxWidth: "100%", color: theme.palette.background.paper, }}>
      {workspaces.map((ws) =>
        <SideBarListButton
          key={ws.workspaceId}
          onClick={() => onSelect(ws.workspaceId)}
        >
          {/* <Avatar variant='rounded' /> */}
          <Center>
            <Box
              border="solid 2px"
              borderRadius="0.25rem"
              borderColor={selected === ws.workspaceId ? theme.palette.background.paper : "rgba(0,0,0,0)"}
              p={0.5}
            >
              <Avatar variant='rounded'>
                <Icon>{ws.icon}</Icon>
              </Avatar>
            </Box>
          </Center>
        </SideBarListButton>
      )}
      <SideBarListItem>
        <IconButton onClick={onAddWorkspace} color="inherit">
          <Add />
        </IconButton>
      </SideBarListItem>
    </SideBarList>
  );
}

interface RoomsSideBarProps {
  workspace: Workspace
  selected: RoomId | null
  rooms: Room[]
  onSelect: (roomId: RoomId) => void
  onAdd: () => void
}
const RoomsSideBar: FC<RoomsSideBarProps> = ({
  workspace,
  rooms,
  selected,
  onSelect,
  onAdd,
}) => {
  const theme = useTheme()
  return (
    <>
      <Box display="flex" flexDirection="column" height="100%">
        <Box p={2}>
          <Box p={1} component="span">
            <Icon>{workspace.icon}</Icon>
          </Box>
          {workspace.name}
        </Box>
        <Divider />
        <Box display="flex" flexDirection="row" alignItems="center" p={1}>
          検索 : <TextField variant="standard" />
        </Box>
        <Divider />
        <Box flexGrow={1} overflow="auto">
          <SideBarList>
            {rooms.map(room =>
              <SideBarListButton
                key={room.roomId}
                onClick={() => onSelect(room.roomId)}
                sx={{
                  border: "solid 2px",
                  borderColor: selected === room.roomId ? theme.palette.primary.main : "rgba(0,0,0,0)",
                }}
              >
                <Icon>
                  {room.icon}
                </Icon>
                {room.name}
              </SideBarListButton>
            )}
            {rooms.length === 0 &&
              <SideBarListItem>
                ルームがありません
              </SideBarListItem>
            }
            <SideBarListItem>
              <Button
                variant='text'
                onClick={onAdd}
                startIcon={<Add />}
                fullWidth
              >
                ルームを追加する
              </Button>
            </SideBarListItem>
          </SideBarList>
        </Box>
      </Box>
    </>
  );
}

interface AboutWorkspaceProps {
  workspace: Workspace
}
const AboutWorkspace: FC<AboutWorkspaceProps> = ({
  workspace,
}) => {
  return (
    <Box>
      <LayoutContent>
        <Box fontSize="1.5em">
          <Icon>
            {workspace.icon}
          </Icon>
          {workspace.name}
        </Box>
      </LayoutContent>
      <Divider />
      <LayoutContent>
        {workspace.detail}
      </LayoutContent>
      <LayoutContent>
        <Box>
          ルーム
        </Box>
        <Box pl={2} py={1}>
          {workspace.rooms.map(room =>
            <Box key={room.roomId}>
              <Link href={`/?${new URLSearchParams({
                workspaceId: workspace.workspaceId,
                roomId: room.roomId,
              }).toString()}`}>
                <Icon>{room.icon}</Icon>
                {room.name}
              </Link>
            </Box>
          )}
        </Box>
      </LayoutContent>
    </Box>
  );
}

const defaultMessageInput = (currentUserId: UserId): MessageInput => ({
  authorId: currentUserId,
  content: "",
  files: [],
})
interface WorkspaceRoomTalksProps {
  workspace: Workspace
  room: Room
  currentUserId: UserId
  onSendNewMessage: (input: MessageInput) => void
}
const WorkspaceRoomTalks: FC<WorkspaceRoomTalksProps> = ({
  workspace,
  room,
  currentUserId,
  onSendNewMessage,
}) => {
  const _defaultMessageInput = useMemo(() => defaultMessageInput(currentUserId), [currentUserId])
  const { inputViewProps, setMessageInput } = useMessageInputView(_defaultMessageInput)
  const handleSend = (input: MessageInput) => {
    onSendNewMessage(input)
    setMessageInput(_defaultMessageInput)
  }
  return (
    <Box width="100%" height="100%" display="flex" flexDirection="column">
      <Box flexGrow={1} flexShrink={1} overflow="auto">
        <MessageList
          workspaceId={workspace.workspaceId}
          roomId={room.roomId}
          currentUserId={currentUserId}
        />
      </Box>
      <Divider flexItem />
      <Box flexShrink={0}>
        <MessageInputView
          onSend={handleSend}
          {...inputViewProps}
        />
      </Box>
    </Box>
  );
}

