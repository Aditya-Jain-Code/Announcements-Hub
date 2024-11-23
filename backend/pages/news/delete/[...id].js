import Loading from "@/components/Loading";
import axios from "axios";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BsPostcard } from "react-icons/bs";

export default function DeleteNews() {
    // Authentication session handling
    const { data: session, status } = useSession();
    const router = useRouter();

    // Redirect to login page if no session exists
    useEffect(() => {
        if (!session) {
            router.push('/login')
        }
    }, [session, router]);

    // Show loading state while session data is being fetched
    if (status === "loading") {
        return (
            <div className="loadingdata flex flex-col flex-center wh_100">
                <Loading />
                <h1>Loading...</h1>
            </div>
        )
    }

    const { id } = router.query;
    const [productInfo, setProductInfo] = useState(null);

    useEffect(() => {
        if (!id) {
            return;
        } else {
            axios.get('/api/newsapi?id=' + id).then(response => {
                setProductInfo(response.data);
            })
        }
    }, [id]);

    function goBack() {
        router.push('/');
    }

    async function deleteOneNews() {
        await axios.delete('/api/newsapi?id=' + id);
        goBack();
    }

    if (session) {
        return <>
            <Head>
                <title>Delete News</title>
            </Head>

            <div className="newspage">
                {/* Admin panel title and breadcrumb navigation */}
                <div className="titledashboard flex flex-sb">
                    <div>
                        <h2>Delete <span>{productInfo?.title}</span></h2>
                        <h3>ADMIN PANEL</h3>
                    </div>
                    <div className="breadcrumb" data-aos="slide-left">
                        {/* Breadcrumb indicating that the user is on the 'News' page */}
                        <BsPostcard /> <span>/</span> <span>Delete News</span>
                    </div>
                </div>
                <div className="deletesec flex flex-center wh_100">
                    <div className="deletecard">
                        <svg
                            viewBox="0 0 24 24"
                            fill="red"
                            height="6em"
                            width="6em"
                        >
                            <path d="M4 19V7h12v12c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2M6 9v10h8V9H6m7.5-5H17v2H3V4h3.5l1-1h5l1 1M19 17v-2h2v2h-2m0-4V7h2v6h-2z" />
                        </svg>
                        <p className="cookieHeading">Are you Sure?</p>
                        <p className="cookieDescription">If you delete this news content, it will be permanently delete your news.</p>
                        <div className="buttonContainer">
                            <button onClick={deleteOneNews} className="acceptButton">Delete</button>
                            <button onClick={goBack} className="declineButton">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    }
}