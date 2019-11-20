import query from './query'
import formatEncodedEndpoint from './formatters/format-encoded-endpoint'
import cleanData from './clean-data'
import Try from './functional-helpers/try'

export default function(termmaster) {
	return Try(async () => {
		const endpoint = formatEncodedEndpoint(query(termmaster))
		const response = await fetch(endpoint)
		const data = await response.json()

		return cleanData(data.results.bindings)
	})
}
