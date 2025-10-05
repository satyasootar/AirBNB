import { CardCarousel } from '../components/CardCarousel'

export const Home = () => {
  return (
    <div className='sm:px-5 md:px-10 py-20'>
      <CardCarousel destination="Bhubaneshwar" />
      <CardCarousel destination="Mumbai" />
      <CardCarousel destination="Bengaluru" />
      <CardCarousel destination="Kolkata" />
    </div>
  )
}
