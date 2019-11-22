import { csv } from 'd3'

export default function() {
	return new Promise((resolve, reject) => {
		const csvPath = '../../../data/geo-countries.csv'

		return csv(csvPath)
			.then(resolve)
			.catch(error => {
				console.error(error)
				reject(`Could not parse ${csvPath} to json`)
			})
	})
}
