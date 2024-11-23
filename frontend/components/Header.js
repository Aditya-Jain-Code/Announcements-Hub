import Link from "next/link";
import { IoSearchSharp, IoMoonSharp, IoSearch } from "react-icons/io5";
import { HiBars3BottomRight } from "react-icons/hi2";
import { FaXmark } from "react-icons/fa6";
import { LuSun } from "react-icons/lu"
import { useEffect, useState } from "react";
import useFetchData from "@/hooks/useFetchData";

export default function Header() {

    const [searchOpen, setSearchOpen] = useState(false);

    const openSearch = () => {
        setSearchOpen(true);
    }

    const closeSearch = () => {
        setSearchOpen(false);
    }

    const [aside, setAside] = useState(false);

    const asideOpen = () => {
        setAside(true);
    }

    const asideClose = () => {
        setAside(false);
    }

    const handleLinkClick = () => {
        setAside(false);
    }

    // Dark Mode On / Off
    const [darkmode, setDarkmode] = useState(true);

    useEffect(() => {
        // Checks local storage for darkmode perference on inital load
        const isDarkmode = localStorage.getItem('darkmode') === 'true';
        setDarkmode(isDarkmode);
    }, []);

    useEffect(() => {
        // Apply darkmode styles when darkmode state changes
        if (darkmode) {
            document.body.classList.add('dark');
            localStorage.getItem('darkmode', true);
        } else {
            document.body.classList.remove('dark');
            localStorage.getItem('darkmode', false);
        }
    }, [darkmode]);

    const toggleDarkMode = () => {
        setDarkmode(!darkmode); // Toggles dark mode status
    }

    const { allData, loading } = useFetchData('/api/getnews');

    // filtering published news
    const publishedNews = allData.filter(ab => ab.status === "publish");
    const [searchQuery, setSearchQuery] = useState('');
    // filtering based on the search query, search data from title
    const filteredNews = searchQuery.trim() === '' ? publishedNews : publishedNews.filter(news => news.title.toLowerCase().includes(searchQuery.toLowerCase()));

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
        <div className="header_sec">
            <div className="container header">
                <div className="logo">
                    <Link href="/"><h1>Announcements Hub</h1></Link>
                </div>
                <div className="searchbar">
                    <IoSearchSharp />
                    <input onClick={openSearch} type="search" placeholder="Discover news, article and more" />
                </div>
                <div className="nav_list_dark">
                    <ul>
                        <li><Link href="/">Home</Link></li>
                        <li><Link href="/">About Us</Link></li>
                        <li><Link href="/">Contact</Link></li>
                    </ul>
                    <div className="navlist_mobile_ul">
                        <button onClick={toggleDarkMode}>{darkmode ? <IoMoonSharp /> : <LuSun />}</button>
                        <button onClick={openSearch}><IoSearch /></button>
                        <button onClick={asideOpen}><HiBars3BottomRight /></button>
                    </div>
                    <div className="darkmode">
                        <label className="switch">
                            <input type="checkbox" checked={darkmode} onChange={toggleDarkMode} />
                            <span className="slider_header"></span>
                        </label>
                    </div>
                </div>
            </div>
            <div className={`search_click ${searchOpen ? 'open' : ''} `}>
                <div className="searchab_input">
                    <IoSearchSharp />
                    <input type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Discover news, article and more" />
                </div>
                <div className="search_data text-center">
                    {loading ? <div className="wh_100 flex flex-center mt-2 pb-5">
                        <div className="loader"></div>
                    </div> : <>
                        {searchQuery ? <>
                            {filteredNews.slice(0, 3).map((news) => {
                                return <div className="news" key={news._id} onClick={closeSearch}>
                                    <div className="newsinfo">
                                        <Link href={`/news/${news.slug}`}><h3>{news.slug}</h3></Link>
                                        <p>{truncateText(news.description, 20)}</p>
                                    </div>
                                </div>
                            })}
                        </> : <div>No Search Result</div>}
                    </>}
                </div>
                <div className="exit_search" onClick={closeSearch}>
                    <div><FaXmark /></div>
                    <h4>ESC</h4>
                </div>
            </div>
            <div className={aside ? `navlist_mobile open` : `navlist_mobile`}>
                <div className="navlist_m_title flex flex-sb">
                    <h1>Announcements Hub</h1>
                    <button onClick={asideClose}><FaXmark /></button>
                </div>
                <hr />
                <h3 className="mt-3">Main Menu</h3>
                <ul onClick={handleLinkClick}>
                    <li><Link href="/">Home</Link></li>
                </ul>
                <hr />
                <h3 className="mt-3">Topics</h3>
                <ul onClick={handleLinkClick}>
                    <li><Link href="/topics/academics">Academics</Link></li>
                    <li><Link href="/topics/placements">Placements</Link></li>
                    <li><Link href="/topics/curricular">Co-Curricular</Link></li>
                    <li><Link href="/topics/events">Events</Link></li>
                </ul>
            </div>
        </div>
    </>
}
