import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { DocumentData } from "firebase/firestore";
import { useRef, useState } from "react";
import { Movie } from "../typings";
import Thumbnail from "./Thumbnail";

interface Props {
  title: string;
  // movies: Movie[];
  // firebase
  movies: Movie[] | DocumentData[]
}

function Row({ title, movies }: Props) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isMoved, setIsMoved] = useState(false);

  const handleClick = (direction: string) => {
    setIsMoved(true);

    // rowRef has different values
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;

      // screen size -> clientWidth
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;

      rowRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  console.log(rowRef.current?.scrollLeft, rowRef.current?.clientWidth);

  return (
    <div className="h-40 space-y-0.5 md:space-y-2">
      <h2 className="w-56 cursor-pointer text-sm font-semibold text-[#e5e5e5] transition duration-200 hover:text-white md:text-2xl">
        {title}
      </h2>

      <div className="group relative md:-ml-2">
        <ChevronLeftIcon
          className={`arrowIcon left-2 ${!isMoved && "hidden"}`}
          onClick={() => handleClick("left")}
        />

        {/* movies */}
        <div
          ref={rowRef}
          className="flex scrollbar-hide items-center space-x-0.5 overflow-x-scroll md:space-x-2.5 md:p-2"
        >
          {/* thumbnail */}
          {movies.map((movie) => (
            <Thumbnail key={movie.id} movie={movie} />
          ))}
        </div>

        <ChevronRightIcon
          className="arrowIcon right-2"
          onClick={() => handleClick("right")}
        />
      </div>
    </div>
  );
}

export default Row;
