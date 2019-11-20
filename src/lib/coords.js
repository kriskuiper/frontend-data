import mapboxgl from 'mapbox-gl/dist/mapbox-gl'

export default function({ lat, long }) {
	return map.project(new mapboxgl.LngLat(lat, long))
}
