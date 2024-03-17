import Navbar from '../../components/navbar/navbar'
import Dial from '../../components/dial/dial'

function VisualizationPage() {
  return (
    <>
      <Navbar />
      <div className='vis-grid'>
        <h3 className='font-primary item-year'>2023</h3>
        <h3 className='font-primary item-month'>Click on a month!</h3>
        <div className='item-dial'>
          <Dial />
        </div>
        <div className='item-most'>
          <h3>Top Artists:</h3>
          <div className='image-row'>
            <p className='sample'>?</p>
            <p className='sample'>?</p>
            <p className='sample'>?</p>
          </div>
          <h3>Top Songs:</h3>
          <div className='image-row'>
            <p className='sample'>?</p>
            <p className='sample'>?</p>
            <p className='sample'>?</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default VisualizationPage