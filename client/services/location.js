import server_connection from '../app/axios_connection';

export const search = async (value) => {
    let results = []
    const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${value}&apiKey=${process.env.NEXT_PUBLIC_AUTOCOMPLETE_API_KEY}`
    const r = await server_connection.get(url)
    for (let place of r.data.features) results.push(place.properties.city + ' / ' + place.properties.country)
    results = [...new Set(results)]
    return results
}