import { FC } from "react";
import Twemoji from "react-twemoji";

interface EmojiProps {
    children: string
}
const Emoji: FC<EmojiProps> = ({ children }) => {
    return (
        <Twemoji options={{ base: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/', folder: "svg", ext: ".svg" }} tag="span">
            {children}
        </Twemoji>
    );
}

export default Emoji;

