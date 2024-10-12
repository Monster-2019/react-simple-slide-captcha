import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import './index.css'
import IconRightArrow from '../icons/right-arrow.svg?react'
import IconError from '../icons/error.svg?react'
import IconCheckmarkOutline from '../icons/checkmark-outline.svg?react'

interface SlideCaptchaProps {
	onChange: (value: boolean) => void
	width?: number
	height?: number
	defaultLabel?: string
	successLabel?: string
	failLabel?: string
}

export interface SlideCaptchaHandle {
	reset: () => void
}

const SlideCaptcha = forwardRef<SlideCaptchaHandle, SlideCaptchaProps>((props, ref) => {
	const {
		onChange = () => {},
		width = 300,
		height = 48,
		defaultLabel = '请按住滑块，拖动到最右边',
		successLabel = '验证成功',
		failLabel = '验证失败，请重新验证'
	} = props

	useImperativeHandle(ref, () => ({
		reset
	}))

	const [isVerified, setIsVerified] = useState<boolean>(false)
	const [isDragging, setIsDragging] = useState<boolean>(false)
	const [isFail, setIsFail] = useState<boolean>(false)
	const [sliderWidth, setSliderWidth] = useState<number>(height)
	const [offsetX, setOffsetX] = useState<number>(0)
	const [left, setLeft] = useState<number>(0)
	const sliderRef = useRef<HTMLDivElement>(null)
	const containerRef = useRef<HTMLDivElement>(null)
	const [containerStyle, setContainerStyle] = useState<{ width: number; left: number }>({
		width: 0,
		left: 0
	})
	const leftRef = useRef<number | null>()
	const isVerifiedRef = useRef<boolean | null>()

	const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
		if (left != 0) return
		setIsDragging(true)
		if (sliderRef.current) {
			setOffsetX(e.clientX - sliderRef.current.getBoundingClientRect().left)
		}
	}

	const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
		if (!isDragging) return

		let newLeft = event.clientX - containerStyle.left - offsetX

		if (newLeft < 0) {
			setLeft(0)
		} else if (newLeft >= containerStyle.width - sliderWidth) {
			setLeft(containerStyle.width - sliderWidth)
		} else {
			setLeft(newLeft)
		}
	}

	const handleMouseUp = () => {
		if (isDragging) {
			setIsDragging(false)
			handleChange()
		}
	}

	const handleChange = () => {
		if (leftRef.current == containerStyle.width - sliderWidth) {
			setIsVerified(true)
		} else {
			setIsFail(true)
			setIsVerified(false)
			setTimeout(() => {
				setLeft(0)
				setIsFail(false)
			}, 1000)
		}
		onChange(leftRef.current == containerStyle.width - sliderWidth)
	}

	const reset = () => {
		setLeft(0)
		setIsVerified(false)
		onChange(false)
	}

	const initSlide = () => {
		const element = containerRef.current
		if (!element) return

		setSliderWidth(element?.getBoundingClientRect().height)
		setContainerStyle(prev => ({ ...prev, left: element.getBoundingClientRect().left }))

		return element
	}

	useEffect(() => {
		const handleDocumentMouseMove = (e: MouseEvent) => handleMouseMove(e as any)
		const handleDocumentMouseUp = () => handleMouseUp()

		document.addEventListener('mousemove', handleDocumentMouseMove)
		document.addEventListener('mouseup', handleDocumentMouseUp)

		return () => {
			document.removeEventListener('mousemove', handleDocumentMouseMove)
			document.removeEventListener('mouseup', handleDocumentMouseUp)
		}
	}, [isDragging])

	useEffect(() => {
		const element = initSlide()
		const resizeObserver = new ResizeObserver(entries => {
			for (let entry of entries) {
				setContainerStyle(prev => ({ ...prev, width: entry.contentRect.width }))
			}
		})

		resizeObserver.observe(element)

		return () => {
			resizeObserver.unobserve(element)
		}
	}, [])

	useEffect(() => {
		window.addEventListener('resize', initSlide)

		return () => {
			window.removeEventListener('resize', initSlide)
		}
	}, [])

	useEffect(() => {
		leftRef.current = left
	}, [left])

	useEffect(() => {
		isVerifiedRef.current = isVerified
	}, [isVerified])

	return (
		<div
			className={`slide_container relative flex justify-center items-center bg-gray-200`}
			style={{
				width: width !== 0 ? width + 'px' : '100%',
				height: height !== 0 ? height + 'px' : '100%'
			}}
			ref={containerRef}
		>
			<p className="select-none text-sm">{isFail ? failLabel : isVerified ? successLabel : defaultLabel}</p>
			<div
				className={`slide_control h-full absolute top-0 left-0 border border-solid transition-all duration-300
                        ${!isDragging && !isVerified && !isFail ? 'border-white' : ''}
                        ${isDragging ? 'border-blue-400 bg-blue-400 bg-opacity-10 transition-none' : ''}
                        ${isVerified ? 'border-green-400 bg-green-400 bg-opacity-10' : ''}
                        ${isFail ? 'border-red-400 bg-red-400 bg-opacity-10 ' : ''}
                    `}
				style={{ width: left + sliderWidth + 'px' }}
			>
				<div
					className={`slide_thumb h-full flex select-none justify-center cursor-pointer hover:bg-blue-400 items-center absolute top-0 left-0 z-10 transition-all duration-300
                            ${!isDragging && !isVerified && !isFail ? 'bg-white' : ''}
                            ${isDragging ? 'bg-blue-400 transition-none' : ''}
                            ${isVerified ? 'bg-green-400' : ''}
                            ${isFail ? '!bg-red-400' : ''}
                        `}
					onMouseDown={handleMouseDown}
					ref={sliderRef}
					style={{ left: left + 'px', width: sliderWidth + 'px' }}
				>
					{isFail ? <IconError /> : isVerified ? <IconCheckmarkOutline /> : <IconRightArrow />}
				</div>
			</div>
		</div>
	)
})

export default SlideCaptcha
