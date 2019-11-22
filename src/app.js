import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js'
import { select } from 'd3'

import getCleanData from './lib/get-clean-data'

// Have to use an iife here because we can't use await without async
(async () => {
	mapboxgl.accessToken = 'pk.eyJ1Ijoia3Jpc2t1aXBlciIsImEiOiJjazM3NDltbGUwODJrM2RsaTJlZXk5OXJyIn0.L2lL-Iwyb9Nfip_C9G3v2w'

	const map = new mapboxgl.Map({
		container: 'map',
		style: 'mapbox://styles/mapbox/streets-v9',
	})
	const container = map.getCanvasContainer()
	const svg = select(container)
		.append('svg')
		.append('g')
	const data = await getCleanData()

	svg
		.selectAll('circle')
		.data(data)
		.enter()
		.append('circle')
		.attr('cx', d => coords(d).x)
		.attr('cy', d => coords(d).y)

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
			.attr('r', '4')
			.attr('fill', 'red')
			.attr('data-country', d => d.name)
	}

	function coords({ long, lat }) {
		return map.project(new mapboxgl.LngLat(long, lat))
	}
})()
