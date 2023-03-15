import { useSession } from "next-auth/react";

export function useUserId() {
    const { data } = useSession()
    return data?.user.id ?? null
}
