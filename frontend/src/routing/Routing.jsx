import { Routes, Route } from 'react-router'
import { Home } from '../pages/Home'
import Room from '../pages/Room'
import { SearchResults } from '../pages/SearchResults'
import { Reservation } from '../pages/Reservation'
import Confirmation from '../pages/Confirmation'
import Auth from '../pages/Auth'
import Trips from '../pages/Trips'
import { Profile } from '../pages/Profile'

export const Routing = () => {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/room/:id' element={<Room />} />
            <Route path='/:city' element={<SearchResults />} />
            <Route path='/reservation' element={<Reservation />} />
            <Route path='/confirmation' element={<Confirmation />} />
            <Route path='/auth' element={<Auth />} />
            <Route path='/trips' element={<Trips />} />
            <Route path='/profile' element={<Profile />} />
        </Routes>
    )
}
