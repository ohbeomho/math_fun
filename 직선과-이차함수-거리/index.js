import { draw } from '../draw.js'

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const distanceDisplay = document.querySelector('.dist')

// https://www.mathcha.io/editor/8EGjoCWQUxztppN4mPuB2PrPVhl0GrQEhZ52Ykz
const quad_func = { a: 1, p: 30, q: 20 }
const line = { m: -2, n: -40 }

const pow2 = (x) => Math.pow(x, 2)

function getDistance(f, l) {
	const { a, p, q } = f,
		{ m, n } = l

	if (pow2(2 * a * p + m) - 4 * a * (a * pow2(p) + q - n) >= 0) return [0, 0]

	const k = a * pow2(p) + q - pow2(2 * a * p + m) / (4 * a),
		distance = Math.abs(k - n) / Math.sqrt(pow2(m) + 1)

	return [distance, k]
}

function drawLine({ m, n, color }) {
	draw(ctx, 'line', {
		x1: -canvas.width,
		y1: m * -canvas.width + n,
		x2: canvas.width,
		y2: m * canvas.width + n,
		color,
	})
}

function drawQuadFuncGraph({ a, p, q }) {
	const getY = (x) => a * pow2(x - p) + q
	let prevY = getY(-canvas.width / 2)
	for (let x = -canvas.width / 2 + 1; x <= canvas.width / 2; x++) {
		const y = getY(x)
		draw(ctx, 'line', { x1: x - 1, y1: prevY, x2: x, y2: y, color: 'red' })
		prevY = y
	}
}

function update() {
	const [distance, k] = getDistance(quad_func, line)

	distanceDisplay.textContent = distance

	ctx.clearRect(0, 0, canvas.width, canvas.height)

	// x축, y축
	draw(ctx, 'line', { x1: 0, y1: -canvas.height, x2: 0, y2: canvas.height })
	draw(ctx, 'line', { x1: -canvas.width, y1: 0, x2: canvas.width, y2: 0 })

	// 직선
	drawLine(line)
	drawLine({ m: line.m, n: k, color: 'blue' })

	// 이차함수 그래프
	drawQuadFuncGraph(quad_func)

	// y = mx + k 와 y = f(x) 의 교점
	const { a, p, q } = quad_func
	const x = (2 * a * p + line.m) / 2,
		y = line.m * x + k
	draw(ctx, 'dot', { x, y })

	// TODO: y = mx + k 와 y = mx + n 의 거리를 선분으로 표시하기
}

update()
