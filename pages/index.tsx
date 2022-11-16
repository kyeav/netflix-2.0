import Head from "next/head";
import Header from "../components/Header";
import Banner from "../components/Banner";
import requests from "../utils/requests";
import { Movie } from "../typings";
import Row from "../components/Row";
import useAuth from "../hooks/useAuth";
import { modalState, movieState } from "../atoms/modalAtom";
import { useRecoilValue } from "recoil";
import Modal from "../components/Modal";
import Plans from "../components/Plans";
import { getProducts, Product } from "@stripe/firestore-stripe-payments";
import payments from "../lib/stripe";
import useSubscription from "../hooks/useSubscription";
import useList from "../hooks/useList";

// typescript for intelisense, debugging errors, production, robust code

interface Props {
  // [Movie]
  netflixOriginals: Movie[];
  trendingNow: Movie[];
  topRated: Movie[];
  actionMovies: Movie[];
  comedyMovies: Movie[];
  horrorMovies: Movie[];
  romanceMovies: Movie[];
  documentaries: Movie[];
  products: Product[];
}

const Home = ({
  netflixOriginals,
  trendingNow,
  topRated,
  actionMovies,
  comedyMovies,
  horrorMovies,
  romanceMovies,
  documentaries,
  products,
}: Props) => {
  console.log(netflixOriginals);
  console.log(products);

  const { loading, user } = useAuth();
  // state management -> Recoiljs
  const showModal = useRecoilValue(modalState);
  const subscription = useSubscription(user);
  const movie = useRecoilValue(movieState);
  const list = useList(user?.uid);

  console.log(subscription);

  if (loading || subscription === null) return null;

  if (!subscription) return <Plans products={products} />;

  return (
    //  from-gray-900/10 to-[#010511]
    <div
      className={`relative h-screen bg-gradient-to-b lg:h-[140vh] ${
        showModal && "!h-screen overflow-hidden"
      }`}
    >
      <Head>
        <title>Home - Netflix</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* semantic html improves seo */}

      {/* header */}
      <Header />

      <main className="relative pl-4 pb-24 lg:space-y-24 lg:pl-16">
        {/* banner */}
        <Banner netflixOriginals={netflixOriginals} />

        <section className="md:space-y-24">
          <Row title="Trending Now" movies={trendingNow} />
          <Row title="Top Rated" movies={topRated} />
          <Row title="Action Thrillers" movies={actionMovies} />

          {/* My List component */}
          {list.length > 0 && <Row title="My List" movies={list} />}

          <Row title="Comedies" movies={comedyMovies} />
          <Row title="Scary Movies" movies={horrorMovies} />
          <Row title="Romance Movies" movies={romanceMovies} />
          <Row title="Documentaries" movies={documentaries} />
        </section>
      </main>

      {/* modal */}
      {showModal && <Modal />}
    </div>
  );
};

export default Home;

// ssr, no loading required
export const getServerSideProps = async () => {
  const products = await getProducts(payments, {
    // options
    includePrices: true,
    activeOnly: true,
  })
    .then((res) => res)
    .catch((error) => console.log(error.message));

  const [
    netflixOriginals,
    trendingNow,
    topRated,
    actionMovies,
    comedyMovies,
    horrorMovies,
    romanceMovies,
    documentaries,
  ] = await Promise.all([
    fetch(requests.fetchNetflixOriginals).then((res) => res.json()),
    fetch(requests.fetchTrending).then((res) => res.json()),
    fetch(requests.fetchTopRated).then((res) => res.json()),
    fetch(requests.fetchActionMovies).then((res) => res.json()),
    fetch(requests.fetchComedyMovies).then((res) => res.json()),
    fetch(requests.fetchHorrorMovies).then((res) => res.json()),
    fetch(requests.fetchRomanceMovies).then((res) => res.json()),
    fetch(requests.fetchDocumentaries).then((res) => res.json()),
  ]);

  return {
    props: {
      netflixOriginals: netflixOriginals.results,
      trendingNow: trendingNow.results,
      topRated: topRated.results,
      actionMovies: actionMovies.results,
      comedyMovies: comedyMovies.results,
      horrorMovies: horrorMovies.results,
      romanceMovies: romanceMovies.results,
      documentaries: documentaries.results,
      products,
    },
  };
};
