import { Routes, Route } from 'react-router'
import { Home } from '../pages/Home'
import Room from '../pages/Room'
import { SearchResults } from '../pages/SearchResults'

export const Routing = () => {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/room/:id' element={<Room />} />
            <Route path='/:city' element={<SearchResults />} />
        </Routes>
    )
}
