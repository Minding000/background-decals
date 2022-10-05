import { readFileSync, appendFileSync } from 'fs'

const COVERAGE_REPORT_FILE_PATH = "console-coverage.txt"
const COVERAGE_PERCENTAGE_REGEX = /(?<=all\sfiles[\s|]+)\d+.\d+/i
const COVERAGE_PERCENTAGE_PRECISION = 2

const coverageOutput = readFileSync(COVERAGE_REPORT_FILE_PATH).toString()
const rawCoveragePercentage = coverageOutput.match(COVERAGE_PERCENTAGE_REGEX)?.[0]
if (!rawCoveragePercentage)
	throw new Error("Failed to find coverage percentage in coverage report using regex.")
const coveragePercentage = parseFloat(rawCoveragePercentage)
appendFileSync(process.env.GITHUB_ENV, `coveragePercentage=${coveragePercentage.toFixed(COVERAGE_PERCENTAGE_PRECISION)}\n`)
