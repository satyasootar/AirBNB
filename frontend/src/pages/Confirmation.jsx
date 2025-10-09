import React, { useContext, useEffect, useState, useRef } from "react";
import { StoreContext } from "../context/StoreContext";

export default function BookingConfirmation() {
    const { bookingDetails } = useContext(StoreContext);
    const [details, setDetails] = useState(null);
    const receiptRef = useRef();

    useEffect(() => {
        if (bookingDetails.current) {
            setDetails(bookingDetails.current);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bookingDetails.current]);

   const printReceipt = () => {
    const printWindow = window.open('', '_blank');
    const receiptElement = receiptRef.current;
    
    if (!receiptElement) return;

    const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Airbnb Booking Receipt</title>
            <meta charset="UTF-8">
            <style>
                @import url('https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css');
                
                * {
                    box-sizing: border-box;
                }
                
                body { 
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; 
                    padding: 0;
                    margin: 0;
                    background: white;
                    color: #484848;
                    font-size: 14px;
                    line-height: 1.4;
                }
                
                .print-container {
                    max-width: 600px;
                    margin: 0 auto;
                    background: white;
                    box-shadow: none;
                }
                
                /* Airbnb brand colors */
                .airbnb-brand {
                    color: #FF5A5F !important;
                }
                
                .airbnb-bg {
                    background: #FF5A5F !important;
                }
                
                .airbnb-secondary {
                    color: #00A699 !important;
                }
                
                /* Receipt header */
                .receipt-header {
                    background: #FF5A5F;
                    color: white;
                    padding: 30px 40px;
                    text-align: center;
                    border-bottom: 1px solid #e8e8e8;
                }
                
                .receipt-content {
                    padding: 40px;
                    border: 1px solid #e8e8e8;
                    border-top: none;
                }
                
                /* Status badge */
                .status-confirmed {
                    background: #00A699;
                    color: white;
                    padding: 6px 16px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                    display: inline-block;
                    margin-top: 10px;
                }
                
                /* Section styling */
                .section {
                    margin-bottom: 30px;
                    padding-bottom: 20px;
                    border-bottom: 1px solid #e8e8e8;
                }
                
                .section:last-child {
                    border-bottom: none;
                    margin-bottom: 0;
                }
                
                .section-title {
                    font-size: 16px;
                    font-weight: 600;
                    color: #484848;
                    margin-bottom: 16px;
                    padding-bottom: 8px;
                    border-bottom: 1px solid #e8e8e8;
                }
                
                /* Grid layouts */
                .info-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }
                
                .info-item {
                    margin-bottom: 12px;
                }
                
                .info-label {
                    font-size: 12px;
                    color: #717171;
                    font-weight: 500;
                    margin-bottom: 4px;
                }
                
                .info-value {
                    font-size: 14px;
                    color: #484848;
                    font-weight: 400;
                }
                
                /* Price breakdown */
                .price-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 8px 0;
                    border-bottom: 1px solid #f5f5f5;
                }
                
                .price-row.total {
                    border-top: 2px solid #484848;
                    border-bottom: none;
                    font-weight: 700;
                    font-size: 16px;
                    padding-top: 12px;
                    margin-top: 8px;
                }
                
                /* Signature area */
                .signature-area {
                    margin-top: 40px;
                    padding-top: 30px;
                    border-top: 1px dashed #e8e8e8;
                }
                
                .signature-line {
                    border-top: 1px solid #484848;
                    width: 200px;
                    margin-top: 40px;
                }
                
                .signature-label {
                    font-size: 12px;
                    color: #717171;
                    margin-top: 4px;
                }
                
                /* Print optimizations */
                @media print {
                    body { 
                        margin: 0 !important; 
                        padding: 0 !important; 
                        background: white !important;
                    }
                    
                    .print-container {
                        max-width: 100% !important;
                        margin: 0 !important;
                        box-shadow: none !important;
                        border: none !important;
                    }
                    
                    .receipt-content {
                        padding: 20px !important;
                        border: none !important;
                    }
                    
                    .no-print { 
                        display: none !important; 
                    }
                    
                    .section {
                        page-break-inside: avoid;
                    }
                    
                    .receipt-header {
                        page-break-after: avoid;
                    }
                }
                
                /* Utility classes */
                .text-center { text-align: center; }
                .text-right { text-align: right; }
                .font-semibold { font-weight: 600; }
                .mt-4 { margin-top: 16px; }
                .mt-6 { margin-top: 24px; }
                .mb-2 { margin-bottom: 8px; }
                .mb-4 { margin-bottom: 16px; }
                .py-3 { padding-top: 12px; padding-bottom: 12px; }
            </style>
        </head>
        <body>
            <div class="print-container">
                <div class="receipt-header">
                    <h1 style="font-size: 28px; font-weight: 700; margin: 0 0 8px 0;">Airbnb</h1>
                    <p style="font-size: 18px; margin: 0 0 12px 0; opacity: 0.9;">Booking Confirmation</p>
                    <div class="status-confirmed">Confirmed</div>
                </div>
                
                <div class="receipt-content">
                    <!-- Booking Information -->
                    <div class="section">
                        <h2 class="section-title">Booking Details</h2>
                        <div class="info-grid">
                            <div class="info-item">
                                <div class="info-label">CONFIRMATION CODE</div>
                                <div class="info-value font-semibold">AB${details.hotelId}${Math.random().toString(36).substr(2, 6).toUpperCase()}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">BOOKING DATE</div>
                                <div class="info-value">${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">CHECK-IN</div>
                                <div class="info-value font-semibold">${new Date(details.checkIn).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">CHECK-OUT</div>
                                <div class="info-value font-semibold">${new Date(details.checkOut).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">GUESTS</div>
                                <div class="info-value">${details.adult} adult${details.adult > 1 ? 's' : ''}${details.children > 0 ? `, ${details.children} child${details.children > 1 ? 'ren' : ''}` : ''}${details.infant > 0 ? `, ${details.infant} infant${details.infant > 1 ? 's' : ''}` : ''}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">DESTINATION</div>
                                <div class="info-value font-semibold">${details.destination}</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Payment Breakdown -->
                    <div class="section">
                        <h2 class="section-title">Payment Summary</h2>
                        <div style="max-width: 400px;">
                            <div class="price-row">
                                <span>Room cost (${details.nights} night${details.nights > 1 ? 's' : ''})</span>
                                <span>₹${details.cost.toLocaleString("en-IN")}</span>
                            </div>
                            <div class="price-row">
                                <span>Taxes and fees</span>
                                <span>₹${details.tax.toLocaleString("en-IN")}</span>
                            </div>
                            <div class="price-row total">
                                <span>Total (INR)</span>
                                <span>₹${details.totalcost.toLocaleString("en-IN")}</span>
                            </div>
                        </div>
                        
                        <div class="mt-6" style="font-size: 12px; color: #717171;">
                            <div class="info-label">PAYMENT METHOD</div>
                            <div class="info-value">Credit Card •••• •••• •••• 4242</div>
                            <div class="info-label mt-4">PAYMENT STATUS</div>
                            <div class="info-value" style="color: #00A699;">Paid in full • ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                        </div>
                    </div>
                    
                    <!-- Cancellation Policy -->
                    <div class="section">
                        <h2 class="section-title">Cancellation Policy</h2>
                        <p style="font-size: 13px; line-height: 1.5; color: #484848;">
                            Free cancellation until ${details.cancelBy}. After that, cancel before check-in on ${new Date(details.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} for a partial refund.
                        </p>
                    </div>
                    
                    <!-- Signature Area -->
                    <div class="signature-area">
                        <div style="display: flex; justify-content: space-between; align-items: flex-end;">
                            <div>
                                <div class="signature-line"></div>
                                <div class="signature-label">Guest Signature</div>
                            </div>
                            <div style="text-align: right;">
                                <div style="font-size: 12px; color: #717171;">${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                                <div class="signature-label">Date</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Footer -->
                    <div class="text-center mt-6" style="font-size: 11px; color: #717171; line-height: 1.4;">
                        <p>Thank you for choosing Airbnb. This receipt has been generated electronically and is valid without signature.</p>
                        <p>If you have any questions about your reservation, please visit airbnb.com/help or contact us at support@airbnb.com</p>
                        <p style="margin-top: 16px;">Airbnb, Inc. • 888 Brannan Street • San Francisco, CA 94103</p>
                    </div>
                </div>
            </div>
            
            <script>
                window.onload = function() {
                    // Add brief delay to ensure all content is rendered
                    setTimeout(() => {
                        window.print();
                        setTimeout(() => window.close(), 1000);
                    }, 500);
                }
                
                // Fallback in case print is cancelled
                window.onafterprint = function() {
                    setTimeout(() => window.close(), 1000);
                };
            </script>
        </body>
        </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
};

    if (!details) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-airbnb border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading booking details...</p>
                </div>
            </div>
        );
    }

    const {
        destination,
        hotelId,
        checkIn,
        checkOut,
        adult,
        children,
        infant,
        cancelBy,
        cost,
        tax,
        totalcost,
    } = details;

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8 no-print">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                        Booking Confirmed!
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Your stay in <span className="font-medium text-airbnb">{destination}</span> is all set
                    </p>
                </div>

                <div ref={receiptRef} className="bg-white rounded-2xl shadow-card overflow-hidden mb-6">
                    <div className="bg-airbnb text-white px-6 py-4">
                        <h2 className="text-xl font-semibold">Booking Summary</h2>
                        <p className="text-white text-opacity-90">Hotel ID: {hotelId}</p>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-1">CHECK-IN</h3>
                                    <p className="text-gray-900 font-medium">{new Date(checkIn).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-1">GUESTS</h3>
                                    <p className="text-gray-900 font-medium">
                                        {adult} adult{adult > 1 ? 's' : ''}
                                        {children > 0 && `, ${children} child${children > 1 ? 'ren' : ''}`}
                                        {infant > 0 && `, ${infant} infant${infant > 1 ? 's' : ''}`}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-1">CHECK-OUT</h3>
                                    <p className="text-gray-900 font-medium">{new Date(checkOut).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-1">CANCELLATION</h3>
                                    <p className="text-gray-900 font-medium">Free until {cancelBy}</p>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-2 pt-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Details</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Room cost</span>
                                    <span className="text-gray-900">₹{cost.toLocaleString("en-IN")}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Taxes and fees</span>
                                    <span className="text-gray-900">₹{tax.toLocaleString("en-IN")}</span>
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t border-gray-2">
                                    <span className="text-lg font-semibold text-gray-900">Total (INR)</span>
                                    <span className="text-lg font-semibold text-gray-900">₹{totalcost.toLocaleString("en-IN")}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-card p-6 mb-6 no-print">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                        <button
                            onClick={printReceipt}
                            className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
                            </svg>
                            Print Receipt
                        </button>
                        <button
                            onClick={() => (window.location.href = "/")}
                            className="w-full sm:w-auto px-6 py-3 bg-airbnb text-white font-medium rounded-lg hover:bg-airbnb-dark transition-colors"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>

                <div className="text-center no-print">
                    <p className="text-gray-500 text-sm">
                        A confirmation email has been sent to your registered email address.
                    </p>
                </div>
            </div>
        </div>
    );
}