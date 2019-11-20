import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js'
import { select } from 'd3'

import getCleanData from './lib/get-clean-data'
import generateDots from './lib/generate-dots'

// Have to use an iife here because we can't use await without async
(async () => {
	mapboxgl.accessToken = 'pk.eyJ1Ijoia3Jpc2t1aXBlciIsImEiOiJjazM3NDltbGUwODJrM2RsaTJlZXk5OXJyIn0.L2lL-Iwyb9Nfip_C9G3v2w'

	const map = new mapboxgl.Map({
		container: 'map',
		style: 'mapbox://styles/mapbox/streets-v9',
	})
	const container = map.getCanvasContainer()
	const svg = select(container).append('g')
	const data = await getCleanData()

	generateDots(map, data, svg)
})()
