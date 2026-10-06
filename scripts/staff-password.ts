// Makes a staff app account entry: npm run staff:password -- rhys@chshydraulics.co.uk
// Asks for the password (not echoed) and prints "email=hash" to add to NUXT_STAFF_ACCOUNTS
// (comma-separated). Same scrypt format as server/utils/staffAuth.ts.
import { randomBytes, scryptSync } from "node:crypto"
import { createInterface } from "node:readline"

const email = process.argv[2]?.trim().toLowerCase()
if (!email?.includes("@")) {
  console.error("Usage: npm run staff:password -- <email>")
  process.exit(1)
}

const rl = createInterface({ input: process.stdin, output: process.stdout })
// Hide what's typed.
;(rl as unknown as { _writeToOutput: (s: string) => void })._writeToOutput = (
  s,
) => {
  if (s.includes("Password")) process.stdout.write(s)
}
rl.question("Password (10+ characters): ", (password) => {
  rl.close()
  process.stdout.write("\n")
  if (password.length < 10) {
    console.error("Use at least 10 characters.")
    process.exit(1)
  }
  const salt = randomBytes(16).toString("base64url")
  const hash = scryptSync(password, salt, 32).toString("base64url")
  console.log(`\n${email}=scrypt$${salt}$${hash}`)
})
