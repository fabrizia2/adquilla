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
      fixLucideImports(filePath)
    }
  }
}

// Function to fix lucide-react imports in a file
function fixLucideImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf8")
    const originalContent = content

    // Check if the file imports from lucide-react
    if (content.includes('from "lucide-react"') || content.includes("from 'lucide-react'")) {
      // Extract the imported icons
      const importMatch = content.match(/import\s+{([^}]+)}\s+from\s+["']lucide-react["']/)

      if (importMatch) {
        const icons = importMatch[1].split(",").map((icon) => icon.trim())

        // Replace the lucide-react import with our custom icons import
        const relativePath = path
          .relative(path.dirname(filePath), path.join(sourceDir, "components"))
          .replace(/\\/g, "/")
        const iconsPath = relativePath ? `${relativePath}/icons` : "./icons"

        // Create the new import statement
        const newImport = `import { ${icons.join(", ")} } from "${iconsPath}"`

        // Replace the old import with the new one
        content = content.replace(/import\s+{[^}]+}\s+from\s+["']lucide-react["']/, newImport)

        // Write the updated content back to the file
        fs.writeFileSync(filePath, content, "utf8")
        console.log(`Fixed lucide-react imports in: ${filePath}`)
      }
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error)
  }
}

// Start processing from the source directory
console.log("Starting to fix lucide-react imports...")
processDirectory(sourceDir)
console.log("Finished fixing lucide-react imports.")
