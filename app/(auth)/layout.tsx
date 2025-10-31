import Image from "next/image";
import { ReactNode } from "react";

import SocialAuthForm from "@/components/forms/SocialAuthForm";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="flex justify-center items-center bg-auth-light dark:bg-auth-dark bg-cover bg-no-repeat bg-center px-4 py-10 min-h-screen">
      <section className="shadow-light100_dark100 shadow-md px-4 sm:px-8 py-10 border light-border rounded-[10px] min-w-full sm:min-w-[520px] background-light800_dark200">
        <div className="flex justify-between items-center gap-2">
          <div className="space-y-2.5">
            <h1 className="text-dark100_light900 h2-bold">Join CodeVerse</h1>
            <p className="text-dark500_light400 paragraph-regular">
              To get your questions answered
            </p>
          </div>
          <Image
            src="images/site-logo.svg"
            alt="CodeVerse Logo"
            width={50}
            height={50}
            className="object-contain"
          />
        </div>

        {children}

        <SocialAuthForm />
      </section>
    </main>
  );
};

export default AuthLayout;
