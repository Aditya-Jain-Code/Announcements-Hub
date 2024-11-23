import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { BsPostcard } from "react-icons/bs";
import Loading from "@/components/Loading";
import { useEffect, useState } from "react";
import Link from "next/link";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import useFetchData from "@/hooks/useFetchData";
import DataLoading from "@/components/DataLoading";
import Head from "next/head";

export default function news() {

    // State to manage the current page of pagination
    const [currentPage, setCurrentPage] = useState(1);

    // Fixed number of news items to display per page
    const [perPage] = useState(5);

    // Fetch all news data and loading state from custom hook
    const { allData, loading } = useFetchData('/api/newsapi');

    // Function to handle page number change
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    // Filter only the news items that are in publish status
    const publishedNews = allData.filter(ab => ab.status === 'publish');

    // State to store the search query entered by the user
    const [searchQuery, setSearchQuery] = useState('');

    // Filter news based on the search query
    const filteredNews = searchQuery.trim() === '' ? publishedNews : publishedNews.filter(news => news.title.toLowerCase().includes(searchQuery.toLowerCase()));

    // Determine the index for slicing data for the current page
    const indexOfLastNews = currentPage * perPage;
    const indexOfFirstNews = indexOfLastNews - perPage;

    // Sliced data to display only the news for the current page
    const currentNews = filteredNews.slice(indexOfFirstNews, indexOfLastNews);

    // Calculate total number of pages required based on filtered news length
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredNews.length / perPage); i++) {
        pageNumbers.push(i);
    }

    // Destructure session data and status from useSession hook
    const { data: session, status } = useSession();
    const router = useRouter();

    // Check if user is authenticated; if not, redirect to login page
    useEffect(() => {
        if (!session) {
            router.push('/login');
        }
    }, [session, router]);

    // Show loading indicator while session status is "loading"
    if (status === "loading") {
        return (
            <div className="loadingdata flex flex-col flex-center wh_100">
                <Loading />
                <h1>Loading...</h1>
            </div>
        );
    }

    // Render the main news management panel if the user is authenticated
    if (session) {
        return (
            <>
                <Head>
                    <title>All News</title>
                </Head>
                <div className="newspage">
                    {/* Admin panel title and breadcrumb navigation */}
                    <div className="titledashboard flex flex-sb">
                        <div data-aos="fade-right">
                            <h2>All Published <span>News</span></h2>
                            <h3>ADMIN PANEL</h3>
                        </div>
                        <div className="breadcrumb" data-aos="slide-left">
                            {/* Breadcrumb indicating that the user is on the 'News' page */}
                            <BsPostcard /> <span>/</span> <span>News</span>
                        </div>
                    </div>

                    {/* Search bar for filtering news by title */}
                    <div className="newstable" data-aos="fade-up">
                        <div className="flex gap-2 mb-1">
                            <h2>Search News:</h2>
                            {/* Input field for search query */}
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by title..."
                            />
                        </div>

                        {/* Table displaying news details (currently hardcoded) */}
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
                                {/* Show loading indicator if data is still being fetched */}
                                {loading ? <tr>
                                    <td>
                                        <DataLoading />
                                    </td>
                                </tr> : <>
                                    {/* Show 'No Published News' message if no publishes exist */}
                                    {currentNews.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="text-center">No Published News</td>
                                        </tr>
                                    ) : (
                                        /* Display each news item in the table */
                                        currentNews.map((news, index) => (
                                            <tr key={news._id}>
                                                <td>{indexOfFirstNews + index + 1}</td>
                                                <td><h3>{news.title}</h3></td>
                                                <td><pre>{news.slug}</pre></td>
                                                <td>
                                                    {/* Edit and Delete button functionality */}
                                                    <div className="flex flex-center gap-2">
                                                        {/* Placeholder links for Edit/Delete */}
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
                                </>}
                            </tbody>
                        </table>
                        {/* Pagination control - hide if no published news */}
                        {publishedNews.length === 0 ? null : (
                            <div className="newspagination">
                                {/* Previous button disabled on first page */}
                                <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                                    Previous
                                </button>

                                {/* Show a range of pagination numbers based on the current page */}
                                {pageNumbers.slice(
                                    Math.max(currentPage - 3, 0),
                                    Math.min(currentPage + 2, pageNumbers.length)
                                ).map(number => (
                                    <button key={number} onClick={() => paginate(number)} className={`${currentPage === number ? 'active' : ''}`}>
                                        {number}
                                    </button>
                                ))}

                                {/* Next button disabled if there are no more pages */}
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
