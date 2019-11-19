export default `
	PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
	PREFIX dc: <http://purl.org/dc/elements/1.1/>
	PREFIX dct: <http://purl.org/dc/terms/>
	PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
	PREFIX edm: <http://www.europeana.eu/schemas/edm/>
	PREFIX foaf: <http://xmlns.com/foaf/0.1/>
	PREFIX gn: <http://www.geonames.org/ontology#>
	PREFIX wgs84: <http://www.w3.org/2003/01/geo/wgs84_pos#>

	SELECT ?title ?religion ?objectLabel ?religionLabel ?type ?country ?countryLabel ?lat ?long WHERE {
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

		?cho edm:isRelatedTo <https://hdl.handle.net/20.500.11840/termmaster2091> .
		?cho dct:spatial ?place .
		?cho dc:title ?title .
		?cho edm:object ?object .
		?object skos:prefLabel ?objectLabel .
		?religion skos:prefLabel ?religionLabel .
		?place skos:exactMatch/gn:parentCountry ?country .
		?country wgs84:lat ?lat .
		?country wgs84:long ?long .
		?country gn:name ?countryLabel .
		FILTER langMatches(lang(?title), "ned").
	}
`
