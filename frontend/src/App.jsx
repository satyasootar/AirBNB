import { ToastContainer } from 'react-toastify'
import Footer from './components/Footer'
import { Navbar } from './components/Navbar/Navbar'
import { Routing } from './routing/Routing'

export const App = () => {
  return (
    <div >
      <ToastContainer />
      <Navbar />
      <Routing />
      <Footer />
    </div>
  )
}
