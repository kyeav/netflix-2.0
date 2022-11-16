import { getProducts, Product } from "@stripe/firestore-stripe-payments";
import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import Membership from "../components/Membership";
import useAuth from "../hooks/useAuth";
import useSubscription from "../hooks/useSubscription";
import payments, { goToBillingPortal } from "../lib/stripe";

interface Props {
  products: Product[];
}

function Account({ products }: Props) {
  const { user, logout } = useAuth();
  const subscription = useSubscription(user);

  console.log(products);

  return (
    <div>
      <Head>
        <title>Home - Netflix</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-[#141414]">
        <Link href="/">
          <img
            src="https://rb.gy/ulxxee"
            width={120}
            height={120}
            className="cursor-pointer object-contain"
          />
        </Link>

        <Link href="/account">
          <img
            src="https://rb.gy/g1pwyx"
            alt=""
            className="cursor-pointer rounded"
          />
        </Link>
      </header>

      <main className="pt-24 mx-auto max-w-6xl px-5 pb-12 transition-all md:px-10">
        <div className="flex flex-col gap-x-4 md:flex-row md:items-center">
          <h1 className="text-3xl md:text-4xl">Account</h1>
          <div className="-ml-0.5 flex items-center gap-x-1.5">
            <img src="https://rb.gy/4vfk4r" alt="" className="h-7 w-7" />
            <p className="text-xs font-semibold text-[#555]">
              Member since {subscription?.created}
            </p>
          </div>
        </div>

        <Membership />

        <div className="accountBox">
          <h4 className="text-lg text-[gray]">Plan Details</h4>
          {/* find current plan */}
          <div className="col-span-2 font-medium">
            {
              products.filter(
                (product) => product.id === subscription?.product
              )[0]?.name
            }
          </div>

          <p
            onClick={goToBillingPortal}
            className="cursor-pointer text-blue-500 hover:underline md:text-right"
          >
            Change Plan
          </p>
        </div>

        <div className="accountBox">
          <h4 className="text-lg text-[gray]">Settings</h4>
          <p
            className="col-span-3 cursor-pointer text-blue-500 hover:underline"
            onClick={logout}
          >
            Sign Out of All Devices
          </p>
        </div>
      </main>
    </div>
  );
}

export default Account;

// static rendering -> not going to update every single time
export const getStaticProps: GetStaticProps = async () => {
  const products = await getProducts(payments, {
    includePrices: true,
    activeOnly: true,
  })
    .then((res) => res)
    .catch((error) => console.log(error.message));

  return {
    props: {
      products,
    },
  };
};
