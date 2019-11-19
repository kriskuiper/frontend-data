export default function(year) {
	const min = getRangeMin(year)
	const max = getRangeMax(year)

	if (year < min) {
		return formatRangeFromMax(year)
	}

	return formatRange(min, max)
}

function getRangeMin(num) {
	return (Math.floor(num / 100) * 100) + 1
}

function getRangeMax(num) {
	return Math.ceil(num / 100) * 100
}

function getRangeMinFromMax(max) {
	return max - 99
}

function formatRange(min, max) {
	return `${min} - ${max}`
}

function formatRangeFromMax(max) {
	return formatRange(getRangeMinFromMax(max), max)
}
