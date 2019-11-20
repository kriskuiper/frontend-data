export default function(data) {
	return data
		.map(item => ({
			title: item.title && item.title.value,
			religion: item.religionLabel && item.religionLabel.value,
			country: item.countryLabel && item.countryLabel.value,
			lat: item.lat && item.lat.value,
			long: item.long && item.long.value
		}))
}
