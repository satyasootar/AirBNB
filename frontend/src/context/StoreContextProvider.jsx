import { StoreContext } from './StoreContext.js'
import data from '../Dummy/DummyData.json'

const StoreContextProvider = ({ children }) => {
    const hotels = structuredClone(data)


    const value = { hotels }
    return (
        <StoreContext.Provider value={value}>
            {children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider