import categories from './lib/categories'
import getCleanData from './lib/get-clean-data'
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js'

// Have to use an iife here because we can't use await without async
(async () => {
	mapboxgl.accessToken = 'pk.eyJ1Ijoia3Jpc2t1aXBlciIsImEiOiJjazM3NDltbGUwODJrM2RsaTJlZXk5OXJyIn0.L2lL-Iwyb9Nfip_C9G3v2w'

	const map = new mapboxgl.Map({
		container: 'map',
		style: 'mapbox://styles/mapbox/light-v9',
	})

	const data = await getCleanData(categories['kleding'])
	console.log(data)
})()
