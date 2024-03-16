import Navbar from '../../components/navbar/navbar'

function VisualizationPage() {
  return (
    <>
      <Navbar />
      <div className='vis-grid'>
        <p className='font-primary item-year'>2023</p>
        <p className='font-primary item-month'>Click on a month!</p>
      </div>
    </>
  )
}

export default VisualizationPage