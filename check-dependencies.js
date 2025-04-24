import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Define the source directory
const sourceDir = path.join(__dirname, "src")

// Dependencies to check for
const dependenciesToCheck = ["lucide-react", "clsx", "tailwind-merge", "@/components"]

// Function to recursively process all files in a directory
function processDirectory(directory) {
  const files = fs.readdirSync(directory)
  let issues = []

  for (const file of files) {
    const filePath = path.join(directory, file)
    const stats = fs.statSync(filePath)

    if (stats.isDirectory()) {
      issues = [...issues, ...processDirectory(filePath)]
    } else if (stats.isFile() && (filePath.endsWith(".js") || filePath.endsWith(".jsx"))) {
      const fileIssues = checkFile(filePath)
      if (fileIssues.length > 0) {
        issues.push({ file: filePath, issues: fileIssues })
      }
    }
  }

  return issues
}

// Function to check a file for dependency issues
function checkFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8")
    const issues = []

    for (const dependency of dependenciesToCheck) {
      if (content.includes(`from "${dependency}"`) || content.includes(`from '${dependency}'`)) {
        issues.push(`Uses ${dependency}`)
      }
    }

    return issues
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error)
    return [`Error: ${error.message}`]
  }
}

// Start processing from the source directory
console.log("Checking for dependency issues...")
const issues = processDirectory(sourceDir)

if (issues.length === 0) {
  console.log("No dependency issues found!")
} else {
  console.log("Found dependency issues:")
  issues.forEach(({ file, issues }) => {
    console.log(`\n${file}:`)
    issues.forEach((issue) => console.log(`  - ${issue}`))
  })
}
