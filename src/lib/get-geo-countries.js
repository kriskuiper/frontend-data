import { csv } from 'd3'

export default function() {
	return new Promise((resolve, reject) => {
		const csvPath = '../../../data/geo-countries.csv'

		return csv(csvPath)
			.then(json => {
				return resolve(formatObjectForCountries(json))
			})
			.catch(error => {
				console.error(error)
				reject(`Could not parse ${csvPath} to json`)
			})
	})
}

function formatObjectForCountries(countries) {
	return countries.reduce((formatted, currentCountry) => {
		formatted[currentCountry.name] = {
			lat: currentCountry.latitude,
			long: currentCountry.longitude
		}

		return formatted
	}, {})
}
