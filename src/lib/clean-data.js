import getGeoCountries from './get-geo-countries'

export default async function(data) {
	const coords = await getGeoCountries()

	return data
		.map(item => {
			return {
				title: item.title && item.title.value,
				religion: item.religionLabel && item.religionLabel.value,
				country: item.countryLabel && item.countryLabel.value,
				coords: item.countryLabel && coords[item.countryLabel.value]
			}
		})
		.reduce((countries, currentItem) => {
			// Get the country and religion of the currentItem
			const countryName = currentItem.country
			const religion = currentItem.religion
			const defaultCountry = generateDefaultCountry(currentItem)
			const foundCountry = find(countries, countryName)
			const foundReligion = foundCountry && foundCountry.religions[currentItem.religion]

			defaultCountry.religions[currentItem.religion] = 1

			// Check if a country in countries has the same name as the currentItem's country,
			// if not, add defaultCountry to countries
			if (!foundCountry) {
				countries.push(defaultCountry)
			} else {

				if (foundReligion) {
					foundCountry.religions[religion] = foundCountry.religions[religion] + 1
				} else {
					foundCountry.religions[religion] = 1
				}

				foundCountry.results.push(currentItem)
			}

			return countries
		}, [])
}

function find(array, key) {
	return array.find(item => item.name === key)
}

function generateDefaultCountry(item) {
	return {
		name: item.country,
		lat: Number(item.coords.lat),
		long: Number(item.coords.long),
		results: [item],
		religions: {}
	}
}

/*
	output: [{
		name: Thailand,
		results: [],
		religions: { christelijk: 1 }
	}]
*/
