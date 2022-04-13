import React, { useEffect, useState } from 'react';
/*import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { Hands, HAND_CONNECTIONS  } from '@mediapipe/hands';*/
import HXRC from '../static/logos/HXRC_logo.png'
/*import HandPicture from '../static/handpicture.png'
import * as THREE from 'three';*/
import { FBXLoader } from 'three-stdlib';
import SilverRing from '../static/models/SilverRing.fbx'
import TiffanyRing from '../static/models/TiffanyRing.fbx'
import GoldRing from '../static/models/GoldRing.fbx'
import DetailedRing from '../static/models/DetailedRing.fbx'
import initThreeApp from '../hooks/THREEHooks';
import '../styles/loading.css'
import '../styles/menuContainer.css'
import { Link } from 'react-router-dom';

const HandComponent = () => {

    const [loaded, setLoaded] = useState(false)
    const [fingerSelected, setFinger] = useState("")
    const [ringInScene, setRing] = useState()
    const [bone, setBone] = useState()
    const [ringSelected, setSelectedRing] = useState()
    const [ringString, setRingString] = useState("")

    const [app, setApp] = useState()

    const addRingToFinger = (threeApp, string, model) => {
      if(bone !== undefined) {
        bone.remove(ringInScene)
      }
      
      console.log("Selected Finger: ", string)
      const hand = threeApp.scene.getObjectByName('Hand')
    
      const loader = new FBXLoader()
      
      loader.load(model, (object)=> {
        object.name = "Ring"
        object.scale.set(.3,.3,.3)
        if(string === "Thumb_TIP") {
          object.rotation.y = -8
        }
        hand.children[1].skeleton.getBoneByName(string).add(object)
        setRing(object)
        setBone(hand.children[1].skeleton.getBoneByName(string))
      })
    }

    const menuAction = () => {
      const menu = document.getElementsByClassName('fingerMenu')[0]
      const arrow = document.getElementsByClassName('menuArrow')[0]

      if (menu.style.display === 'none') {
        menu.style.display = 'flex'
        arrow.style.transform = 'rotate(0deg)'
      } else  {
        menu.style.display = 'none'
        arrow.style.transform = 'rotate(180deg)'
      }
    }

    const upDateRing = ( RING ) => {
      if(ringInScene !== ringSelected) {
        console.log(fingerSelected, ringSelected)
        addRingToFinger(app, fingerSelected, RING)
      } else {
        console.log("same ring in scene already")
      }
    }
 
    useEffect(()=> {
      window.addEventListener('resize', () =>{
        window.location.reload(); 
      });

      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight

        var threeCanvasElement = document.getElementsByClassName('three')[0]
        const threeApp = initThreeApp(threeCanvasElement, windowWidth, windowHeight, 'hand')
        setApp(threeApp)  

        const run = () => {
            setLoaded(true)
            threeApp.render()
            requestAnimationFrame(run)
        }
        run()

    },[])


  return (
    <>
    { ringSelected !== undefined && 
    <div className="menuContainer">
     <div className="menuArrow" onClick={() => menuAction()}>
          ᐅ
     </div>
      <div className="fingerMenu">
        <div className="fingerButton" onClick={() => {setFinger("Index_PIP"); addRingToFinger(app, 'Index_PIP', ringSelected)}}>
          Index finger
        </div>
        <div className="fingerButton" onClick={() => {setFinger("Middle_PIP"); addRingToFinger(app, 'Middle_PIP', ringSelected)}}>
          Middle finger
        </div>
        <div className="fingerButton" onClick={() => {setFinger("Ring_PIP"); addRingToFinger(app, 'Ring_PIP', ringSelected)}}>
          Ring finger
        </div>
        <div className="fingerButton" onClick={() => {setFinger("Pinky_PIP"); addRingToFinger(app, 'Pinky_PIP', ringSelected)}}>
          Pinky
        </div>
        <div className="fingerButton" onClick={() => {setFinger("Thumb_TIP"); addRingToFinger(app, 'Thumb_TIP', ringSelected)}}>
          Thumb
        </div>
        {ringInScene !== undefined && <div className="fingerButton" onClick={() => setSelectedRing()}>
          Change Ring
          </div>
          }
      </div>
    </div> }
    { ringSelected === undefined && <div className="ringMenu">
      <div className="ring" onClick={() => {setSelectedRing(GoldRing); setRingString("GoldRing"); upDateRing(GoldRing)}}>
          Gold Ring
      </div>
      <div className="ring" onClick={() => {setSelectedRing(SilverRing); setRingString("SilverRing"); upDateRing(SilverRing)}}>
          Silver Ring
      </div>
      <div className="ring" onClick={() => {setSelectedRing(TiffanyRing); setRingString("TiffanyRing"); upDateRing(TiffanyRing)}}>
          Tiffany Ring
      </div>
      <div className="ring" onClick={() => {setSelectedRing(DetailedRing); setRingString("DetailedRing"); upDateRing(DetailedRing)}}>
          Elven Ring
      </div>
    </div>}
    <div className="container">
        <canvas className="three" width={window.innerWidth} height={window.innerHeight} cursor="grab"></canvas>
    </div>
    {!loaded && <img className="loadingLogo" alt="loadingLogo" src={HXRC}/>}
    {ringString.length > 2 && <Link to="/AR" state={{ ring: ringString, fingerSelected }} className="ARButton">
      AR
      </Link>}
    </>
    
  )
}

export default HandComponent