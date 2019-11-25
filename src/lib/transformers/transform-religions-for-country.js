export default function(religions) {
	return Object.entries(religions)
		.map(([key, value]) => {
			return { name: key, amount: value }
		})
}
