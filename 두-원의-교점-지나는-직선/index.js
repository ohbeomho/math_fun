import { coordTransform } from "../coord.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const C1 = { x: 0, y: 0, r: 30 }, C2 = { x: 30, y: 20, r: 20 };

function getCrossingLine(c1, c2) {
	const pow2 = (n) => Math.pow(n, 2);

	// 두 원이 두 점에서 만나지 않음
	if (c1.r + c2.r <= Math.sqrt(pow2(c1.x - c2.x) + pow2(c1.y - c2.y))) return NaN;

	const a = -((2 * (c2.x - c1.x)) / (2 * (c2.y - c1.y))),
		b = (pow2(c2.x) + pow2(c2.y) - pow2(c1.x) - pow2(c1.y) + pow2(c1.r) - pow2(c2.r)) / (2 * (c2.y - c1.y));
	return [a, b];
}

