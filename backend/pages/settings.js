import Loading from "@/components/Loading";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineAccountCircle } from "react-icons/md";

export default function Settings() {

    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (!session) {
            router.push('/login');
        }
    }, [session, router]);

    if (status === "loading") {
        return (
            <div className="loadingdata flex flex-col flex-center wh_100">
                <Loading />
                <h1>Loading...</h1>
            </div>
        );
    }

    async function logout() {
        await signOut();
        await router.push('/');
    }

    return <>
        <div className="settingpage">
            <div className="titledashboard flex flex-sb" data-aos="fade-right">
                <div>
                    <h2>Admin <span>Settings</span></h2>
                    <h3>ADMIN PANEL</h3>
                </div>
                <div className="breadcrumb" data-aos="slide-left">
                    <IoSettingsOutline /> <span>/</span> <span>Settings</span>
                </div>
            </div>
            <div className="profilesettings">
                <div className="leftprofile_details flex" data-aos="fade-up">
                    <img src="/img/coder.png" alt="coder" />
                    <div className="w-100">
                        <div className="flex flex-sb flex-left mt-2">
                            <h2>My Profile:</h2>
                            <h3>Aditya Jain</h3>
                        </div>
                        <div className="flex flex-sb mt-2">
                            <h3>Phone:</h3>
                            <input type="text" defaultValue="+91-8829922858" />
                        </div>
                        <div className="mt-2">
                            <input type="email" defaultValue="adityajai2104@gmail.com" />
                        </div>
                        <div className="flex flex-center w-100 mt-2">
                            <button>Save</button>
                        </div>
                    </div>
                </div>
                <div className="rightlogoutsec" data-aos="fade-up">
                    <div className="topaccountbox">
                        <h2 className="flex flex-sb">My Account <MdOutlineAccountCircle /></h2>
                        <hr />
                        <div className="flex flex-sb mt-1">
                            <h3>Active Account <br /><span>Email</span></h3>
                            <button onClick={logout}>Logout</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}