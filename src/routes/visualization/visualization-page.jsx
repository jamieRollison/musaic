import Navbar from '../../components/navbar/navbar'
import Dial from '../../components/dial/dial'

function VisualizationPage() {
  return (
    // TODO: make a variable of currently selected month
    <>
      <Navbar />
      <div className='vis-grid'>
        <h3 className='font-primary item-year'>2023</h3>
        {/* TODO: Update selected month text */}
        <h3 className='font-primary item-month'>Click on a month!</h3>
        <div className='item-dial'>
          {/* TODO: Make Dial update the month (pass in as ref argument?) */}
          <Dial />
        </div>
        <div className='item-most'>
          {/* TODO: Update top artists/songs based on month selected */}
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