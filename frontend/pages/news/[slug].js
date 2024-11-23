import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { GiBookshelf } from "react-icons/gi";
import { FaBriefcase, FaCalendarAlt, FaRunning } from "react-icons/fa";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import TextSummarizer from "@/components/TextSummarizer";

export default function NewsPage() {
    const router = useRouter();
    const { slug } = router.query;

    const [news, setNews] = useState([""]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (slug) {
            axios.get(`/api/getnews?slug=${slug}`).then(res => {
                const allData = res.data;
                setNews(allData);
                setLoading(false);
            }).catch(error => {
                console.error("Error fetching news", error);
            });
        }
    }, [slug]);

    // markdown code highlighter
    const Code = ({ node, inline, className, children, ...props }) => {
        const match = /language-(\w+)/.exec(className || '');

        const [copied, setCopied] = useState();

        const handleCopy = () => {
            navigator.clipboard.writeText(children);
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
            }, 3000); // 3 seconds
        };

        if (inline) {
            return <code>{children}</code>;
        } else if (match) {
            return (
                <div style={{ position: "relative" }}>
                    <SyntaxHighlighter
                        style={a11yDark}
                        language={match[1]}
                        PreTag="pre"
                        {...props}
                        codeTagProps={{ style: { padding: '0', borderRadius: '5px', overflowX: 'auto', whiteSpace: 'pre-warp' } }}
                    >
                        {String(children).replace(/\n$/, '')}
                        <button style={{
                            position: 'absolute', top: '0', right: '0', zIndex: '1', background: '#3D3D3D',
                            color: '#FFF', padding: '10px'
                        }} onClick={handleCopy}
                        >
                            {copied ? 'Copied' : 'Copy Code'}
                        </button>
                    </SyntaxHighlighter>
                </div>
            );
        } else {
            return (
                <code className="md-post-code" {...props}>
                    {children}
                </code>
            );
        }
    };

    function toTitleCase(str) {
        return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
    }

    return (
        <>
            <div className="slugpage">
                <div className="container">
                    <div className="topslug_titles">
                        <h1 className="slugtitle">
                            {loading ? <div>loading...</div> : news && news[0]?.title}
                        </h1>
                        <h5>By <span>Aditya Jain</span>. Published in
                            <span> {loading ? <div>loading...</div> : news && toTitleCase(news[0].newscategory)}</span>
                            . {news[0]?.createdAt ? new Date(news[0].createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
                        </h5>

                        {/* News Data Section */}
                        <div className="flex flex-sb flex-left pb-5 flex-warp">
                            <div className="leftnews_data_markdown">
                                {loading ?
                                    <div className="wh-100 flex flex-center mt-3">
                                        <div className="loader"></div>
                                    </div> : <>
                                        <div className="w-100 newscontent">
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                components={{ code: Code }}>{news[0].description}</ReactMarkdown>
                                        </div>
                                        <div>
                                            <TextSummarizer inputText={news[0].description} />
                                        </div>
                                    </>}
                            </div>
                            <div className="rightnews_info">
                                <div className="topics_sec">
                                    <h2>Topics</h2>
                                    <div className="topics_list">
                                        <Link href="/topics/academics">
                                            <div className="topics">
                                                <div className="flex flex-center topics_svg">
                                                    <GiBookshelf />
                                                </div>
                                                <h3>Academics</h3>
                                            </div>
                                        </Link>
                                        <Link href="/topics/placements">
                                            <div className="topics">
                                                <div className="flex flex-center topics_svg">
                                                    <FaBriefcase />
                                                </div>
                                                <h3>Placements</h3>
                                            </div>
                                        </Link>
                                        <Link href="/topics/events">
                                            <div className="topics">
                                                <div className="flex flex-center topics_svg">
                                                    <FaCalendarAlt />
                                                </div>
                                                <h3>Events</h3>
                                            </div>
                                        </Link>
                                        <Link href="/topics/curricular">
                                            <div className="topics">
                                                <div className="flex flex-center topics_svg">
                                                    <FaRunning />
                                                </div>
                                                <h3>Co-Curricular</h3>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                                <div className="tags_sec mt-3">
                                    <h2>Tags</h2>
                                    <div className="tags_list">
                                        <Link href="/tag/academics">#Academics</Link>
                                        <Link href="/tag/competition">#Competition</Link>
                                        <Link href="/tag/guestlecture">#GuestLecture</Link>
                                        <Link href="/tag/cultural">#Cultural</Link>
                                        <Link href="/tag/edmnights">#EDMNights</Link>
                                        <Link href="/tag/events">#Events</Link>
                                        <Link href="/tag/placements">#Placements</Link>
                                        <Link href="/tag/sports">#Sports</Link>
                                        <Link href="/tag/miscellaneous">#Miscellaneous</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
