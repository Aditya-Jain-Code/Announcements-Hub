import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react"

export default function TagsPage() {

    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage] = useState(3);
    const [news, setNews] = useState([]);
    const router = useRouter();

    const { tag } = router.query;

    useEffect(() => {
        // Function to fetch news data
        const fetchNewsData = async () => {
            try {
                const res = await axios.get(`/api/getnews?tags=${tag}`);
                const allData = res.data;
                setNews(allData);
                setLoading(false);
            } catch (error) {
                console.log("Error fetching news data", error);
                setLoading(false);
            }
        }

        if (tag) {
            fetchNewsData();
        } else {
            router.push("/404")
        }
    }, [tag]);

    // Function to handle page change
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    }

    const totalNews = news.length;

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalNews / perPage); i++) {
        pageNumbers.push(i);
    }

    // Filter published news
    const publishedNews = news.filter(ab => ab.status === "publish");

    function extractFirstImageUrl(markdownContent) {
        if (!markdownContent || typeof markdownContent !== "string") return null;
        const regex = /!\[.*?]\((.*?)\)/;
        const match = markdownContent.match(regex);
        return match ? match[1] : null;
    }

    function removeMarkdown(text) {
        if (!text) return "";
        // Regular expression to remove markdown syntax
        return text.replace(/(\*\*|__|[*_~`>#-]|!\[.*?\]\(.*?\)|\[(.*?)\]\(.*?\))/g, "").trim();
    }

    function truncateText(text, maxWords = 20) {
        const cleanText = removeMarkdown(text); // Remove markdown first
        const words = cleanText.split(" ");
        return words.length > maxWords ? words.slice(0, maxWords).join(" ") + "..." : cleanText;
    }

    return <>
        <div className="newspage">
            <div className="category_slug">
                <div className="container">
                    <div className="category_title">
                        <div className="flex gap-1">
                            <h1>{loading ? <div>Loading...</div> : tag}</h1>
                            <span>{loading ? <div>0</div> : publishedNews.filter(news => news.tags).length}</span>
                        </div>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
                    </div>
                    <div className="category_news mt-3">
                        {loading ? <>
                            <div className="wh-100 flex flex-center mt-2 pb-5">
                                <div className="loader"></div>
                            </div>
                        </> : <>
                            {publishedNews.map((item) => {
                                const firstImageUrl = extractFirstImageUrl(item.description);
                                return <div className="cate_news" key={item._id}>
                                    <div className="newsimg">
                                        <Link href={`/news/${item.slug}`}>
                                            <img src={firstImageUrl || "/img/noimage.avif"} alt={item.title} />
                                        </Link>
                                    </div>
                                    <div className="newsinfo mt-2">
                                        <Link href={`/tag/${item.tags}`}>
                                            <div className="newstag">{item.tags}</div>
                                        </Link>
                                        <Link href={`/news/${item.slug}`}><h3>{item.title}</h3></Link>
                                        <p>{truncateText(item.description, 15)}</p>
                                        <div className="newsauthor flex gap-1">
                                            <div className="newsaimg">
                                                <img src="/img/coder.png" alt="coder" />
                                            </div>
                                            <div className="flex flex-col flex-left gap-05">
                                                <h4>Aditya Jain</h4>
                                                <span>{new Date(item.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            })}
                        </>}
                    </div>
                    <div className="newspagination">
                        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                        {pageNumbers.slice(Math.max(currentPage - 3, 0), Math.min(currentPage + 2, pageNumbers.length)).map(
                            number => (
                                <button
                                    key={number}
                                    onClick={() => paginate(number)}
                                    className={currentPage === number ? 'active' : ''}>
                                    {number}
                                </button>
                            )
                        )}
                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === Math.ceil(totalNews / perPage)}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </>
}