import { draw } from '../draw.js'

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const circles = [
	{ x: 0, y: 0, r: 60, color: 'red' },
	{ x: 30, y: 20, r: 80, color: 'blue' },
]

function getCrossingLine(c1, c2) {
	const pow2 = (n) => Math.pow(n, 2)
	const centerDist = Math.sqrt(pow2(c1.x - c2.x) + pow2(c1.y - c2.y))

	// 두 원이 두 점에서 만나지 않음
	if (centerDist >= c1.r + c2.r || centerDist <= Math.abs(c1.r - c2.r))
		return [NaN, NaN]

	const a = -((2 * (c2.x - c1.x)) / (2 * (c2.y - c1.y))),
		b =
			(pow2(c2.x) +
				pow2(c2.y) -
				pow2(c1.x) -
				pow2(c1.y) +
				pow2(c1.r) -
				pow2(c2.r)) /
			(2 * (c2.y - c1.y))
	return [a, b]
}

function animate() {
	ctx.clearRect(0, 0, canvas.width, canvas.height)

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
		y1: 0,
		x2: canvas.width / 2,
		y2: 0,
	})

	for (let circle of circles) draw(ctx, 'circle', circle)

	const [a, b] = getCrossingLine(...circles)
	if (a !== NaN)
		draw(ctx, 'line', {
			x1: -canvas.width,
			y1: a * -canvas.width + b,
			x2: canvas.width,
			y2: a * canvas.width + b,
			color: 'green',
		})

	requestAnimationFrame(animate)
}

animate()

canvas.addEventListener('mousemove', (e) => {
	const { offsetX, offsetY } = e
	circles[0].x = offsetX - canvas.width / 2
	circles[0].y = -offsetY + canvas.height / 2
})

document.querySelectorAll('input').forEach((input) => {
	const [idx, prop] = input.dataset.target.split('')
	const c = circles[Number(idx)]
	input.value = c[prop]

	input.addEventListener('input', (e) => {
		c[prop] = input.valueAsNumber
	})
})
