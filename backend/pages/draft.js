import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { BsPostcard } from "react-icons/bs";
import Loading from "@/components/Loading";
import Link from "next/link";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import useFetchData from "@/hooks/useFetchData";
import DataLoading from "@/components/DataLoading";
import Head from "next/head";

export default function draft() {

    const [currentPage, setCurrentPage] = useState(1);
    const [perPage] = useState(5);
    const { allData, loading } = useFetchData('/api/newsapi');

    const draftNews = allData.filter(ab => ab.status === 'draft');

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    }

    const indexOfLastNews = currentPage * perPage;
    const indexOfFirstNews = indexOfLastNews - perPage;
    const currentDrafts = draftNews.slice(indexOfFirstNews, indexOfLastNews);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(draftNews.length / perPage); i++) {
        pageNumbers.push(i);
    }

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

    if (session) {
        return (
            <>
                <Head>
                    <title>Drafted News</title>
                </Head>
                <div className="newspage">
                    <div className="titledashboard flex flex-sb" data-aos="fade-right">
                        <div>
                            <h2>All Draft <span>News</span></h2>
                            <h3>ADMIN PANEL</h3>
                        </div>
                        <div className="breadcrumb" data-aos="slide-left">
                            <BsPostcard /> <span>/</span> <span>Draft News</span>
                        </div>
                    </div>

                    <div className="newstable" data-aos="fade-up">
                        <table className="table table-styling">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Title</th>
                                    <th>Slug</th>
                                    <th>Edit / Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td>
                                            <DataLoading />
                                        </td>
                                    </tr>
                                ) : (
                                    <>
                                        {currentDrafts.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="text-center">No Draft News</td>
                                            </tr>
                                        ) : (
                                            currentDrafts.map((news, index) => (
                                                <tr key={news._id}>
                                                    <td>{indexOfFirstNews + index + 1}</td>
                                                    <td><h3>{news.title}</h3></td>
                                                    <td><pre>{news.slug}</pre></td>
                                                    <td>
                                                        <div className="flex flex-center gap-2">
                                                            <Link href={'/news/edit/' + news._id}>
                                                                <button title="edit"><FaEdit /></button>
                                                            </Link>
                                                            <Link href={'/news/delete/' + news._id}>
                                                                <button title="delete"><RiDeleteBin6Fill /></button>
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </>
                                )}
                            </tbody>
                        </table>
                        {draftNews.length === 0 ? (
                            ''
                        ) : (
                            <div className="newspagination">
                                <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                                    Previous
                                </button>
                                {pageNumbers.slice(
                                    Math.max(currentPage - 3, 0),
                                    Math.min(currentPage + 2, pageNumbers.length)
                                ).map(number => (
                                    <button key={number} onClick={() => paginate(number)} className={`${currentPage === number ? 'active' : ''}`}>
                                        {number}
                                    </button>
                                ))}
                                <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === pageNumbers.length}>
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </>
        );
    }
}
