import { defineConfig, globalIgnores } from "eslint/config"
import nextCoreWebVitals from "eslint-config-next/core-web-vitals"

export default defineConfig([
  ...nextCoreWebVitals,
  {
    rules: {
      "no-alert": "error",
      // New in eslint-config-next 16. Flags the hook pattern of resetting state on ID change.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
])
