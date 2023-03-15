import Image from "next/image";
import { FC } from "react";
import { Icon as IconType } from "types";
import Emoji from "./Emoji";

interface IconProps {
    children: IconType
}
const Icon: FC<IconProps> = ({ children }) => {
    if (children.type === "emoji") {
        return (
            <Emoji>{children.emoji}</Emoji>
        );
    } else if (children.type === "url") {
        return (
            <Image
                src={children.url}
                alt="画像"
                width={30}
                height={30}
            />
        )
    } else {
        return <div>
            not implement : icon(type=={`"emoji"`})
            {JSON.stringify(children)}
        </div>
    }
}

export default Icon;