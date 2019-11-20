import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js'

export default function(map, data, container) {
	const svg = container
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
	}

	function coords({ lat, long }) {
		return map.project(new mapboxgl.LngLat(lat, long))
	}
}
