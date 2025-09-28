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

// 점 p를 지나고 직선 l과 수직인 직선 구하기
function getSuzikLine(l, p) {
	const { m } = l
	const { x, y } = p
	return { m: -1 / m, n: y - (-1 / m) * x }
}

// 두 직선 l1, l2의 교점 구하기
function getIntersection(l1, l2) {
	const mdiff = l1.m - l2.m,
		ndiff = l1.n - l2.n
	const x = -(ndiff / mdiff),
		y = l1.m * x + l1.n

	return [x, y]
}

function update() {
	const [distance, k] = getDistance(quad_func, line)

	distanceDisplay.textContent = distance

	ctx.clearRect(0, 0, canvas.width, canvas.height)

	// x축, y축
	draw(ctx, 'line', {
		x1: 0,
		y1: -canvas.height,
		x2: 0,
		y2: canvas.height,
		alpha: 0.5,
	})
	draw(ctx, 'line', {
		x1: -canvas.width,
		y1: 0,
		x2: canvas.width,
		y2: 0,
		alpha: 0.5,
	})

	// 직선
	drawLine(line)
	drawLine({ m: line.m, n: k, color: 'blue' })

	// 이차함수 그래프
	drawQuadFuncGraph(quad_func)

	// y = mx + k 와 y = f(x) 의 교점
	const { a, p } = quad_func
	const x1 = (2 * a * p + line.m) / 2,
		y1 = line.m * x1 + k

	// 그 교점을 지나는 y = mx + k 와 수직인 직선과 y = mx + n 의 교점
	const suzikLine = getSuzikLine(line, { x: x1, y: y1 })
	const [x2, y2] = getIntersection(suzikLine, line)

	// 위 두 점을 이은 선분
	draw(ctx, 'line', { x1, y1, x2, y2, color: 'green' })
}

update()
