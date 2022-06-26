"use strict"

const axios = require("axios")

const BASE_URL = "https://landregistry.data.gov.uk"

const today = new Date()
today.setMonth(today.getMonth() - 6) // 6 months previous
const date = today.getDate().toString().padStart(2, "0")
const month = (today.getMonth() + 1).toString().padStart(2, "0")
const year = today.getFullYear()

const DEFAULT_PERIOD_START = `${year}-${month}-${date}`
const DEFAULT_PERIOD_END = "" // now
const DEFAULT_PAGE = 0
const DEFAULT_PAGE_SIZE = 200
const DEFAULT_VIEW = "basic"
const DEFAULT_PROPERTIES = ["housePriceIndex","refMonth","refPeriodStart","refPeriodDuration","salesVolume","averagePrice"]

function validateDateInput(value) {
	if (!value || value === "") { return false }
	// eslint-disable-next-line no-useless-escape
	else if (/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/.test(value)) { return true }
	else { return false }
}

async function openDataQuery(
	region,
	periodFrom = DEFAULT_PERIOD_START,
	periodTo = DEFAULT_PERIOD_END, 
	page = DEFAULT_PAGE,
	pageSize = DEFAULT_PAGE_SIZE,
	view = DEFAULT_VIEW,
	properties = DEFAULT_PROPERTIES
) {

	if (!region || region === "") throw new Error(`API::Region parameter missing`)
	if (!periodFrom || periodFrom === "" || !validateDateInput(periodFrom)) periodFrom = DEFAULT_PERIOD_START
	if (!periodTo || periodTo === "" || !validateDateInput(periodFrom)) periodTo = DEFAULT_PERIOD_END
	if (!page || page < 0) page = DEFAULT_PAGE
	if (!pageSize || pageSize < 0) pageSize = DEFAULT_PAGE_SIZE
	if (!view || view === "") view = DEFAULT_VIEW
	if (!properties || properties.length === 0) properties = DEFAULT_PROPERTIES

	

	const headers = {
		"Content-Type": "application/json",
		Accept: "application/json"
	}

	var propertiesParam = ""

	properties.forEach(function (property) {
		propertiesParam += `${property},`
	})

	const params = {
		_page: page,
		_pageSize: pageSize,
		"min-refPeriodStart": periodFrom,
		"max-refPeriodStart": periodTo,
		_view: view,
		_properties: propertiesParam
	}
  
	const url = `${BASE_URL}/data/ukhpi/region/${encodeURIComponent(region)}.json`
  
	return await axios.get(
		url,
		{
			headers,
			params
		}
	)
}

module.exports = {
	openDataQuery
}