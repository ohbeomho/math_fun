import { coordTransform } from "./coord.js";

const drawFuncs = {
	circle: (ctx, { x, y, r }) => {
		const [cx, cy] = coordTransform(ctx.canvas, x, y);

		ctx.beginPath();
		ctx.arc(cx, cy, r, 0, 2 * Math.PI);
		ctx.stroke();

		draw(ctx, "dot", { x, y });

		ctx.fillText(`r=${r}`, cx, cy - r - 10);
	},
	line: (ctx, { x1, y1, x2, y2 }) => {
		const [sx, sy] = coordTransform(ctx.canvas, x1, y1);
		const [ex, ey] = coordTransform(ctx.canvas, x2, y2);

		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.lineTo(ex, ey);
		ctx.stroke();
	},
	dot: (ctx, { x, y }) => {
		const [dx, dy] = coordTransform(ctx.canvas, x, y);

		ctx.beginPath();
		ctx.arc(dx, dy, 2, 0, 2 * Math.PI);
		ctx.fill();
		ctx.fillText(`(${x}, ${y})`, dx, dy - 10);
	},
};

export function draw(ctx, type, args) {
	const prevColor = ctx.fillStyle,
		prevAlpha = ctx.globalAlpha;
	ctx.textAlign = "center";
	ctx.font = "16px monospace";
	const { color, alpha } = args;
	if (color) ctx.fillStyle = ctx.strokeStyle = color;
	if (alpha) ctx.globalAlpha = alpha;
	drawFuncs[type](ctx, args);
	ctx.fillStyle = ctx.strokeStyle = prevColor;
	ctx.globalAlpha = prevAlpha;
}
