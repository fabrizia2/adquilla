import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Define the source directory
const sourceDir = path.join(__dirname, "src")

// Function to recursively process all files in a directory
function processDirectory(directory) {
  const files = fs.readdirSync(directory)

  for (const file of files) {
    const filePath = path.join(directory, file)
    const stats = fs.statSync(filePath)

    if (stats.isDirectory()) {
      processDirectory(filePath)
    } else if (stats.isFile() && (filePath.endsWith(".js") || filePath.endsWith(".jsx"))) {
      fixImports(filePath)
    }
  }
}

// Function to fix imports in a file
function fixImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf8")
    const originalContent = content

    // Replace @/ imports with relative paths
    const relativePath = path.relative(path.dirname(filePath), sourceDir).replace(/\\/g, "/")
    const relativePrefix = relativePath ? relativePath + "/" : "./"

    // Replace @/ with the relative path
    content = content.replace(/from\s+["']@\/(.*?)["']/g, (match, importPath) => {
      return `from "${relativePrefix}${importPath}"`
    })

    // Only write to the file if changes were made
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, "utf8")
      console.log(`Fixed imports in: ${filePath}`)
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error)
  }
}

// Start processing from the source directory
console.log("Starting to fix import paths...")
processDirectory(sourceDir)
console.log("Finished fixing import paths.")
