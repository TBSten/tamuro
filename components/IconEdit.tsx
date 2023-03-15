import { Box, TextField } from "@mui/material";
import { FC } from "react";
import { Icon as IconType } from "types";

interface IconEditProps {
    value: IconType
    onChange: (icon: IconType) => void
}
const IconEdit: FC<IconEditProps> = ({
    value, onChange,
}) => {
    if (value.type === "emoji") {
        return (
            <Box component="span">
                <TextField
                    value={value.emoji}
                    onChange={(e) => onChange({ ...value, emoji: e.target.value })}
                    sx={{ width: "3em" }}
                />
            </Box>
        );
    } else {
        throw new Error(`not implement icon edit type ${value.type} `)
    }
}

export default IconEdit;