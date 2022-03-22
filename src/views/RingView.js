import React from 'react'
import RingTracking from '../components/RingTracking'
import { useLocation } from 'react-router-dom'

const RingView = () => {
    const location = useLocation()
    let { string } = 'GoldRing'
    if(location.state !== null) {
        string = location.state
    } else if (location.state === null) {
        string = 'GoldRing'
    }
  return (
    <RingTracking ring={string}/>
  )
}

export default RingView