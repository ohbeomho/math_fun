import { coordTransform } from '../coord.js'

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

ctx.font = '16px monospace'
ctx.textAlign = 'center'

// 직선
const lines = [
	{ a: 1, b: 0, color: 'red' },
	{ a: 3, b: -60, color: 'blue' },
]

function getIntersection(l1, l2) {
	const adiff = l1.a - l2.a,
		bdiff = l1.b - l2.b
	const x = -(bdiff / adiff),
		y = l1.a * x + l1.b

	return [x, y]
}

function drawLine(a, b, color) {
	const sx = -canvas.width / 2,
		ex = canvas.width / 2
	const sy = a * sx + b,
		ey = a * ex + b

	const prevColor = ctx.strokeStyle
	if (color) ctx.strokeStyle = color
	ctx.beginPath()
	ctx.moveTo(...coordTransform(canvas, sx, sy))
	ctx.lineTo(...coordTransform(canvas, ex, ey))
	ctx.stroke()
	ctx.strokeStyle = prevColor
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height)

	ctx.globalAlpha = 0.4
	// x축
	drawLine(0, 0)
	// y축
	ctx.beginPath()
	ctx.moveTo(canvas.width / 2, 0)
	ctx.lineTo(canvas.width / 2, canvas.height)
	ctx.stroke()
	ctx.globalAlpha = 1

	// 직선 그리기
	for (let line of Object.values(lines)) drawLine(line.a, line.b, line.color)

	// 교점 표시
	const [x, y] = getIntersection(...lines)
	ctx.beginPath()
	ctx.arc(...coordTransform(canvas, x, y), 2, 0, 2 * Math.PI)
	ctx.fill()

	ctx.fillText(`(${x}, ${y})`, ...coordTransform(canvas, x, y + 10))
}

const inputs = Array.from(document.querySelectorAll('input'))
for (let input of inputs) {
	const [line, target] = input.dataset.target.split('')
	input.value = String(lines[line][target])

	input.addEventListener('input', () => {
		lines[line][target] = input.valueAsNumber
		draw()
	})
}

draw()
