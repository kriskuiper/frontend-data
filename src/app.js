import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js'
import { select, scaleLinear, max, axisBottom } from 'd3'
import tip from 'd3-tip'

import getCleanData from './lib/get-clean-data'
import renderOptions from './lib/render-options'
import getUniqueReligions from './lib/get-unique-religions'
import transformReligionsForCountry from './lib/transformers/transform-religions-for-country'
import termmasters from '../data/termmasters'

// Have to use an iife here because we can't use await without async
(async () => {
	mapboxgl.accessToken = 'pk.eyJ1Ijoia3Jpc2t1aXBlciIsImEiOiJjazM3NDltbGUwODJrM2RsaTJlZXk5OXJyIn0.L2lL-Iwyb9Nfip_C9G3v2w'

	const map = new mapboxgl.Map({
		container: 'map',
		style: 'mapbox://styles/kriskuiper/ck3e932ds01541cpt9qg6zxac',
		zoom: 3,
		minZoom: 3,
		maxZoom: 10,
		pitch: 30
	})
	const container = map.getCanvasContainer()
	const svg = select(container)
		.append('svg')
		.attr('class', 'map-container')
		.append('g')
	const toolTip = tip()
		.attr('class', 'circle__tooltip')
		.offset([-8, 0])
		.html(d => `${d.name}: ${d.results.length} objects`)
	const data = await getCleanData()
	const uniqueReligions = getUniqueReligions(data)

	svg.call(toolTip)
	svg
		.selectAll('circle')
		.data(data)
		.enter()
		.append('circle')
		.on('click', showCountryInfo)
		.on('mouseover', toolTip.show)
		.on('mouseout', toolTip.hide)
		.on('focus', toolTip.show)
		.on('blur', toolTip.hide)
		.attr('cx', d => coords(d).x)
		.attr('cy', d => coords(d).y)
		.attr('tabindex', '1')

	renderOptions('object-type', termmasters)
	renderOptions('religion', uniqueReligions)

	update()

	map
		.on('viewreset', () => update())
		.on('move', () => update())
		.on('moveend', () => update())
		.on('zoom', () => update())

	function update() {
		svg.selectAll('circle')
			.attr('cx', d => coords(d).x)
			.attr('cy', d => coords(d).y)
			.attr('r', d => {
				const radius = Math.sqrt(d.results.length)

				return radius * Math.PI
			})
			.attr('data-country', d => d.name)
	}

	function coords({ long, lat }) {
		return map.project(new mapboxgl.LngLat(long, lat))
	}

	function showCountryInfo({ long, lat, religions }) {
		renderBarChart(transformReligionsForCountry(religions))

		return map.flyTo({
			center: [long, lat],
			zoom: 4,
			speed: 0.8
		})
	}

	function renderBarChart(data) {
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
		// addLabelsToBars(config, data)
		addHorizontalAxis(config)
		addBars(config, data)
	}

	function updateBarChart({ width, height }, data) {
		console.log('updated')
	}
})()

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
