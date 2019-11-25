export default function(selectId, data) {
	const select = document.getElementById(selectId)

	data.forEach(item => {
		const option = new Option(item.name, item.value)

		select.add(option)
	})

	return select
}
