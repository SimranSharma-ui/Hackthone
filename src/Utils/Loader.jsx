const Loader = ({
  text = "Loading...",
  fullScreen = true,
}) => {
  const Wrapper = fullScreen ? "min-h-screen" : "h-full";

  return (
    <div
      className={`${Wrapper} flex items-center justify-center bg-gray-50`}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="relative">
          <div className="h-14 w-14 rounded-full border-4 border-gray-300"></div>
          <div className="absolute top-0 left-0 h-14 w-14 rounded-full border-4 border-teal-600 border-t-transparent animate-spin"></div>
        </div>

        {/* Text */}
        <p className="text-sm font-medium text-gray-600 animate-pulse">
          {text}
        </p>
      </div>
    </div>
  );
};

export default Loader;
