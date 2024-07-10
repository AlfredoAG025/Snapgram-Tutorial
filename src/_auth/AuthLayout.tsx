import { ReactNode } from "react";
import { Redirect } from "wouter";

interface Props {
    children: ReactNode;
}

const AuthLayout = ({ children }: Props) => {
    const isAuthenticated = false;

    return (
        <>
            {
                isAuthenticated
                    ?
                    <Redirect to="/" />
                    :
                    <>
                        <section className="flex flex-1 justify-center items-center flex-col py-10">
                            {children}
                        </section>

                        <img
                            src="/assets/images/side-img.svg"
                            alt="logo"
                            className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"
                        />
                    </>
            }
        </>
    )
}

export default AuthLayout