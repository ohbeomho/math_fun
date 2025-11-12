import { coordTransform } from '../coord.js'
import { draw } from '../draw.js'

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const maxX = 25,
	minX = -25
const yOffset = -120

let mouseX = 0

// x² - 2x + 6
function f(x) {
	return x * x - 2 * x + 6
}

// -|x - t| + 11
function g(x) {
	const t = (mouseX - canvas.width / 2) / zoom
	return -Math.abs(x - t) + 11
}

// f(x), g(x) 중 함숫값이 더 작은 함수 사용
function h(x) {
	const y1 = f(x),
		y2 = g(x)
	return y1 < y2 ? y1 : y2
}

const functions = [f, g, h]
const colors = ['red', 'blue', 'black']
const opacity = [0.4, 0.4, 1]
const lineWidth = [1, 1, 1.5]
const zoom = 20

function animate() {
	ctx.clearRect(0, 0, canvas.width, canvas.height)

	ctx.globalAlpha = 0.5
	// y축
	draw(ctx, 'line', {
		x1: 0,
		y1: -canvas.height / 2,
		x2: 0,
		y2: canvas.height / 2,
	})
	// x축
	draw(ctx, 'line', {
		x1: -canvas.width / 2,
		y1: yOffset,
		x2: canvas.width / 2,
		y2: yOffset,
	})
	ctx.globalAlpha = 1

	for (let i = 0; i < 3; i++) {
		ctx.strokeStyle = colors[i]
		ctx.globalAlpha = opacity[i]
		ctx.lineWidth = lineWidth[i]

		const func = functions[i]

		const prev = { x: minX, y: func(minX) }
		for (let x = minX + 0.1; x <= maxX; x += 0.1) {
			const y = func(x)

			const [prevX, prevY] = coordTransform(
				canvas,
				prev.x * zoom,
				prev.y * zoom + yOffset,
			)
			const [tx, ty] = coordTransform(
				canvas,
				x * zoom,
				y * zoom + yOffset,
			)

			ctx.beginPath()
			ctx.moveTo(prevX, prevY)
			ctx.lineTo(tx, ty)
			ctx.stroke()

			prev.x = x
			prev.y = y
		}
	}
	ctx.strokeStyle = 'black'
	ctx.lineWidth = 1

	requestAnimationFrame(animate)
}

animate()

canvas.addEventListener('mousemove', (e) => (mouseX = e.offsetX))
