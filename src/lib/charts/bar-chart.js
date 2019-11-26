import { select, scaleLinear, max, axisBottom } from 'd3'

export default function(data) {
	const isRendered = document.getElementById('bar-chart-container').dataset.rendered
	const barChartConfig = {
		width: 350,
		height: 350,
		padding: 20,
		scale: calculateXScale({ padding: 20, width: 350 }, data),
		ticks: 10,
	}

	return !isRendered
		? renderInitialBarChart(barChartConfig, data)
		: updateBarChart(barChartConfig, data)
}

function renderInitialBarChart(config, data) {
	const helperText = document.getElementById('helper-text')
	const barChartContainer = document.getElementById('bar-chart-container')
	const svg = select(barChartContainer)
		.append('svg')
		.attr('width', config.width)
		.attr('height', config.height)

	config = {...config, svg}

	// Set data-rendered as attribute to filters
	barChartContainer.setAttribute('data-rendered', true)

	// Remove the helper text
	barChartContainer.removeChild(helperText)

	// Create the bar chart
	addHorizontalAxis(config)
	addBars(config, data)
}

function updateBarChart({ width, height }, data) {
	console.log('updated')
}

function calculateXScale({ padding, width }, data) {
	console.log(padding)

	return scaleLinear()
		.domain([0, max(data, d => {
			console.log('Data: ', d)
			return d.amount
		})])
		.range([padding, width - padding])
		.nice()
}

function addHorizontalAxis({ svg, scale, height, padding, ticks }) {
	const horizontalAxis = axisBottom(scale).ticks(ticks)

	return svg.append('g')
		.attr('transform', `translate(0, ${height - padding})`)
		.attr('class', 'bar-chart__x-axis')
		.call(horizontalAxis)
		.call(g => g.select('.domain').remove())
}

function addBars({ svg, scale, padding }, data) {
	const barHeight = 40
	const barSpacing = barHeight + 5

	return svg.selectAll('rect')
		.data(data)
		.enter()
		.append('rect')
		.attr('x', 0)
		.attr('y', (d, i) => i * barSpacing)
		.attr('width', (d) => scale(d.amount))
		.attr('height', barHeight)
		.attr('class', 'bar-chart__bar')
}
