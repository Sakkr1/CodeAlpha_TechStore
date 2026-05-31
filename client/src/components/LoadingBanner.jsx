import { useGlobalLoading } from "../context/LoadingContext";

export default function LoadingBanner() {
  const loading = useGlobalLoading();

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[60] h-[3px] transition-opacity duration-300 ${
        loading ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="h-full w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-loading-bar" />
    </div>
  );
}
