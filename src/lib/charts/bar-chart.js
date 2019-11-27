import { select, scaleLinear, max, axisBottom } from 'd3'

/**
	Thanks to Nicholas H: https://bl.ocks.org/syncopika/f1c9036b0deb058454f825238a95b6be
	You can read all about how I implemented this example in the Wiki: (link to wiki)

	@description The function gets data and renders or updates the barchart based on the 'data-rendered'
	attribute of the barchart container.

	@param {array} data An array of data objects
	@return {object} A D3 object with the updated barchart
*/

export default function(data) {
	const container = document.getElementById('bar-chart-container')
	const isRendered = container.dataset.rendered

	const config = {
		container,
		width: 350,
		height: 350,
		margin: {
			top: 20,
			right: 20,
			bottom: 40,
			left: 20
		},
		scaleX: scaleLinear()
			// Actually this has to be the config's width, but now it's hardcoded so it works for now
			// have to refactor this in the future though...
			.range([0, 350])
	}

	return !isRendered
		? renderBarChart(config, data)
		: updateBarChart(config.scaleX, data)
}

function renderBarChart({ container, width, height, margin, scaleX }, data) {
	const helperText = document.getElementById('helper-text')

	container.removeChild(helperText)
	container.setAttribute('data-rendered', true)

	const barChart = select(container)
		.attr('width', width)
		.attr('height', height)
		.append('svg')
		.attr('class', 'bar-chart')
		.attr('transform', `translate(0, ${margin.top})`)

	const xAxis = axisBottom(scaleX)

	barChart.append('g')
		.attr('class', 'bar-chart__x-axis')
		.attr('transform', `translate(0, ${height})`)
		.call(xAxis)

	return updateBarChart(scaleX, data)
}

function updateBarChart(scaleX, data) {
	scaleX.domain([0, max(data, d => d.amount)])

	const barHeight = 20
	const barSpacing = barHeight + 5

	return select('.bar-chart').selectAll('rect')
		.data(data)
		.join(
			enter => {
				return enter.append('rect')
					.attr('x', 0)
					.attr('y', (d, i) => i * barSpacing)
					.attr('width', (d) => scaleX(d.amount))
					.attr('height', barHeight)
					.attr('class', 'bar-chart__bar')
			},
			update => {
				return update.select('rect')
					.attr('width', (d) => scaleX(d.amount))
			},
			exit => exit.remove()
		)
}
