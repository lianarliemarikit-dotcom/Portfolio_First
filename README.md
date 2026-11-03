# Lian Arlie Marikit — reference-matched academic portfolio

React, TypeScript, Vite, GSAP ScrollTrigger and React Three Fiber. The latest 98-second reference controls the composition: a brief black greeting, centered light hero and liquid ring, curved dark transition, editorial portraits, lime curves, dark experience panel, black statistics cards, horizontal work strips, project imagery, curved moving typography, and a compact navigation panel on the right.

## Open locally
Double-click **Start-Portfolio.cmd**. It opens the portfolio in Microsoft Edge. Keep the terminal running while browsing. An existing preview is available at http://127.0.0.1:5173/.

For a standard Node.js 22 setup:
```sh
npm ci
npm run dev
npm run build
npm run preview
npm test
```
On this machine Node and npm are also available locally:
```powershell
$env:Path = "$PWD;" + $env:Path
.\node.exe .tools/package/bin/npm-cli.js run build
```

## Edit content
Layout spacing, responsive grids and typography sizes are centralized in **src/layout.css**. **src/navigation.css** styles the full-width persistent navigation, animated yellow active-section underline, page progress line, and mobile navigation. The Maximize view button enters browser fullscreen; Restore view exits it. All five navigation links remain visible on mobile. Existing image files are unchanged.

**src/data/portfolio.ts** is the main editable file.
- personal: name, current education, introduction, portrait and résumé.
- skills: editable technology interests and logo filenames.
- socials: email, GitHub and LinkedIn. Empty URLs remain non-clickable.
- categories: all eight academic categories. Entries support title, description, term, image, gallery, pdf, repository, video, embed, organization, role, duration, responsibilities, skills, date and evidenceType.
- reflections: add your own paragraphs separately for Prelim, Midterm and Final term. No personal learning narrative has been invented.
- portfolioCounts(): derives counts from actual entries. Training certificates count only entries marked evidenceType: 'certificate'.

Paths are relative to public, for example images/projects/example.webp. External repository links must use HTTPS. Video supports a local MP4/WebM or an embed URL from www.youtube-nocookie.com/embed/ or player.vimeo.com/video/.

## Supplied materials
Pictures/ contains your original files and is excluded from Git. The optimized public images are in public/images/archive/. src/data/assets.json maps each original filename to its public derivative. Gallery entries group related photographs without inventing individual awards or positions.

The site uses your supplied formal photo and candid photograph. The IBM certificate was rotated upright. Résumé details were used for documented roles, dates, honors and seminars. Current JRU/BSIT information takes precedence over older education information in the résumé.

public/documents/profile/resume.pdf is a concise public summary. The original résumé remains in Pictures/resume/. Third-party reference phone numbers and email addresses, your street address and phone number were not copied into the public summary.

## Academic compilation
**public/documents/academic-compilation/compilation.pdf** is a real 14-page PDF assembled from all 10 files in Pictures/activities:
- Original Prelim PT1 PDF pages.
- Prelim PT2 Word content, tables and embedded images converted to PDF.
- Daily wage flowchart, student-information program and CodeChum screenshots.

It contains 9 distinct outputs; the two Difference of Digits screenshots are grouped as one output. Its cover explicitly describes the available work, without claiming missing semester outputs are present.

Add later work to this PDF and update src/data/compilation.json. The local replacement-PDF chooser is only a temporary browser preview; publishing requires replacing the file in public.

To regenerate the current assets from Pictures (requires installed Edge):
```sh
node scripts/prepare-assets.mjs
```
This script requires the original local Pictures folder and is not run during deployment. It creates WebP images, the compilation, the public résumé summary and their data manifests.

## GitHub Pages
Publish this portfolio folder as the repository root. In repository Settings → Pages, set the build source to GitHub Actions. The workflow in .github/workflows/deploy.yml runs npm ci, builds dist, and deploys it on pushes to main.

Vite uses base: './' for correct relative assets under both a repository path and a custom-domain root. The production output is dist/. No backend is needed.

The GitHub Pages workflow builds this portfolio on pushes to main. Enable GitHub Actions as the Pages source in repository Settings → Pages.

## Visual verification and limitations
See docs/reference-review.md for the scene comparison and verification notes. The ring is a real deformed 3D mesh with studio reflections and a custom iridescent film shader. Its geometry and lighting are original; the source creator's exact shader and 3D model are unavailable. Your supplied portraits replace the reference's studio photography, so their framing differs.

The reference navigates between several pages; this portfolio places the required academic material in one continuous site with expandable categories and modal detail views. Long reflections retain normal scrolling. The desktop experience section uses a short pin; mobile and reduced-motion layouts do not.

## Accessibility and testing
Skip intro and Escape dismiss the greeting; Replay is in the footer. Reduced motion skips the intro and removes scroll animation. Pause motion freezes decorative animation. Native dialogs add focus wrapping, Escape dismissal, focus restoration, and a closing transition. WebGL failure uses a lightweight decorative fallback.

npm run build includes strict TypeScript checking.
npm test uses ports 4173–4176, then stops its own servers. It checks desktop/mobile overflow, all categories, menu keyboard behavior, real compilation preview, replacement PDF download/clear, intro, WebGL fallback, populated project and certificate views, reflection text, and actual MP4 playback with an isolated CC0 test clip. Navigation checks cover active-section tracking, yellow underline hover/focus, fullscreen/restore, all five links at narrow widths, smooth panel expansion and staggered reveals. Robot checks cover cursor following, return home, keyboard/touch reactions, sleep/wake, pause, offscreen suspension and reduced motion. Set BROWSER_PATH to an installed Chromium/Edge executable if needed. Test fixtures never enter production.

## Cursor trail and footer robot
The yellow mouse ribbon is in `src/components/CursorTrail.tsx`. It fades when the mouse stops, never intercepts clicks, and is disabled for touch, reduced motion, paused motion and open dialogs.

The floating robot is an original layered SVG character, based on the supplied glasses-wearing white robot reference. `InteractiveRobot.tsx` uses the modules in `src/components/robot/` for its face, eyes, body, pointer tracking and prioritized reaction state machine. It fits the existing gap above “LIAN ARLIE” without changing the footer typography or image files. Click or keyboard-activate the name to celebrate; tap or activate the robot to wave. Its eyes follow the pointer, it returns to center on exit, and it gets sleepy after 12 seconds of inactivity. Higher-priority reactions temporarily override idle motion. The sad expression is available for a future robot-related error; no chat service or artificial failure is added.

Motion runs only while the name is in view and the tab is visible. Mobile uses idle motion and tap reactions without cursor following. Reduced motion and Pause motion keep the character still, with static expression feedback on activation. Styling is in `src/robot.css`.

## Credits
Original monogram, document cover, 3D geometry and motion code. Fonts are bundled via Fontsource under their SIL Open Font Licenses. Devicon technology logos are MIT-licensed, with trademarks belonging to their owners; see public/logos/ATTRIBUTION.md. Personal photographs and academic materials were supplied in Pictures. The reference video is used for visual review only and is not shipped as a webpage background.
