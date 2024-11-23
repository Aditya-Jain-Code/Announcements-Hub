import Link from "next/link";
import { IoHome } from "react-icons/io5";
import { IoSettings } from "react-icons/io5";
import { BsPostcard } from "react-icons/bs";
import { MdOutlineAddPhotoAlternate, MdOutlinePending } from "react-icons/md";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Aside() {
    const router = useRouter(); // Initialize the router to get the current path
    const [clicked, setClicked] = useState(false); // State to manage the toggling of clicked status
    const [activeLink, setActiveLink] = useState('/'); // State to track the active link in the navigation

    // Function to handle toggling of clicked state
    const handleClick = () => {
        setClicked(!clicked);
    }

    // Function to handle link click and set the active link
    const handleLinkClick = (link) => {
        setActiveLink(link); // Set the clicked link as active
        setClicked(false); // Reset clicked state
    }

    useEffect(() => {
        // Set the active link based on the current route when the component mounts or the route changes
        setActiveLink(router.pathname);
    }, [router.pathname]); // Dependency array ensures effect runs whenever the route changes

    return (
        <>
            {/* Render the sidebar with navigation links */}
            <aside className="asideleft">
                <ul>
                    {/* Dashboard link */}
                    <Link href="/">
                        <li className={activeLink === '/' ? 'navactive' : ''} onClick={() => handleLinkClick('/')}>
                            <IoHome /> {/* Home icon */}
                            <span>Dashboard</span>
                        </li>
                    </Link>

                    {/* News link */}
                    <Link href="/news">
                        <li className={activeLink === '/news' ? 'navactive' : ''} onClick={() => handleLinkClick('/news')}>
                            <BsPostcard /> {/* Postcard icon */}
                            <span>News</span>
                        </li>
                    </Link>

                    {/* Add News link */}
                    <Link href="/news/addnews">
                        <li className={activeLink === '/news/addnews' ? 'navactive' : ''} onClick={() => handleLinkClick('/news/addnews')}>
                            <MdOutlineAddPhotoAlternate /> {/* Add News icon */}
                            <span>Add News</span>
                        </li>
                    </Link>

                    {/* Pending (Draft) link */}
                    <Link href="/draft">
                        <li className={activeLink === '/draft' ? 'navactive' : ''} onClick={() => handleLinkClick('/draft')}>
                            <MdOutlinePending /> {/* Pending icon */}
                            <span>Pending</span>
                        </li>
                    </Link>

                    {/* Settings link */}
                    <Link href="/settings">
                        <li className={activeLink === '/settings' ? 'navactive' : ''} onClick={() => handleLinkClick('/settings')}>
                            <IoSettings /> {/* Settings icon */}
                            <span>Settings</span>
                        </li>
                    </Link>
                </ul>
            </aside>
        </>
    );
}
