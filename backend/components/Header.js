import { GoScreenFull } from "react-icons/go";
import { BiExitFullscreen } from "react-icons/bi";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function Header() {

    // Destructure session and status from useSession() to get user session data
    const { data: session, status } = useSession();

    // State to track whether the screen is in fullscreen mode
    const [isFullScreen, setIsFullScreen] = useState(false);

    // Function to toggle fullscreen mode
    const toggleFullScreen = () => {
        // If the document is not in fullscreen, enter fullscreen
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => {
                setIsFullScreen(true); // Update state to reflect fullscreen mode
            });
        } else {
            // If in fullscreen, exit fullscreen mode
            if (document.exitFullscreen) {
                document.exitFullscreen().then(() => {
                    setIsFullScreen(false); // Update state to reflect normal mode
                });
            }
        }
    }

    return <>
        {/* Header section */}
        <header className="header flex flex-sb">
            {/* Logo and menu icon */}
            <div className="logo flex gap-2">
                <h1>ADMIN</h1>
            </div>

            {/* Right-hand navigation section */}
            <div className="rightnav flex gap-2">
                {/* Fullscreen toggle */}
                <div onClick={toggleFullScreen}>
                    {/* Conditional rendering: show Exit Fullscreen icon if fullscreen, otherwise show Enter Fullscreen icon */}
                    {isFullScreen ? <BiExitFullscreen /> : <GoScreenFull />}
                </div>

                {/* Notification icon */}
                <div className="notification">
                    <img src="/img/notification.jpg" alt="notification" />
                </div>

                {/* Profile navigation */}
                <div className="profilenav">
                    {/* If session exists, display user profile image; otherwise, show default user image */}
                    {session ? <img className="profile-image" src={session.user.image} alt="user" /> : <img src="/img/user.png" alt="user" />}
                </div>
            </div>
        </header>
    </>
}
