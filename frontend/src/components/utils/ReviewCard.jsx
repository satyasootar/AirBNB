

const ReviewCard = ({ firstName, year, comment, img }) => {
    return (
        <div className="flex gap-4 p-4 bg-white max-w-lg">
            {/* Profile Picture */}
            <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0" >
                <img src={img} alt="Profile Image " className="rounded-full" />
            </div>

            {/* Review Content */}
            <div className="flex flex-col">
                {/* User Info */}
                <h3 className="font-semibold text-gray-900">{firstName}</h3>
                <p className="text-sm text-gray-500">{year} years on Airbnb</p>

                {/* Stars + Time */}
                <div className="flex items-center gap-2 mt-1">
                    <span>★★★★★</span>
                    <span className="text-sm text-gray-500">· 2 weeks ago</span>
                </div>

                {/* Review Text */}
                <p className="mt-2 text-gray-700 text-sm leading-relaxed">
                    {comment}
                </p>
            </div>
        </div>
    );
};

export default ReviewCard;
