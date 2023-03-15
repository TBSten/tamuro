import { addUser } from "lib/server/firestore/user";
import { AuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_AUTH_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET as string,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            },
            profile(profile, tokens) {
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                }
            },
        }),
    ],
    callbacks: {
        jwt(params) {
            params.token.id = params.user?.id
            return params.token
        },
        session(params) {
            const user = params.session.user
            if (params.token.sub) user.id = params.token.sub
            return params.session
        },
        async signIn(params) {
            const { user, account } = params
            const name = user.name
            const image = user.image
            if (!name || !image) {
                console.error(name, image, user)
                throw new Error(`not enough fields userId`)
            }
            const newUser = await addUser(account?.providerAccountId ?? null, {
                name,
                image: {
                    type: "url",
                    url: image,
                },
            })
            user.id = newUser.userId
            return true
        },
    },
    pages: {
        signIn: "/login",
    },
}

export default NextAuth(authOptions)
