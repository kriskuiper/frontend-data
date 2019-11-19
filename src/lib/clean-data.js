import formatYearForResult from './formatters/format-year-for-result'
import formatRangeForResult from './formatters/format-range-for-result'

export default function(data) {
	return data
		.map(item => ({
			title: item.title && item.title.value,
			year: item.year && formatYearForResult(item.year.value),
			religion: item.religionLabel && item.religionLabel.value,
			country: item.countryLabel && item.countryLabel.value,
			lat: item.lat && item.lat.value,
			long: item.long && item.long.value
		}))
		.filter(item => !isNaN(item.year))
		.map(item => ({
			...item,
			range: formatRangeForResult(item.year)
		}))
}

