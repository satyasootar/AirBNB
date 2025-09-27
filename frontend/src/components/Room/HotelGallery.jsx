import { Grip } from "lucide-react";

export default function HotelGallery({ hotel }) {
    if (!hotel?.images || hotel.images.length < 5) return null;

    return (
        <div className="relative py-5 w-full max-w-[1200px] mx-auto">
            {/* Same layout for all screens */}
            <div className="flex gap-2 max-h-[25rem]">
                {/* Left big image */}
                <div className="w-1/2 overflow-hidden rounded-l-md">
                    <img
                        src={hotel.images[0].url}
                        alt="Hotel"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Right 2x2 grid */}
                <div className="w-1/2 grid grid-cols-2 grid-rows-2 gap-2">
                    <img
                        src={hotel.images[1].url}
                        alt="Hotel"
                        className="w-full h-full object-cover"
                    />
                    <img
                        src={hotel.images[2].url}
                        alt="Hotel"
                        className="w-full h-full object-cover rounded-tr-md"
                    />
                    <img
                        src={hotel.images[3].url}
                        alt="Hotel"
                        className="w-full h-full object-cover"
                    />
                    <img
                        src={hotel.images[4].url}
                        alt="Hotel"
                        className="w-full h-full object-cover rounded-br-md"
                    />
                </div>
            </div>

            {/* Show all photos button */}
            <div className="bg-white w-[10rem] h-[2rem] rounded-lg flex justify-center items-center gap-2 absolute bottom-7 right-3 shadow">
                <Grip size="20" />
                <div className="font-semibold">Show all photos</div>
            </div>
        </div>
    );
}
