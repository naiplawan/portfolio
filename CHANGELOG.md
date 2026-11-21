# Changelog

## [Unreleased]

### Added

- Add a Keystatic content admin at `/keystatic`: local files in development, GitHub branches in production once the GitHub App credentials are set (404 until then); hidden from crawlers and the site navigation.
- Make site identity, contact links, SEO titles and descriptions, keywords, skills, manifest text and the FAQ editable in Keystatic, stored as validated JSON in `content/`.
- Make curated projects (case studies, screenshots, order) and GitHub corrections editable in Keystatic; tests check screenshot dimensions and a 600 KB size budget.
- Add GitHub Actions checks for linting, type checking, tests, and production builds on pushes and pull requests.
- Add three selected project case studies with local screenshots, contributions, design decisions, and qualitative outcomes.
- Add a résumé download and regression tests for mobile navigation and homepage rendering without GitHub.

### Changed

- Move project screenshots to `/assets/projects/<slug>/image.*` so Keystatic keeps them stable; the old URLs redirect permanently.
- Render homepage projects from a curated selection independently of GitHub availability and repository activity.
- Replace numeric skill ratings with project and career evidence, and focus services on three deliverable-based offers with relevant examples.
- Clarify the homepage introduction and align the project archive, FAQ, and machine-readable site description with the selected work.

### Fixed

- Keep mobile navigation controls inside the focus trap and release scroll locks and inert page state when resizing to desktop.
- Run ambient cell animations only at desktop widths where the decoration is visible.
- Correct ByteTrack's frontend-demo description and URL, and prevent unverified repository homepages from overriding curated project links.
