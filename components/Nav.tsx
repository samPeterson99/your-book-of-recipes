import Link from "next/link";
import { HomeIcon } from "@heroicons/react/24/outline";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";

export default function Nav() {
  const { data: session } = useSession();
  const router = useRouter();

  const redirectToSignIn = () => {
    router.push("/signin");
  };

  return (
    <div className="max-w-full container bg-darkGreen text-cream">
      <div className="flex justify-between items-center w-full">
        <div className="w-1/3">
          <Link
            href="/"
            className="font-bold text-l sm:text-sm p-2">
            YOURBOOKofRECIPES
          </Link>
        </div>
        <ul className="flex flex-row w-1/3 justify-self-center justify-center ">
          <li className="text-sm w-16 sm:hidden lg:block mt-1 text-center">
            <Link href="/blog">blog</Link>
          </li>
          <li className="w-fit justify-self-center text-center mx-10">
            <Link href="/dashboard">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                />
              </svg>
            </Link>
          </li>
          <li className="text-sm w-fit sm:hidden lg:block mt-1">
            <Link href="/recipeScraper">recipe scraper</Link>
          </li>
        </ul>
        <div className="w-1/3 flex justify-end p-2">
          {session && session.user ? (
            <button
              className="border-2 p-2 rounded-2xl border-darkGreen hover:bg-cream hover:text-green"
              onClick={() => signOut()}>
              Sign out
            </button>
          ) : (
            <button
              className="border-2 p-2 rounded-2xl border-darkGreen hover:bg-cream hover:text-green"
              onClick={redirectToSignIn}>
              Sign in
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
