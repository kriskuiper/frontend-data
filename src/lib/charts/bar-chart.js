import { select, scaleLinear, max, axisBottom } from 'd3'
import tip from 'd3-tip'

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
			left: 7
		},
		scaleX: scaleLinear()
			// Actually this has to be the config's width or something, but now it's hardcoded so it works for now
			// have to refactor this in the future though...
			.range([0, 350 - 15])
	}

	return !isRendered
		? renderBarChart(config, data)
		: updateBarChart(config, data)
}

function renderBarChart({ container, width, height, margin, scaleX }, data) {
	const helperText = document.getElementById('helper-text')

	container.removeChild(helperText)
	container.setAttribute('data-rendered', true)

	const barChart = select(container)
		.append('svg')
		.attr('width', width)
		.attr('height', height)
		.attr('class', 'bar-chart')
		.attr('transform', `translate(0, ${margin.top})`)

	barChart.append('g')
		.attr('class', 'bar-chart__x-axis')
		.call(axisBottom(scaleX).ticks(10))

	return updateBarChart({ scaleX, margin }, data)
}

function updateBarChart({ scaleX, margin }, data) {
	const barHeight = 20
	const barSpacing = barHeight + 5
	const colors = ['#7e57c2', '#b085f5', '#d1c4e9', '#512da8', '#9c27b0']
	const toolTip = tip()
		.attr('class', 'bar__tooltip')
		.offset([-4, 0])
		.html(d => `${d.name}: ${d.amount}`)

	scaleX.domain([0, max(data, d => d.amount)])
	select('.bar-chart__x-axis')
		.call(axisBottom(scaleX))

	const updatedBarChart = select('.bar-chart').selectAll('rect')
		// Use Date.now to generate a entirely unique key
		.data(data, d => `${d.name} - ${d.amount}: ${Date.now()}`)
		.join(
			enter => {
				enter.append('rect')
					.call(toolTip)
					.attr('x', margin.left)
					.attr('y', (d, i) => i * barSpacing)
					.attr('width', (d) => scaleX(d.amount))
					.attr('height', barHeight)
					.attr('class', 'bar-chart__bar')
					.style('fill', (d, i) => colors[i])
					.on('mouseover', toolTip.show)
					.on('mouseout', toolTip.hide)
			},
			update => {
				return update.select('rect')
					.attr('width', (d) => scaleX(d.amount))
			},
			exit => exit.remove()
		)

	// Alter x axis position based on the amount of bar charts
	const nthBarNodes = document.getElementsByClassName('bar-chart__bar').length

	select('.bar-chart__x-axis')
		.attr('transform', `translate(${margin.left}, ${(nthBarNodes * barSpacing) + 10})`)

	return updatedBarChart
}
