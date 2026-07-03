# Masonry Photo Gallery

A self-contained masonry photo gallery with a click-to-enlarge lightbox, built
for static hosting (GitHub Pages, Netlify, etc.) where there's no server-side
code to scan a folder automatically.

## Files

- `index.html` — demo page. The section between the HTML comments is what you copy into your existing site.
- `style.css` — masonry layout + lightbox styling.
- `script.js` — reads `manifest.json` and builds the gallery + lightbox interactions.
- `manifest.json` — the list of image filenames to display. This is what actually controls what shows up.
- `generate-manifest.js` — optional Node script that rewrites `manifest.json` by scanning the `images` folder.
- `images/` — put your photos here.

## Why a manifest file?

On static hosting, JavaScript running in the browser can't ask the server
"what files are in this folder?" — there's no server-side code to answer that
question. `manifest.json` stands in for that: it's just a list of filenames,
and the page displays whatever is in the list.

## Quick start

1. Copy `style.css`, `script.js`, `manifest.json`, and the `images` folder into your site (keep them together in one folder, e.g. `/gallery/`).
2. Open `index.html` and copy everything between the two `<!-- ====== -->` comments into your existing page, wherever you want the gallery to appear.
3. In your page's `<head>`, add:
   ```html
   <link rel="stylesheet" href="gallery/style.css">
   ```
4. Right before your page's closing `</body>`, add:
   ```html
   <script src="gallery/script.js"></script>
   ```
5. Adjust the `gallery/` paths above (and the `images/` and `manifest.json` paths inside `script.js`) if you place things in a different folder structure.

## Adding or removing photos

**Option A — manual, no tools needed**
Drop a photo into `images/`, then add its filename to `manifest.json`:
```json
["sunset.jpg", "beach.jpg", "mountains.png"]
```
To remove one, delete the file and delete its entry from the list.

**Option B — automatic, requires Node.js**
Add or remove photos in `images/` as you like, then run:
```
node generate-manifest.js
```
This rewrites `manifest.json` to exactly match what's in the folder
(alphabetically sorted), so you never have to type filenames by hand. Run it
any time before you deploy.

## Customizing

- **Columns**: change the `column-count` values in `style.css` (`.gallery` rules) to control how many columns show at each screen width.
- **Spacing/colors**: edit the CSS variables at the top of `.masonry-gallery-section` in `style.css`.
- **Order**: images appear in the order they're listed in `manifest.json`. Reorder that list to change the display order.
- **Alt text**: generated automatically from each filename (dashes/underscores become spaces). Name your files descriptively, e.g. `sunset-over-the-bay.jpg`.

## If you ever move to PHP or Node hosting

If your hosting later supports server-side code, you can replace the
manifest-file approach with a script that scans the `images` folder live on
every page load, so you'd never need to touch `manifest.json` again. Just ask
and this can be swapped in.
