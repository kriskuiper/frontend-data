export default function(data) {
	const religions = data.map(item => item.religions).flat()

	return religions
		.map(religion => Object.keys(religion))
		.flat()
		.filter((item, index, self) => {
			return self.indexOf(item) === index
		})
		.map(religionKey => generateDefaultObject(religionKey, religionKey))
}

function generateDefaultObject(name, value) {
	return { name, value }
}
