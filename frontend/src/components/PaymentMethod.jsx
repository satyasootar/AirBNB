import { useContext, useState } from 'react';
import { Building2, CreditCard } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import { calculateDays } from './utils/CalculateDays';

export default function PaymentMethod({
    hotelId,
    checkIn,
    checkOut,
}) {
    const [selectedMethod, setSelectedMethod] = useState('upi-id');
    const [showUpiIdField, setShowUpiIdField] = useState(true);
    const [showCardFields, setShowCardFields] = useState(false);
    const [showBankSelection, setShowBankSelection] = useState(false);
    const navigate = useNavigate()


    const { hotels, updateBookingdetails, userData } = useContext(StoreContext)
    const hotel = hotels.hotels.find((h) => h.id == hotelId)
    console.log("hotel: ", hotel);


    const cost = (calculateDays(checkIn, checkOut) * hotel.price_per_night);
    const tax = cost * 0.18
    const totalCost = cost + tax
    const checkInDate = new Date(checkIn);
    const cancelByDate = new Date(checkInDate);
    cancelByDate.setDate(checkInDate.getDate() - 1);
    const cancelByText = `${cancelByDate.getDate()} ${cancelByDate.toLocaleString('default', { month: 'long' })}`;


    const [formData, setFormData] = useState({
        virtualPaymentAddress: '',
        cardNumber: '1234 5678 9012 3456',
        expiration: 'MM/YY',
        cvv: '3 digits',
        cardholderName: 'Cardholder name'
    });

    const handleMethodChange = (method) => {
        setSelectedMethod(method);
        setShowUpiIdField(method === 'upi-id');
        setShowCardFields(method === 'card');
        setShowBankSelection(method === 'netbanking');
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const UPIIcon = () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            aria-label="upi"
            role="img"
            focusable="false"
            className="h-6 w-6"
        >
            <path
                fill="#70706e"
                d="M23.87 18.96h-1.53L24.47 11H26zm-.8-7.71a.55.55 0 0 0-.48-.23h-8.41l-.42 1.56h7.65l-.45 1.67h-7.65L12.04 19h1.54l.85-3.19h6.88c.22 0 .43-.08.6-.23.18-.14.32-.34.38-.56l.85-3.19c.07-.2.05-.4-.06-.58zm-9.92-.23h-1.53L9.9 17.44H3.77l1.72-6.42H3.96l-1.92 7.19c-.07.19-.05.4.06.56.12.16.3.24.48.23h7.9c.31 0 .59-.22.67-.54z"
            />
            <path fill="#098041" d="m28.1 11 1.9 4-4 4z" />
            <path fill="#e97626" d="m27.1 11 1.9 4-4 4z" />
        </svg>
    );

    const RadioButton = ({ checked }) => (
        <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-gray-400">
            {checked && <div className="w-3 h-3 rounded-full bg-black"></div>}
        </div>
    );

    const handlePayment = () => {
        let success = false;
        let message = "";

        switch (selectedMethod) {
            case "upi-id":
                if (formData.virtualPaymentAddress.includes("@")) {
                    success = true;
                    message = `Payment confirmed via UPI ID (${formData.virtualPaymentAddress})`;
                } else {
                    message = "Invalid UPI ID (must contain @)";
                }
                break;

            case "upi-qr":
                // In real app, you’d show QR and scan confirmation
                success = true;
                message = "Payment confirmed via UPI QR code";
                break;

            case "card":
                if (
                    formData.cardNumber.replace(/\s+/g, "") === "1212121212121212" &&
                    formData.cvv === "123" &&
                    formData.cardholderName.toLowerCase() === "airbnb"
                ) {
                    success = true;
                    message = "Payment confirmed via Card";
                } else {
                    message = "Invalid Card Details";
                }
                break;

            case "netbanking":
                // For now assume success (later can add bank selection)
                success = true;
                message = "Payment confirmed via Netbanking";
                break;

            default:
                message = "Please select a payment method";
        }

        if (success) {
            toast.success(message);
            updateBookingdetails({
                ...userData.current,
                cost: cost,
                tax: tax,
                totalcost: totalCost,
                cancleBy: cancelByText
            })
            navigate("/confirmation")

        } else {
            toast.error(message);
        }
    };



    return (
        <div className="min-w-lg mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-4">
            <h1 className="text-xl font-semibold text-gray-900 mb-6">1. Add a payment method</h1>

            {/* UPI QR Code */}
            <div
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleMethodChange('upi-qr')}
            >
                <div className="flex items-center space-x-3">
                    <UPIIcon />
                    <span className="font-medium text-gray-900">UPI QR code</span>
                </div>
                <RadioButton checked={selectedMethod === 'upi-qr'} />
            </div>

            {/* UPI ID */}
            <div className="space-y-3">
                <div
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleMethodChange('upi-id')}
                >
                    <div className="flex items-center space-x-3">
                        <UPIIcon />
                        <span className="font-medium text-gray-900">UPI ID</span>
                    </div>
                    <RadioButton checked={selectedMethod === 'upi-id'} />
                </div>

                {showUpiIdField && (
                    <div className="space-y-2 px-4">
                        <input
                            type="text"
                            placeholder="Virtual payment address"
                            value={formData.virtualPaymentAddress}
                            onChange={(e) => handleInputChange('virtualPaymentAddress', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                        <p className="text-sm text-gray-500">
                            Example: username@bank. <span className="text-blue-600 hover:underline cursor-pointer">Learn more</span>
                        </p>
                    </div>
                )}
            </div>

            {/* Credit or Debit Card */}
            <div className="space-y-3">
                <div
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleMethodChange('card')}
                >
                    <div className="flex items-center space-x-3">
                        <CreditCard className="h-6 w-6 text-gray-600" />
                        <div className="flex flex-col">
                            <span className="font-medium text-gray-900">Credit or debit card</span>
                            <div className="flex space-x-2 mt-1">
                                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 32'%3E%3Cpath fill='%23005cb2' d='M15 2h18v28H15z'/%3E%3Cpath fill='%23f79e1b' d='M0 2h18v28H0z'/%3E%3C/svg%3E" alt="Visa" className="h-4 w-6" />
                                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 32'%3E%3Cpath fill='%23eb001b' d='M15 2h18v28H15z'/%3E%3Cpath fill='%23ff5f00' d='M27 2h6v28h-6z'/%3E%3C/svg%3E" alt="Mastercard" className="h-4 w-6" />
                                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 32'%3E%3Cpath fill='%230066cc' d='M0 2h48v28H0z'/%3E%3C/svg%3E" alt="American Express" className="h-4 w-6" />
                                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 32'%3E%3Cpath fill='%23003087' d='M0 2h48v28H0z'/%3E%3C/svg%3E" alt="RuPay" className="h-4 w-6" />
                            </div>
                        </div>
                    </div>
                    <RadioButton checked={selectedMethod === 'card'} />
                </div>

                {showCardFields && (
                    <div className="space-y-3 px-4">
                        <div className="space-y-1">
                            <div className="flex items-center space-x-1">
                                <span className="text-sm text-gray-700">Card number</span>
                                <div className="w-3 h-3 bg-gray-400 rounded-sm flex items-center justify-center">
                                    <div className="w-1 h-1 bg-white rounded-full"></div>
                                </div>
                            </div>
                            <input
                                type="text"
                                value={formData.cardNumber}
                                onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <input
                                type="text"
                                placeholder="MM/YY"
                                value={formData.expiration}
                                onChange={(e) => handleInputChange('expiration', e.target.value)}
                                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                            <input
                                type="text"
                                placeholder="3 digits"
                                value={formData.cvv}
                                onChange={(e) => handleInputChange('cvv', e.target.value)}
                                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                        </div>

                        <input
                            type="text"
                            placeholder="Cardholder name"
                            value={formData.cardholderName}
                            onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                    </div>
                )}
            </div>

            {/* Net Banking */}
            <div
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleMethodChange('netbanking')}
            >
                <div className="flex items-center space-x-3">
                    <Building2 className="h-6 w-6 text-gray-600" />
                    <span className="font-medium text-gray-900">Net Banking</span>
                </div>
                <RadioButton checked={selectedMethod === 'netbanking'} />
            </div>

            {/* Action Button */}
            <div className="pt-4">
                {showBankSelection ? (
                    <button className="w-full bg-gray-800 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-900 transition-colors">
                        Choose your bank
                    </button>
                ) : (
                    <button onClick={handlePayment} className="w-full bg-gray-800 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-900 transition-colors">
                        Next
                    </button>
                )}
            </div>
        </div>
    );
}