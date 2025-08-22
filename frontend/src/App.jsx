import { Navbar } from './components/Navbar'
import { Card } from './components/utils/Card'
import { Routing } from './routing/Routing'

export const App = () => {
  return (
    <div>
      <Navbar />
      <Routing />
    </div>
  )
}
