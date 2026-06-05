# Monblanproject

A single-page responsive website for an Instagram-like profile page.

## Technologies

- HTML5
- SCSS (variables, mixins, nesting)
- JavaScript (ES5)
- Gulp 4 (build tool)
- Flatpickr (date picker)
- BrowserSync (live reload)

## Project Structure
## Installation & Usage

### 1. Install dependencies
```bash
npm install
```

### 2. Build the project
```bash
npm run build
```

### 3. Start development mode
```bash
npm run dev
```

Browser will open at `http://localhost:3000`

## Gulp Tasks

| Task | Description |
|------|-------------|
| `gulp build` | Build the project |
| `gulp dev` | Build + watch + BrowserSync |
| `gulp clean` | Remove dist folder |
| `gulp styles` | Compile SCSS → CSS |
| `gulp scripts` | Bundle and minify JS |
| `gulp images` | Copy images |
| `gulp html` | Copy HTML |

## Features

- Filter posts by date range (from / to)
- Toggle post view: list / grid
- Dynamic post counter
- Date picker based on Flatpickr
- Responsive design
- "Load more" pagination button