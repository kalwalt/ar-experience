import { useEffect, useRef, useState } from 'react';
import CV from './assets/cv.js'
import { delay } from './assets/delay.js'

function App() {

	const sourceVideoRef = useRef()
	const sourceImageRef = useRef()
	const canvasRef = useRef()

	const [ fps, setFps ] = useState(0)

	useEffect(() => {
		function initCanvas (canvasElement){

			const canvas = document.createElement('canvas')
			canvas.width = canvasElement.width
			canvas.height = canvasElement.height
			const ctx = canvas.getContext('2d',  { willReadFrequently: true })

			return (canvasElement) => {
				ctx.drawImage(canvasElement, 0, 0, canvas.width, canvas.height)
				return ctx.getImageData(0, 0, canvas.width, canvas.height)
			}
		}

		async function initCamera(maxVideoWidth, maxVideoHeight){

			const stream = await navigator.mediaDevices.getUserMedia({
				audio: false,
				video: {
					facingMode: 'environment',
					width: maxVideoWidth,
					height: maxVideoHeight,
				},
			})
			
			sourceVideoRef.current.srcObject = stream
			sourceVideoRef.current.play()

			await delay(250)			// Trust me, it's necessary

			return stream
		}

		// Separate function to initialize OpenCV
		async function initCV (){
			const res = await CV.init()

			return res.status
		}

		// Function to upload an image
		async function loadImage(){
			const getImageData = initCanvas(sourceImageRef.current)
			//console.log(sourceImageRef.current);
			const imageData = getImageData(sourceImageRef.current)
			//console.log(imageData);
			const res = await CV.loadSourceImage(imageData)
			return res
		}

		// And then we combine them into one chain
		async function init(){
			const status = await initCV()
			const image = await loadImage()

			return { status, image }
		}
		

		Promise.all([ init(), initCamera(640, 480) ]).then(values => {
			const { image } = values[0]
			console.log(image)

			const getImageData = initCanvas(sourceVideoRef.current)
			
			// We start a loop in which we will simply output
			async function computeImage() {

				const imageData = getImageData(sourceVideoRef.current)
				
				const time = performance.now()
				const resultImageData = await CV.estimateCameraPosition(image.id, imageData)
				setFps(Math.round(1000 / (performance.now() - time)))
				canvasRef.current.width = resultImageData.width
				canvasRef.current.height = resultImageData.height
				const ctx = canvasRef.current.getContext('2d')
				ctx.putImageData(resultImageData, 0, 0)
				
				requestAnimationFrame(computeImage)
			}

			computeImage()
		})

	}, [])

	return (
		<div className="App">
			<div className="fps">{fps} FPS</div>
			<video ref={sourceVideoRef} 
			width="640" 
			height="480" 
			loop
			autoPlay
			muted
			playsInline ></video>
			<canvas ref={canvasRef}></canvas>
			<img src="/images/box.png" alt="original image" style={{display: "none"}} ref={sourceImageRef}/>
		</div>
	);
}

export default App;
