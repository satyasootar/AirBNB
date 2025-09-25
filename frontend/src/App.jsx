import Footer from './components/Footer'
import { Navbar } from './components/Navbar/Navbar'
import { Routing } from './routing/Routing'

export const App = () => {
  return (
    <div >
      <Navbar />
      <Routing />
      <Footer />
    </div>
  )
}
