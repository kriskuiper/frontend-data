# NVMW mappd
[![Netlify Status](https://api.netlify.com/api/v1/badges/e4c94d57-a6f5-4086-85ba-12a8be9162d2/deploy-status)](https://app.netlify.com/sites/frontend-data-kris-kuiper/deploys)

> Datavisualization to explore the objects of the NMVW based on religion, objecttype and country
[Read all about the concept](https://github.com/kriskuiper/frontend-data/wiki/Thinking-of-a-concept)

![App homepage](assets/home.png)

## Installation
`src/app.js` gets bundled to `public/scripts/bundle.js`, the public folder gets served from Netlify.

```bash
# Clone the repo
git clone https://github.com/kriskuiper/frontend-data.git

# Install dependencies
npm install

# Bundle and watch src/app.js
npm run dev

# Bundle and build
npm run build
```

I use the `live-server` plugin in VSCode so I have live reload in development, I guess you have to find your own way of having live reload for now ¯\\\_(ツ)_/¯. 

I will implement some sort of dev environment in the future.

## Data used in this project
Since this is a study assignment we have access to the NMVW *linked open data* database. We can query data by writing SPARQL (SQL-like) queries. Since my query has to be dynamic I format the query using Javascript:

```js
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
```

The above query gets the following data:
* Get all objects
* Objects should have a religion bound to them
* Objects should have a title bound to them
* Objects should have a place
* Place should have a parentCountry
* Get the lat and long of the parentcountry

This query gets all raw data which we clean hereafter, again using Javascript.

[Read all about cleaning data](https://github.com/kriskuiper/frontend-data/wiki/Cleaning-the-data-(again))

## D3 uses an update pattern
To update the visualizations, D3 uses an update pattern. Since I use the latest version of D3 I decided to use the new update pattern using `node.join()` instead of just using .enter() multiple times. I do this because this pattern is much clearer to me and helped me understand how an update pattern works.

[Read all about the update patterns](https://github.com/kriskuiper/frontend-data/wiki/Rendering-dots-on-a-Mapbox-map)

## Shortcuts were taken to finish the project in time
In the end some shortcuts were taken to be able to finish the project in time. This made the UX lack a little in some areas, for example:
* [The barchart should have legends to show how many objects each religion has](link-to-ticket) *Right now I use a tooltip for this that gets shown on hover*
* [Some of the code definately needs refactoring]() *Some code is just hacked together to make it work, I'm very sorry to anyone who reads some of the code and to my future self already*
* [When filtering on religion, there's only checked if a country has a specific religion, not how many objects of that religion exist in a country]() *Ideally the objects in a country should be filtered on a selected religion and the chart should show how many objects are left per religion*

## Acknowlegdements
I want to thank the following people who helped me when I was struggling with the project:
* [Tim Ruiterkamp](https://github.com/timruiterkamp) *Used his frontend-data repo for reference sometimes*
* [Chazz Mannering]() *Helped me understanding the D3 enter-update-exit pattern* 
* [Wiebe Kremer]() *Helped me debugging the bar-chart update pattern (yes, I had to use a 'key' for specificity issues)*

## Examples and docs used
* [Tim Ruiterkamp's frontend-data repo](https://github.com/timruiterkamp/frontend-data) *As stated earlier, used the repo as reference for things like plotting static dots on the Mapbox map*
* [Mapbox GL JS docs](https://docs.mapbox.com/mapbox-gl-js/api/) *Used for implementing Mapbox into the project*
* [Nicholas H's article on building a interactive bar chart](https://bl.ocks.org/syncopika/f1c9036b0deb058454f825238a95b6be) *Completely overhauled this example by implementing it in my own project*
* [My functional programming repo](https://github.com/kriskuiper/functional-programming) *Used to build out the static bar chart*
