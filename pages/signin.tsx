import { NextPageContext } from "next";
import { useSession, getProviders, signIn, getSession } from "next-auth/react";

type Providers = {
  [key: string]: Provider;
};

interface Provider {
  id: String;
  name: String;
  type: String;
  signinUrl: String;
  callbackUrl: String;
}

function Signin({ providers }: Providers) {
  const { data: session } = useSession();

  return (
    <div className="h-screen flex flex-col items-center mt-32">
      <div className="bg-darkGreen rounded-full h-80 w-80 flex justify-center flex-col items-center">
        {Object.values(providers).map((provider) => {
          return (
            <div
              className="bg-yellow-300 rounded w-3/4 flex flex-col font-light h-12 pl-1.5 m-4"
              key={provider.name}>
              <button
                className="text-2xl text-center py-2"
                onClick={() =>
                  signIn(provider.id, { callbackUrl: "/dashboard" })
                }>
                Sign in with {provider.name}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  const providers = await getProviders();
  const { req } = context;
  const session = await getSession({ req });

  if (session) {
    return {
      redirect: { destination: "/dashboard" },
    };
  }

  return {
    props: {
      providers,
    },
  };
}

export default Signin;
