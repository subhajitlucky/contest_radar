export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // TypeScript/TSX files should use conventional commits
    'type-enum': [
      2,
      'always',
      [
        'feat', // New feature
        'fix', // Bug fix
        'docs', // Documentation changes
        'style', // Code style changes (formatting, missing semi colons, etc)
        'refactor', // Code refactoring
        'test', // Adding missing tests or correcting existing tests
        'chore', // Changes to the build process or auxiliary tools and libraries such as documentation generation
        'perf', // Performance improvements
        'ci', // Changes to CI configuration files and scripts
        'build', // Changes that affect the build system or external dependencies
        'revert', // Reverts a previous commit
        'deps', // Dependency updates
        'config', // Configuration changes
        'init', // Project initialization
      ],
    ],
    'type-case': [2, 'always', 'lower-case'],
    'subject-case': [2, 'never', ['pascal-case', 'upper-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 100],
    'body-leading-blank': [1, 'always'],
    'footer-leading-blank': [1, 'always'],
  },
};
