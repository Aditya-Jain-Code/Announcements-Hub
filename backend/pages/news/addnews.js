import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Loading from "@/components/Loading";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import News from "@/components/News";
import Head from "next/head";

export default function AddNews() {

    // Destructure session data and status from useSession hook
    const { data: session, status } = useSession();
    const router = useRouter();

    // Check if user is authenticated; if not, redirect to login page
    useEffect(() => {
        if (!session) {
            router.push('/login');
        }
    }, [session, router]);

    // Show loading state while session status is "loading"
    if (status === "loading") {
        return (
            <div className="loadingdata flex flex-col flex-center wh_100">
                <Loading />
                <h1>Loading...</h1>
            </div>
        );
    }

    // Render the "Add News" page if the user is authenticated
    if (session) {
        return (
            <>
                <Head>
                    <title>Add New News</title>
                </Head>
                <div className="addnewspage">
                    {/* Admin panel title and breadcrumb navigation */}
                    <div className="titledashboard flex flex-sb" data-aos="fade-right">
                        <div>
                            <h2>Add <span>News</span></h2>
                            <h3>ADMIN PANEL</h3>
                        </div>
                        <div className="breadcrumb" data-aos="slide-left">
                            {/* Breadcrumb indicating that the user is on the 'Add News' page */}
                            <MdOutlineAddPhotoAlternate /> <span>/</span> <span>Add News</span>
                        </div>
                    </div>

                    {/* Section for adding news content */}
                    <div className="newsadd">
                        {/* News component handles form input for adding news */}
                        <News />
                    </div>
                </div>
            </>
        );
    }
}
