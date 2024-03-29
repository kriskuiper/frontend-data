import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js'
import { select } from 'd3'
import tip from 'd3-tip'

import getCleanData from './lib/get-clean-data'
import renderOptions from './lib/render-options'
import getUniqueReligions from './lib/get-unique-religions'
import transformReligionsForCountry from './lib/transformers/transform-religions-for-country'
import renderBarChart from './lib/charts/bar-chart'
import termmasters from './data/termmasters'

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
		.data(data, d => d.name)
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

	document.getElementById('object-type')
		.addEventListener('change', updateDotsForObjectType)

	document.getElementById('religion')
		.addEventListener('change', (event) => {
			return updateDotsForReligions(event.target.value, data)
		})

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
	}

	function updateMapWithTransition() {
		svg.selectAll('circle')
			.transition()
			.duration(200)
			.attr('cx', d => coords(d).x)
			.attr('cy', d => coords(d).y)
			.attr('r', d => {
				const radius = Math.sqrt(d.results.length)

				return radius * Math.PI
			})
	}

	function coords({ long, lat }) {
		return map.project(new mapboxgl.LngLat(long, lat))
	}

	function showCountryInfo({ name, long, lat, religions }) {
		alterContainerTitle(name)
		renderBarChart(transformReligionsForCountry(religions))

		return map.flyTo({
			center: [long, lat],
			zoom: 4,
			speed: 0.8
		})
	}

	async function updateDotsForObjectType(event) {
		const termmaster = event.target.value
		const updatedData = await getCleanData(termmaster)

		updateDots(updatedData)
		updateMapWithTransition()

		return updatedData
	}

	function updateDotsForReligions(religion, data) {
		const filteredData = data.filter(item => {
			return item.religions[religion]
		})

		updateDots(filteredData)
		updateMapWithTransition()

		return filteredData
	}

	function updateDots(data) {
		const circles = svg.selectAll('circle')
			.data(data, d => d.name)
			.join(
				enter => {
					enter.append('circle')
						.on('click', showCountryInfo)
						.on('mouseover', toolTip.show)
						.on('mouseout', toolTip.hide)
						.on('focus', toolTip.show)
						.on('blur', toolTip.hide)
						.attr('data-key', (d, i) => i)
						.attr('cx', d => coords(d).x)
						.attr('cy', d => coords(d).y)
				},
				update => {
					update.select('circle')
						.attr('r', d => {
							const radius = Math.sqrt(d.results.length)

							return radius * Math.PI
						})
				}
			)

		return circles
	}

})()

function alterContainerTitle(name) {
	const titleNode = document.querySelectorAll('.app-filters__title')[1]

	titleNode.textContent = `De objecten in ${name}, verdeeld per religie`

	return titleNode
}
