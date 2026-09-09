# edekeulenaar.github.io

Personal site of Emillie de Keulenaar — curriculum, publications, projects and drawings.

Static: no build step, no dependencies. `index.html`, `style.css`, `app.js` and assets.

## Local preview

```
python3 -m http.server 8413
```

## Layout

| path              | contents                                          |
|-------------------|---------------------------------------------------|
| `index.html`      | all content                                       |
| `style.css`       | fluid type scale, layout, print-free monochrome   |
| `app.js`          | gallery masonry, lightbox, scrollspy, collapsibles|
| `fonts/`          | ABC Otto and Test National, subset to woff2       |
| `images/drawings/`| full-size and `-t` thumbnail webp pairs           |
| `cv/`             | CV as PDF                                         |

## Fonts

Both families are **trial cuts**. Test National's trial ships only
`[A-Za-z0-9 space , . -]`, so it is used solely for headings, years and the
wordmark; anything carrying accents or apostrophes is set in ABC Otto.
License both before relying on this publicly.
