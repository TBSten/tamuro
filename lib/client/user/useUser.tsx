import { useQuery } from "react-query";
import { UserId, UserScheme } from "types";

export function useUser(userId: UserId) {
    const { data: user, isLoading } = useQuery(["user", userId], async () => {
        const res = await fetch(`/api/user/${userId}`).then(r => r.json())
        return UserScheme.parse(res)
    })
    return {
        user,
        isLoading,
    } as const
}
