export default function(termmaster) {
	const useTermmaster = termmaster
		? `
		<${termmaster}> skos:narrower* ?type .
		?cho edm:isRelatedTo ?type .
		`
		: ''

	return `
		PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
		PREFIX dc: <http://purl.org/dc/elements/1.1/>
		PREFIX dct: <http://purl.org/dc/terms/>
		PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
		PREFIX edm: <http://www.europeana.eu/schemas/edm/>
		PREFIX foaf: <http://xmlns.com/foaf/0.1/>
		PREFIX gn: <http://www.geonames.org/ontology#>
		PREFIX wgs84: <http://www.w3.org/2003/01/geo/wgs84_pos#>
		SELECT ?title ?objectLabel ?religionLabel ?countryLabel ?lat ?long WHERE {
			<https://hdl.handle.net/20.500.11840/termmaster2874> skos:narrower ?religion .
			?religion skos:prefLabel ?religionLabel .
			?cho dc:subject ?religion .
			?cho dc:title ?title .
			FILTER langMatches(lang(?title), "ned") .

			${useTermmaster}

			?cho edm:object ?object .
			?object skos:prefLabel ?objectLabel .
			?cho dct:spatial ?place .
			?place skos:exactMatch/gn:parentCountry ?country .
			?country wgs84:lat ?lat .
			?country wgs84:long ?long .
			?country gn:name ?countryLabel .
		}
	`
}
