import { Link, useLocation } from "wouter"
import { Button } from "../ui/button"
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations"
import { useEffect } from "react";
import { useUserContext } from "@/context/AuthContext";
import { sidebarLinks } from "@/constants";
import { INavLink } from "@/types";

const LeftSidebar = () => {

    const { mutate: signOut, isSuccess } = useSignOutAccount();

    const [location, setLocation] = useLocation();

    const { user } = useUserContext();

    useEffect(() => {
        if (isSuccess) {
            setLocation('/sign-in');
        }
    }, [isSuccess]);

    return (
        <nav className="h-screen leftsidebar">
            <div className="flex flex-col gap-11">
                <Link to="/" className="flex items-center gap-3">
                    <img src="/assets/images/logo.svg" alt="logo" width={170} height={36} />
                </Link>

                <Link to={`/profile/${user.id}`} className="flex items-center gap-3">
                    <img src={user.imageUrl || '/assets/icons/profile-placeholder.svg'} alt="profile"
                        className="rounded-full w-14 h-14"
                    />
                    <div className="flex flex-col">
                        <p className="body-bold">{user.name}</p>
                        <p className="small-regular text-light-3">@{user.username}</p>
                    </div>
                </Link>

                <ul className="flex flex-col gap-6">
                    {
                        sidebarLinks.map((link: INavLink) => {
                            const isActive = location === link.route;

                            return (
                                <li
                                    key={link.label}
                                    className={`leftsidebar-link group ${isActive && 'bg-primary-500'}`}>
                                    <Link to={link.route}
                                        className="flex items-center gap-4 p-3"
                                    >
                                        <img src={link.imgURL} alt={link.label}
                                            className={`group-hover:invert-white ${isActive && 'invert-white'}`}
                                        />
                                        {link.label}
                                    </Link>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>

            <Button variant="ghost" className="p-3 shad-button_ghost"
                onClick={() => signOut()}
            >
                <img src="/assets/icons/logout.svg" alt="logout" />

                <p className="small-media lg:base-media">Logout</p>
            </Button>
        </nav>
    )
}

export default LeftSidebar