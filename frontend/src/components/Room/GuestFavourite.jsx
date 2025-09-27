export default function GuestFavourite({ rating, title, description }) {
    return (
        <div className="flex flex-col justify-center items-center px-4 sm:px-6 md:px-0 py-5">
            <div className="flex items-center">
                <img
                    src="/assets/leaf.png"
                    className="w-12 sm:w-16 md:w-20"
                    alt="Leaf"
                />
                <div className="text-4xl sm:text-6xl md:text-8xl font-bold mx-2">
                    {rating}
                </div>
                <img
                    src="/assets/leaf.png"
                    className="w-12 sm:w-16 md:w-20 transform scale-x-[-1]"
                    alt="Leaf mirrored"
                />
            </div>

            <div className="text-lg sm:text-xl md:text-2xl font-semibold mt-2">
                {title}
            </div>
            <div className="text-sm sm:text-base md:text-xl font-medium text-gray-400 text-center w-full sm:w-3/4 md:w-1/2 mt-1">
                {description}
            </div>
        </div>

    );
}
