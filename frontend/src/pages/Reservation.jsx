import { useNavigate, useSearchParams } from "react-router-dom"
import { ArrowUp } from 'lucide-react';
import PaymentMethod from "../components/PaymentMethod";
import BookingSummaryCard from "../components/BookingSummaryCard";




export const Reservation = () => {
    const [params] = useSearchParams()
    const navigate = useNavigate()
    const destination = params.get("destination")
    const checkIn = params.get("checkIn")
    const checkOut = params.get("checkOut")
    const adult = Number(params.get("adult"))
    const children = Number(params.get("children"))
    const infant = Number(params.get("infant"))
    const hotelID = Number(params.get("hotelId"))




    return (
        <div className="md:px-50">
 
            <div className="text-3xl font-bold text-gray-900 flex items-center gap-6 py-6 ">
                <button onClick={() => navigate(-1)} className="cursor-pointer"><ArrowUp className="rotate-270" /></button>
                <div>Confirm and pay</div>
            </div>


            <div className="flex justify-center flex-col-reverse gap-6 md:flex-row md:justify-between ">
                <div>
                    <PaymentMethod
                        hotelId={hotelID}
                        destination={destination}
                        checkIn={checkIn}
                        checkOut={checkOut}
                        adult={adult}
                        children={children}
                        infant={infant}
                    />
                </div>
                <div>
                    <BookingSummaryCard hotelId={hotelID}
                        destination={destination}
                        checkIn={checkIn}
                        checkOut={checkOut}
                        adult={adult}
                        children={children}
                        infant={infant} />
                </div>
            </div>
        </div>
    )
}
