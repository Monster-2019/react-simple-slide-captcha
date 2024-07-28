import SlideCaptcha from './components/SlideCaptcha'

function App() {
    const handleChange = (val: boolean) => {
        console.log(val)
    }
    return (
        <div>
            <p>测试</p>
            <SlideCaptcha onChange={handleChange}></SlideCaptcha>
        </div>
    )
}

export default App
