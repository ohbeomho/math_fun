const pages = [
	'두-원의-교점-지나는-직선',
	'원의-접선',
	'직선과-이차함수-거리',
	'직선의-교점',
	'유형반복R-903번',
]
for (let page of pages) {
	const a = document.createElement('a')
	a.href = `/${page}/`
	a.textContent = page.split('-').join(' ')
	document.body.append(a, document.createElement('br'))
}
