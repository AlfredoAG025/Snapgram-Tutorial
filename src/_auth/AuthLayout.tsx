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
                        <section className="flex flex-col items-center justify-center flex-1 py-10">
                            {children}
                        </section>

                        <img
                            src="/assets/images/side-img.svg"
                            alt="logo"
                            className="hidden object-cover w-1/2 bg-no-repeat xl:block"
                        />
                    </>
            }
        </>
    )
}

export default AuthLayout