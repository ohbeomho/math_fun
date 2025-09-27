// (0, 0)을 중심으로 하는 좌표를 canvas에 그릴 수 있게 변환
export function coordTransform(canvas, x, y) {
	return [canvas.width / 2 + x, canvas.height / 2 - y]
}
