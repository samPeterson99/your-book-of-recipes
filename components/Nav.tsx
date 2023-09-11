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
      <div className="flex justify-between p-2 items-center">
        <Link
          href="/"
          className="font-bold text-l sm:text-sm md:-mr-28  sm:mr-0 flex-none">
          YOURBOOKofRECIPES
        </Link>
        <ul className="flex-none">
          <li>
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
        </ul>
        {session && session.user ? (
          <button
            className="flex-none border-2 p-2 rounded-2xl border-darkGreen hover:bg-cream hover:text-green"
            onClick={() => signOut()}>
            Sign out
          </button>
        ) : (
          <button
            className="flex-none border-2 p-2 rounded-2xl border-darkGreen hover:bg-cream hover:text-green"
            onClick={redirectToSignIn}>
            Sign in
          </button>
        )}
      </div>
    </div>
  );
}
