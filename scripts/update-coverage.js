const { execSync } = require("child_process")

const coverageOutput = execSync("npm run test:coverage").toString()
const coverageRegexMatch = coverageOutput.match(/All\sfiles.*?\s+(\d+.\d+)/)

if (coverageRegexMatch) {
	const coverageFloat = parseFloat(coverageRegexMatch[1])
	const badgeColor = getBadgeColorByCoverage(coverageFloat)
	const badgeUrl = getBadgeCoverageUrl("coverage", coverageFloat, badgeColor)
	console.log(badgeUrl)
}

function getBadgeCoverageUrl(title, coverage, color) {
	// shields coverage url will look like this:
	// https://shields.io/badge/[TEXT_LEFT]-[TEXT-RIGHT]-[COLOR-RIGHT]
	const shieldsCoverageUrl = "https://shields.io/badge/"
	return `${shieldsCoverageUrl}${title}-${coverage}-${color}`
}

function getBadgeColorByCoverage(coverageNumber) {
	if (coverageNumber < 50)
		return "red"
	if (coverageNumber < 75)
		return "orange"
	if (coverageNumber < 90)
		return "yellow"
	else
		return "brightgreen"
}
