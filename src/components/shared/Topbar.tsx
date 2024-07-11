import { Link, useLocation } from "wouter"
import { Button } from "../ui/button"
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations"
import { useEffect } from "react";
import { useUserContext } from "@/context/AuthContext";

const Topbar = () => {

    const { mutate: signOut, isSuccess } = useSignOutAccount();

    const [location, setLocation] = useLocation();

    const { user } = useUserContext();

    useEffect(() => {
        if (isSuccess) {
            setLocation('/sign-in');
        }
    }, [isSuccess]);


    return (
        <section className="topbar">
            <div className="px-5 py-4 flex-between">
                <Link to="/" className="flex items-center gap-3">
                    <img src="/assets/images/logo.svg" alt="logo" width={130} height={325} />
                </Link>

                <div className="flex gap-4">
                    <Button variant="ghost" className="shad-button_ghost"
                        onClick={() => signOut()}
                    >
                        <img src="/assets/icons/logout.svg" alt="logout" />
                    </Button>

                    <Link to={`/profile/${user.id}`} className="gap-3 flex-center">
                        <img src={user.imageUrl || '/assets/icons/profile-placeholder.svg'} alt="profile"  
                        className="w-8 h-8 rounded-full"
                        />
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default Topbar