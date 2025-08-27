import { Routes, Route } from 'react-router'
import { Home } from '../pages/Home'
import Room from '../pages/Room'

export const Routing = () => {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/room/:id' element={<Room />} />
        </Routes>
    )
}
