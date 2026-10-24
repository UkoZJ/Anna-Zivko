// Explicit public repository boundary. Backend, private inputs and evidence stay local.
export const publicationFiles = [
  '.gitignore', '.github/workflows/pages.yml', 'PUBLICATION.md',
  'index.html', 'package.json', 'package-lock.json', 'vite.config.js',
  'scripts/publication-files.mjs', 'scripts/check-publication.mjs', 'scripts/check-personalized-navigation.mjs',
  'src/accommodation-ui.js', 'src/art.js', 'src/config.js', 'src/event-content.js',
  'src/i18n.js', 'src/main.js', 'src/navigation.js', 'src/public-sections.js',
  'src/rsvp-demo.js', 'src/style.css', 'src/weekend-content.js',
  ...['surroundings.webp', 'shared-tour.mp4', 'shared-tour-poster.webp',
    'shared-interior.webp', 'shared-bunks.webp', 'parking.webp', 'masia.webp',
    'family-room.webp', 'family-exterior.webp', 'ceremony.webp', 'ca-la-rotllada.webp']
    .map(name => 'public/venue/' + name),
];
