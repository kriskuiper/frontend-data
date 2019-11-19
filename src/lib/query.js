export default `
	PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
	PREFIX dc: <http://purl.org/dc/elements/1.1/>
	PREFIX dct: <http://purl.org/dc/terms/>
	PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
	PREFIX edm: <http://www.europeana.eu/schemas/edm/>
	PREFIX foaf: <http://xmlns.com/foaf/0.1/>
	PREFIX gn: <http://www.geonames.org/ontology#>
	PREFIX wgs84: <http://www.w3.org/2003/01/geo/wgs84_pos#>

	SELECT ?title ?religion ?religionLabel ?year ?country ?countryLabel ?lat ?long WHERE {
		VALUES ?religionLabel {
			"islamitisch"
			"christelijk"
			"Afro-Amerikaanse religies"
			"joods (religie)"
			"boeddhistisch"
			"hindoeïstisch"
			"jaïn"
			"shintoïstisch"
			"sikhistisch"
			"taoïstisch"
			"sjamanistisch"
			"zoroastrisch"
			"tantristisch"
		} .

		?cho dct:spatial ?place .
		?cho dc:title ?title .
		?cho dc:subject ?religion .
		?religion skos:prefLabel ?religionLabel .
		?place skos:exactMatch/gn:parentCountry ?country .
		?country wgs84:lat ?lat .
		?country wgs84:long ?long .
		?country gn:name ?countryLabel .
		?cho dct:created ?date .
		BIND (xsd:gYear(?date) AS ?year) .
		FILTER (?year > xsd:gYear("1000")) .
		FILTER langMatches(lang(?title), "ned").
	} GROUP BY ?date ?countryLabel ?lat ?long LIMIT 10
`
