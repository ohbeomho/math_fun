const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

// 직선
const lines = [
	{ a: 1, b: 0, color: "red" },
	{ a: 3, b: -60, color: "blue" },
];

// 가운데 (0, 0)
function coordTransform(x, y) {
	return [canvas.width / 2 + x, canvas.height / 2 - y];
}

// TODO: 두 직선의 교점 구하고 화면에 표시

function drawLine(a, b, color) {
	const sx = -canvas.width / 2,
		ex = canvas.width / 2;
	const sy = a * sx + b,
		ey = a * ex + b;

	const prevColor = ctx.strokeStyle;
	if (color) ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.moveTo(...coordTransform(sx, sy));
	ctx.lineTo(...coordTransform(ex, ey));
	ctx.stroke();
	ctx.strokeStyle = prevColor;
}

function drawLines() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.globalAlpha = 0.4;
	// x축
	drawLine(0, 0);
	// y축
	ctx.beginPath();
	ctx.moveTo(canvas.width / 2, 0);
	ctx.lineTo(canvas.width / 2, canvas.height);
	ctx.stroke();
	ctx.globalAlpha = 1;

	// 직선 그리기
	for (let line of Object.values(lines)) drawLine(line.a, line.b, line.color);
}

const inputs = Array.from(document.querySelectorAll("input"));
for (let input of inputs) {
	const [line, target] = input.dataset.target.split("");
	input.value = String(lines[line][target]);

	input.addEventListener("input", () => {
		lines[line][target] = input.valueAsNumber;
		drawLines();
	});
}

drawLines();
