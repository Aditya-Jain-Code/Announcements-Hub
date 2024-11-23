import Loading from "@/components/Loading";
import News from "@/components/News";
import axios from "axios";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BsPostcard } from "react-icons/bs";

export default function EditNews() {
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

    if (session) {
        return <>
            <Head>
                <title>Update News</title>
            </Head>

            <div className="newspage">
                {/* Admin panel title and breadcrumb navigation */}
                <div className="titledashboard flex flex-sb">
                    <div>
                        <h2>Edit <span>{productInfo?.title}</span></h2>
                        <h3>ADMIN PANEL</h3>
                    </div>
                    <div className="breadcrumb" data-aos="slide-left">
                        {/* Breadcrumb indicating that the user is on the 'News' page */}
                        <BsPostcard /> <span>/</span> <span>Edit News</span>
                    </div>
                </div>
                <div className="mt-3">
                    {
                        productInfo && (
                            <News {...productInfo} />
                        )
                    }
                </div>
            </div>
        </>
    }
}