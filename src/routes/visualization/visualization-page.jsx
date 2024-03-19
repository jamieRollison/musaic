import Navbar from '../../components/navbar/navbar'
import Dial from '../../components/dial/dial'
import React from 'react'

function VisualizationPage() {
  const monthValues = [
    "Click on a month!",
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December", 
  ]
  const [month, setMonth] = React.useState(0)
  const handleMonth = React.useCallback(
    (nextMonth) => {
      if (! (1 <= nextMonth && nextMonth <= 12)) { return }
      setMonth(nextMonth)
    }
  , [])

  return (
    <>
      <Navbar />
      <div className='vis-grid'>
        <h3 className='font-primary item-year'>2023</h3>
        <h3 className='font-primary item-month'>{monthValues[month]}</h3>
        <div className='item-dial'>
          <Dial curMonth={month} changeMonth={handleMonth}/>
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