
import { FaRegNewspaper, FaUsers, FaCompass } from "react-icons/fa";

interface EmptyHomeProps {
  tab: "forYou" | "following";
  onChangeTab: () => void;
}

export default function EmptyHome({
  tab,
  onChangeTab,
}: EmptyHomeProps) {
  const isFollowing = tab === "following";

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-indigo-100 bg-white px-6 py-12 text-center shadow-sm">
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50">
        {isFollowing ? (
          <FaUsers className="text-indigo-500" size={32} />
        ) : (
          <FaRegNewspaper className="text-indigo-500" size={32} />
        )}
      </div>

      <h2 className="text-lg font-bold text-[#17152B]">
        {isFollowing ? "No posts from people you follow" : "Your feed is empty"}
      </h2>

      <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
        {isFollowing
          ? "Your friends haven't shared anything yet. Explore other posts or follow more people to see their updates here."
          : "There's nothing to show right now. Discover posts from the community and join the conversation!"}
      </p>

      <button
        type="button"
        onClick={onChangeTab}
        className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
      >
        <FaCompass size={14} />
        {isFollowing ? "Explore For You" : "View Following"}
      </button>
    </div>
  );
}
