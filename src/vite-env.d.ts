/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TMDB_API_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Allow importing plain CSS files
declare module '*.css'
