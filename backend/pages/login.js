import Image from "next/image";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";

export default function Login() {

    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === "loading") {
        return (
            <div className="loadingdata flex flex-col flex-center wh_100">
                <Loading />
                <h1>Loading...</h1>
            </div>
        );
    }

    async function login() {
        await router.push('/');
        await signIn();
    }

    if (session) {
        router.push('/');
        return null;
    }

    if (!session) {
        return (
            <>
                <div className="loginfront flex flex-center flex-col w-full">
                    <Image src='/img/coder.png' width={300} height={300} />
                    <h1>Welcome Admin of the announcements hub 👋🏻</h1>
                    <button onClick={login} className="mt-2">Login with Google</button>
                </div>
            </>
        );
    }
}
