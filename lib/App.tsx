import SlideCaptcha from './components/SlideCaptcha'

function App() {
    const handleChange = (val: boolean) => {
        console.log(val)
    }
    return (
        <div className="w-screen h-screen flex justify-center flex-col items-center bg-gray-400">
            <div className="w-[320px] h-[40px]">
                <SlideCaptcha width={0} height={0} onChange={handleChange}></SlideCaptcha>
            </div>
            <p className="mt-4">测试</p>
        </div>
    )
}

export default App
