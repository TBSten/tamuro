import { GetServerSideProps, NextPage } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { signIn } from 'next-auth/react';
import { authOptions } from './api/auth/[...nextauth]';

interface Props {
}
const Login: NextPage<Props> = ({ }) => {
    return (
        <>
            <button onClick={() => signIn("google")}>login</button>
        </>
    );
}
export default Login;

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
    const session = await unstable_getServerSession(ctx.req, ctx.res, authOptions)
    if (session) {
        // ログインしていたらトップへリダイレクト
        return {
            redirect: {
                destination: "/",
                permanent: false,
            }
        }
    }
    // ログインしていなかったらログイン画面へ
    return {
        props: {}
    }
}
