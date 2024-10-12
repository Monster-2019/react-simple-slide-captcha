import { useRef } from 'react'
import SlideCaptcha from './components/SlideCaptcha'

function App() {
	const slideCaptchaRef = useRef<SlideCaptchaHandle>()
	const handleChange = (val: boolean) => {
		console.log(val)
	}
	const handleReset = () => {
		if (slideCaptchaRef.current) slideCaptchaRef.current.reset()
	}
	return (
		<div className="w-screen h-screen flex justify-center flex-col items-center bg-gray-400">
			<div className="w-[320px] h-[40px]">
				<SlideCaptcha width={0} height={0} onChange={handleChange} ref={slideCaptchaRef}></SlideCaptcha>
			</div>
			<button className="px-5 py-3 text-white bg-blue-400 rounded-md mt-4" onClick={handleReset}>
				重置
			</button>
		</div>
	)
}

export default App
