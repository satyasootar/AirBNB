// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion"

export const MobileSearchTrigger = ({hide, isMobileExpanded, setIsMobileExpanded}) => {
    return (
        <motion.div className={`${isMobileExpanded ? "hidden" : "block"} md:hidden fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-11/12`}
            animate={{ y: hide ? "-300%" : "0%" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}>

            <div
                className="flex items-center justify-between bg-white border border-gray-300 rounded-full shadow-lg p-3 cursor-pointer"
                onClick={() => { setIsMobileExpanded(true) }}
            >
                <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search text-gray-600 mr-2">
                        <path d="m21 21-4.34-4.34" />
                        <circle cx="11" cy="11" r="8" />
                    </svg>
                    <span className="text-sm text-gray-600">Start your search</span>
                </div>
                <div className="w-8 h-8 flex items-center justify-center bg-airbnb rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-filter">
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                    </svg>
                </div>
            </div>
        </motion.div>
    )
}
