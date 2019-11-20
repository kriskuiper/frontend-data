import categories from './lib/categories'
import getCleanData from './lib/get-clean-data'

// Have to use an iife here because we can't use await without async
(async () => {
	const data = await getCleanData(categories['wapens'])
	console.log('Works!')
	console.log(data)
})()
