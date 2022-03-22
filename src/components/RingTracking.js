import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { Hands, HAND_CONNECTIONS  } from '@mediapipe/hands';
import HXRC from '../static/logos/HXRC_logo.png'
import HandPicture from '../static/handpicture.png'
import * as THREE from 'three';
import initThreeApp from '../hooks/THREEHooks';
import '../styles/loading.css'
import '../styles/outputCanvas.css'

const RingTracking = ( { ring } ) => {
    
    const string = ring.ring
    const fingerString = ring.fingerSelected
    const [loaded, setLoaded] = useState(false);

    const calculateDistance = (a, ab, b, ba) => {
        const distance = (Math.sqrt(((a - ab) ** 2) + ((b - ba))) / 5 ).toFixed(2);
        return distance
    }

    /*const calculateAngle = (y1, y2, x1, x2) => {
        const y = y2 - y1;
        const x = x2 - x1;

        let angle = Math.atan2(y, x)
        angle *= 180 / Math.PI
        return 5 * Math.round(Math.floor(angle) / 5);
    }*/

    var finger
    var point

    switch(fingerString) {
        case 'Index_PIP':
            finger = 5
            point = 6
            break
        case 'Middle_PIP':
            finger = 9
            point = 10
            break
        case 'Ring_PIP':
            finger = 13
            point = 14
            break
        case 'Pinky_PIP':
            finger = 17
            point = 18
            break
        case 'Thumb_PIP':
            finger = 2
            point = 3
            break
        
        default:
            finger = 5
            point = 6
    }

    useEffect(() => {
        window.addEventListener('resize', () =>{
            window.location.reload(); 
          });

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        var threeCanvasElement = document.getElementsByClassName('three_output')[0]
        const threeApp = initThreeApp(threeCanvasElement, windowWidth, windowHeight, string)

        if(!loaded) {
            threeApp.scene.visible = false;
        }
            const onResults = (results) => {
                
                const canvasElement = document.getElementsByClassName('output_canvas')[0]
                const canvasCtx = canvasElement.getContext('2d')
                const modelTop = threeApp.scene.getObjectByName('RingTop')
                const modelBottom = threeApp.scene.getObjectByName('RingBottom')


                canvasCtx.save();
                canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
                canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);    
                
                if(results.multiHandLandmarks.length > 0) {
                    if(document.querySelector('.handpicture') !== null) {
                        document.querySelector(".handpicture").style.display = 'none'
                        threeApp.scene.visible = true;
                    }
                } else if (results.multiHandLandmarks.length === 0) {
                    if(document.querySelector('.handpicture') !== null) {
                       document.querySelector(".handpicture").style.display = 'block'
                       threeApp.scene.visible = false;
                    }
                }

                if (results.multiHandLandmarks && results.multiHandedness) {
                    for (let index = 0; index < results.multiHandLandmarks.length; index++) {
                        const classification = results.multiHandedness[index];
                        const isRightHand = classification.label === 'Right';
                        const landmarks = results.multiHandLandmarks[index];
                        
                        for(let i = 0; i < landmarks.length; i++) {
                            landmarks[i].visibility = false;
                        }
                        
                        //index finger mcp coordinates.
                        const {x, y, z} = landmarks[5];

                        const a = landmarks[finger].x
                        const b = landmarks[finger].y

                        //middle finger mcp coordinates
                        /*const xx = landmarks[9].x
                        const yy = landmarks[9].y
                        const zz = landmarks[9].z*/

                        //little finger mcp coordinates
                        const ax = landmarks[17].x
                        /*const ay = landmarks[17].y
                        const az = landmarks[17].z*/

                        //index finger pip coordinates
                        const bx = landmarks[point].x
                        const by = landmarks[point].y
                        //const bz = landmarks[6].z

                        let vec = new THREE.Vector3()
                        let pos = new THREE.Vector3()

                        vec.set (
                            a * 2 - 1,
                            -((b + by)/2) * 2 + 1,
                            .5
                        );

                        vec.unproject(threeApp.threeCamera);
                        vec.sub(threeApp.threeCamera.position).normalize();
                        let distance = -threeApp.threeCamera.position.z / vec.z;
                        pos.copy(threeApp.threeCamera.position).add(vec.multiplyScalar(distance));
                        
                        modelTop.position.x = pos.x
                        modelTop.position.y = pos.y

                        modelBottom.position.x = pos.x
                        modelBottom.position.y = pos.y


                        /*if(modelBottom.scale !== (calculateDistance(x, bx, y , by), calculateDistance(x, bx, y , by), calculateDistance(x, bx, y , by))) {
                            modelBottom.scale.set(calculateDistance(x, bx, y , by), calculateDistance(x, bx, y , by), calculateDistance(x, bx, y , by))
                        }
                        if(modelTop.scale !== (calculateDistance(x, bx, y , by), calculateDistance(x, bx, y , by), calculateDistance(x, bx, y , by))) {
                            modelTop.scale.set(calculateDistance(x, bx, y , by), calculateDistance(x, bx, y , by), calculateDistance(x, bx, y , by))
                        }*/
                        

                        modelBottom.lookAt(threeApp.threeCamera.position)
                        modelTop.lookAt(threeApp.threeCamera.position)
                        
                        /*if(modelBottom.rotation.z !== calculateAngle( y, by, x, bx) 
                        && modelBottom.rotation.z !== (calculateAngle(y, by, x, bx) > (calculateAngle(y, by, x, bx) + 10)) 
                        && modelBottom.rotation.z !== (calculateAngle(y, by, x , bx) < (calculateAngle(y, by, x, bx) - 10))) {
                            //modelBottom.lookAt(threeApp.threeCamera.position)
                            modelBottom.rotation.z = (calculateAngle( y, by, x, bx));
                            console.log("jälkeen", modelBottom.rotation.z)
                        }*/

                       
                        
                        if(x < ax && isRightHand) {
                            modelBottom.visible = true
                            modelTop.visible = false
                            if(modelBottom.scale !== (calculateDistance(a, bx, b , by), calculateDistance(a, bx, b , by), calculateDistance(a, bx, b , by))) {
                                modelBottom.scale.set(calculateDistance(a, bx, b , by), calculateDistance(a, bx, b , by), calculateDistance(a, bx, b , by))
                            }

                        } else if (x > ax && isRightHand) {
                            modelTop.visible = true
                            modelBottom.visible = false
                            if(modelTop.scale !== (calculateDistance(a, bx, b , by), calculateDistance(a, bx, b , by), calculateDistance(a, bx, b , by))) {
                                modelTop.scale.set(calculateDistance(a, bx, b , by), calculateDistance(a, bx, b , by), calculateDistance(a, bx, b , by))
                            }
                        }

                        if(x < ax && !isRightHand) {
                            modelBottom.visible = false
                            modelTop.visible = true
                            if(modelTop.scale !== (calculateDistance(a, bx, b , by), calculateDistance(a, bx, b , by), calculateDistance(a, bx, b , by))) {
                                modelTop.scale.set(calculateDistance(a, bx, b , by), calculateDistance(a, bx, b , by), calculateDistance(a, bx, b , by))
                            }

                        } else if(x > ax && !isRightHand) {
                            modelTop.visible = false
                            modelBottom.visible = true
                            if(modelBottom.scale !== (calculateDistance(a, bx, b , by), calculateDistance(a, bx, b , by), calculateDistance(a, bx, b , by))) {
                                modelBottom.scale.set(calculateDistance(a, bx, b , by), calculateDistance(a, bx, b , by), calculateDistance(a, bx, b , by))
                            }
                        }

                        
                        drawConnectors(
                            canvasCtx, landmarks, HAND_CONNECTIONS,
                            {color: isRightHand ? '#FFFFFF' : '#00FFF7'});

                        drawLandmarks(canvasCtx, landmarks, {
                            color: isRightHand ? '#FFFFFF' : '#00FFF7',
                            fillColor: isRightHand ? '#00FFF7' : '#FFFFFF',
                            });
                    }            
                }
                canvasCtx.restore();
            }

        var videoElement = document.getElementsByClassName('input_video')[0]
        videoElement.setAttribute("playsinline", true)

        const hands = new Hands({locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        }});

        hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
        });
        
        hands.onResults(onResults);

        var camera = new Camera (videoElement, {
        onFrame: async () => {
            await hands.send({image: videoElement});
            setLoaded(true)
        },
        facingMode: 'environment',
        width: {ideal: 720},

        });
        
        const run = async () =>{
        threeApp.render()
        requestAnimationFrame(run)
        }
        
        camera.start();
        run();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[string])

    return (
        <>
        <Link className="backButton" to="/">⏮</Link>
        <div className="container">
            <video className="input_video" autoPlay></video>
            <canvas className="output_canvas" width={window.innerWidth} height={window.innerHeight} display={"none"}></canvas>
            <canvas className="three_output" width={window.innerWidth} height={window.innerHeight}></canvas>
            {loaded &&<img className="handpicture" src={HandPicture} alt="handpicture"/>}
        </div>
        {!loaded && <img className="loadingLogo" alt="loadingLogo" src={HXRC}/>}
        </>
        
    )
}

export default RingTracking