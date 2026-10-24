# Wedding homepage publication

This repository contains the reviewed public Vite frontend. Guest records,
personal invitation URLs, banking details, private screenshots and the Apps Script
backend stay outside this repository. Only `dist/` is deployed by GitHub Actions.

## Local review

Use Node 22 or newer. Run `npm ci`, `node scripts/check-publication.mjs`,
then `npm run build`. To preview a project path, set `PAGES_BASE_PATH` to
`/<approved-repository-name>/` before building and run `npm run preview`.
The public page supports ca/es/it/sl and variants A/B/C.

## Release requirements

1. Confirm GitHub owner, supported repository spelling and source visibility.
2. Review only the files listed in `scripts/publication-files.mjs`, including media.
   Stage that explicit list and run `node scripts/check-publication.mjs --staged`.
   Pattern checks supplement human review and do not prove absence of private data.
3. Add the exact final HTTPS homepage URL, with trailing slash, to
   `src/navigation.js`. Do not allow wildcard hosts or paths.
4. From the private local project, regenerate Apps Script translations and update
   the existing guest deployment to a new version. Keep its URL and access settings.
   Never upload the backend, private data or generated upload packages here.
5. In repository Settings > Pages, choose GitHub Actions. Push the reviewed main
   branch. The workflow installs dependencies, checks source, builds for the
   repository path, checks `dist`, and deploys only that artifact.
6. Verify all languages/designs, assets and missing-link guidance on the hosted
   site. Use an existing fictional invitation privately for the homepage > form >
   homepage round trip. Verify language/design and token fragment preservation.
7. Signed-out saving requires a server receipt, advanced server version and an
   independent database read. Restored browser drafts alone are insufficient.
8. Generate homepage-first guest links in private storage, preserving existing
   tokens and IDs without a forced language. Keep manual message placeholders.

## Rollback

Revert the public release commit and let the workflow redeploy, or unpublish the
site through Pages settings. If backend navigation changed, select the previous
version of the existing Apps Script deployment. Preserve guest responses and the
original deployment URL. Keep direct-form links privately as a recovery route.

Approved repository: `UkoZJ/Anna-Zivko` (public).
Homepage: `https://ukozj.github.io/Anna-Zivko/`.
The exact homepage is allowlisted in the existing private guest deployment.
The page retains its draft labels and provisional schedule. Signed-out server
save/read-back and the organizers' final retention policy remain acceptance work
before guest distribution. Publication does not send invitations.

Verified on 24 October 2026: the Pages workflow succeeded, HTTPS is enforced,
all 36 hosted locale/design/width layouts passed, and a fictional invitation
completed the hosted homepage > existing private form > personalized homepage
round trip without an attendance write. The return kept design B and the token
fragment. The existing Apps Script app is version 10 with unchanged deployment
URL, owner execution and access. The full private workspace test suite passed
90 tests; those backend test sources are intentionally outside this repository.
