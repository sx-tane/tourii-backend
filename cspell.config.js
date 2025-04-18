module.exports = {
  $schema:
    'https://raw.githubusercontent.com/streetsidesoftware/cspell/main/cspell.schema.json',
  version: '0.2',
  cache: {
    useCache: true,
    cacheLocation: './.cspell/.cspellcache',
    cacheStrategy: 'content',
  },
  dictionaryDefinitions: [
    {
      name: 'project-words',
      path: './project-words.txt',
      addWords: true,
    },
  ],
  dictionaries: ['project-words', 'node', 'npm', 'typescript'],
  files: ['./apps', './prisma', './libs', './etc'],
  ignorePaths: [
    '.vscode/**',
    '**/*.d.ts',
    '**/*.http',
    '**/openapi.html',
    './prisma/migrations/*',
    'dist',
    'node_modules',
    'pnpm-lock.yaml',
    'pgdata',
    'pnpm-lock.yaml',
  ],
  useGitignore: true,
};
