const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

document
	.getElementById("radius")
	.addEventListener("input", (e) => (C.r = e.target.valueAsNumber));

document
	.getElementById("Px")
	.addEventListener("input", (e) => (P.x = e.target.valueAsNumber));
document
	.getElementById("Py")
	.addEventListener("input", (e) => (P.y = e.target.valueAsNumber));

ctx.textAlign = "center";
ctx.font = "16px monospace";

let P = {
	x: 40,
	y: 40,
};

let C = {
	x: 0,
	y: 0,
	r: 20,
};

function coordTransform(x, y) {
	return { x: canvas.width / 2 + x, y: canvas.height / 2 - y };
}

const drawFuncs = {
	circle: ({ x, y, r }) => {
		const { x: cx, y: cy } = coordTransform(x, y);

		ctx.beginPath();
		ctx.arc(cx, cy, r, 0, 2 * Math.PI);
		ctx.stroke();

		draw("dot", { x, y });

		ctx.fillText(`r=${r}`, cx, cy - r - 10);
	},
	line: ({ x1, y1, x2, y2 }) => {
		const { x: sx, y: sy } = coordTransform(x1, y1);
		const { x: ex, y: ey } = coordTransform(x2, y2);

		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.lineTo(ex, ey);
		ctx.stroke();
	},
	dot: ({ x, y }) => {
		const { x: dx, y: dy } = coordTransform(x, y);

		ctx.beginPath();
		ctx.arc(dx, dy, 2, 0, 2 * Math.PI);
		ctx.fill();
		ctx.fillText(`(${x}, ${y})`, dx, dy - 10);
	},
};

function draw(type, args) {
	const prevColor = ctx.fillStyle,
		prevAlpha = ctx.globalAlpha;
	const { color, alpha } = args;
	if (color) ctx.fillStyle = ctx.strokeStyle = color;
	if (alpha) ctx.globalAlpha = alpha;
	drawFuncs[type](args);
	ctx.fillStyle = ctx.strokeStyle = prevColor;
	ctx.globalAlpha = prevAlpha;
}

function animate() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// y축
	draw("line", {
		x1: 0,
		y1: -canvas.height / 2,
		x2: 0,
		y2: canvas.height / 2,
	});

	// x축
	draw("line", {
		x1: -canvas.width / 2,
		y1: 0,
		x2: canvas.width / 2,
		y2: 0,
	});

	// 한 점(P)을 지나는 접선 2개 구하기

	draw("dot", { ...P });

	const a = Math.pow(C.x - P.x, 2) - Math.pow(C.r, 2),
		b = -2 * (C.x - P.x) * (C.y - P.y),
		c = Math.pow(C.y - P.y, 2) - Math.pow(C.r, 2),
		D = Math.pow(b, 2) - 4 * a * c;
	// 기울기
	const m1 = (-b + Math.sqrt(D)) / (2 * a),
		m2 = (-b - Math.sqrt(D)) / (2 * a);
	// y절편
	const n1 = P.y - m1 * P.x,
		n2 = P.y - m2 * P.x;

	draw("line", {
		x1: -(canvas.width / 2),
		y1: m1 * -(canvas.width / 2) + n1,
		x2: canvas.width / 2,
		y2: m1 * (canvas.width / 2) + n1,
		alpha: 0.5,
	});
	draw("line", {
		x1: -(canvas.width / 2),
		y1: m2 * -(canvas.width / 2) + n2,
		x2: canvas.width / 2,
		y2: m2 * (canvas.width / 2) + n2,
		alpha: 0.5,
	});

	draw("circle", {
		...C,
		color: "red",
	});

	requestAnimationFrame(animate);
}

animate();

canvas.addEventListener(
	"mousemove",
	(e) =>
		(C = {
			...C,
			...coordTransform(e.offsetX - canvas.width, e.offsetY),
		}),
);
