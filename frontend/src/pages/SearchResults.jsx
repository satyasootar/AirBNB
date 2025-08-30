import { useParams } from "react-router-dom";


export const SearchResults = ({ latitude, longitude }) => {

    const mapSrc = `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&hl=en&output=embed`;
    const { city } = useParams();
    console.log("city: ", city);

    return (
        <div className='flex' >
            <div>

            </div>
            <div>
                <div className="w-[588px] h-[588px] rounded-2xl overflow-hidden shadow-lg">
                    <iframe
                        title="Google Map"
                        src={mapSrc}
                        className="w-full h-full border-0"
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>

            </div>
        </div>
    )
}
