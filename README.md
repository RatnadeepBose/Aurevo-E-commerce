# Aurevo — Static E‑Commerce Frontend

AUREVO is a small, static, single-page-style e-commerce frontend built with plain HTML, CSS and vanilla JavaScript. It showcases a minimal, conscious-luxury store interface with product cards, product pages, client-side cart/wishlist (localStorage), and small UI enhancements like badges and carousels.

This README explains project purpose, how to run locally, key files and folders, how to test interactive features (cart and carousels), and useful git commands (from `GITBASH.MD`) to publish changes.

**Project Goals**:
- Lightweight static site (no build step) demonstrating a minimal product storefront
- Accessible, responsive product pages and homepage with product carousels
- Client-side cart and wishlist persisted to `localStorage`

**Quick Overview**
- Tech: HTML, CSS, JavaScript (no frameworks)
- Location: project root contains all pages and assets
- Cart persistence: `localStorage` keys: `aurevo_cart`, `aurevo_wishlist`

**Preview**
Open `index.html` in a browser or serve the folder with a simple local server (preferred) to avoid file:// asset issues.

## Getting Started (Local)

Recommended: serve the folder so relative assets load correctly.

PowerShell (from project root):
```powershell
cd 'C:\Users\boser\Downloads\aurevo-ecommerce'
python -m http.server 8000
# then open http://localhost:8000/index.html
```

Alternatively, open `index.html` or any `productX.html` directly in your browser (but some browsers block certain local requests).

## Key Files & Structure

- `index.html` — Homepage with product grid and small product-card carousels.
- `product1.html` … `product6.html` — Individual product pages (product details, sticky add-to-cart actions).
- `style.css` — Global styles and UI tokens (colors, spacing, header styles, badges, etc.).
- `product-page.css` — Page-level product styles used by product pages.
- `script.js` — Larger site scripts (carousel manager, helpers). This file contains multiple utilities used across pages.
- `simple-carousel.js` — Homepage product card carousel implementation (used by `index.html`).
- `simple-product-carousel.js`, `product-carousel.js` — smaller/carousel helpers used by product pages.
- `cart-wishlist.js` — Cart and wishlist manager (client-side storage, badge updates, modal UI).
- `product-page.js` — Product-page interactions (image gallery, size selection, etc.).
- `README.md` — (this file)

Assets and product images are in folders like `black-t-shirt/`, `beige-t-shirt/`, etc.

## Cart & Wishlist Behavior

- Cart and wishlist are managed by `CartWishlistManager` in `cart-wishlist.js`.
- Data stored in `localStorage`:
	- `aurevo_cart` — array of cart items (id, name, price, size, color, quantity, image, addedAt)
	- `aurevo_wishlist` — wishlist items
- Badge elements: header buttons should include badge spans with the IDs `cartBadge` and `wishlistBadge`. `cart-wishlist.js` will read and update every element with these IDs on the page.

Common interactions:
- Click **Add to Cart** (`#addToCartBtn`) on a product page to add one unit to `aurevo_cart` (size required).
- Click the header cart button (`#cartBtn`) to open a small cart modal.

To clear cart data manually (dev):
```javascript
localStorage.removeItem('aurevo_cart');
localStorage.removeItem('aurevo_wishlist');
```

## Homepage Carousels (Product cards)

- `simple-carousel.js` powers the small carousels inside each product card on `index.html`. Each product card uses a `data-product` attribute to identify the carousel instance, e.g.:
	- `<div class="product-image-container" data-product="heritage">`
- The script maps `data-product` keys to internal state. Make sure each product on the same page uses a unique `data-product` key (a previous bug duplicated `heritage`, which was fixed by renaming product 5 to `tee`).

JS Entry points (global):
- `nextProductImage(key)`, `prevProductImage(key)`, `goToProductImage(key, index)` — used by inline handlers in `index.html` to control a specific product card's carousel.

## Product Page Gallery

- Product pages use `simple-product-carousel.js` / `product-page.js` to set up a sticky gallery, thumbnails and navigation arrows.

## How to Test (Quick Manual Checklist)

1. Start local server (see above).
2. Open `index.html`:
	 - Click arrows on each product card — images should cycle independently.
	 - Click dots to jump to a specific image.
	 - On mobile, swipe on the product card to change images.
3. Open `product1.html` (or other product pages):
	 - Select a size, click **Add to Cart** — the header badge should update.
	 - Click the cart icon to open the in-page cart modal.
	 - Verify `localStorage.getItem('aurevo_cart')` contains the item(s).
4. Clear `localStorage` and re-test if needed.

## Development Notes & Tips

- Header consistency: header markup exists on multiple pages. If you edit the header, update each HTML file or consider a small JS include to inject the header markup at runtime for maintainability.
- Keep `data-product` unique for each homepage product carousel — otherwise multiple cards will collide in `productCarouselState`.
- `cart-wishlist.js` exposes a `cartWishlist` instance on `window` for debugging: use `cartWishlist.productCarouselStatus()` or inspect `cartWishlist.cart` in devtools.

## Common Git Commands (from `GITBASH.MD`)
Use these commands to initialize the repository and push changes to GitHub (adapt as needed):

```bash
cd "C:\Users\boser\Downloads\aurevo-ecommerce"
git init
git remote set-url origin https://github.com/RatnadeepBose/Aurevo-E-commerce.git
git add .
git commit -m "Initial commit - new Aurevo E-Commerce project"
git branch -M main
git push -u origin main --force
```

Note: `--force` will overwrite the remote branch history — use with care.

## Known Issues / TODOs

- Header duplication across pages — consider centralizing header.
- Add small unit/integration tests (none present currently).
- Improve accessibility: add `aria-live` for cart badge updates, ensure modals trap focus.
- Consider bundling / minification if the project grows (currently static for clarity).
# Aurevo — Static E‑Commerce Frontend (Detailed)

AUREVO is a lightweight static storefront built with plain HTML, CSS and JavaScript. The project demonstrates a minimal product catalog and product pages, client-side cart/wishlist storage (via `localStorage`), responsive layouts, and small UI features such as product-card carousels and modal cart previews.

This README is expanded with an explicit Table of Contents, detailed file-by-file documentation, developer workflows, the `CartWishlistManager` API surface (useful when extending or debugging), JSON examples of stored data, troubleshooting steps, accessibility notes, and testing/checklist instructions.

## Table of Contents
- Project summary
- Quick start (local)
- File map (detailed)
- Cart & Wishlist: behavior and API
- Homepage carousels and how to add products
- Product page gallery
- Debugging and developer utilities
- Accessibility checklist
- Testing checklist
- Deployment & git workflow
- Known issues and future improvements
- Contributing and license

-------------------------------------------------------------------------------

## Project summary
- Static site (no build tools). Good for prototypes and simple storefront demos.
- Tech: vanilla JS, modern CSS (uses CSS variables), no external build or server required.
- Store data is intentionally client-side (localStorage) for a simple demo experience.

## Quick start (local)
1. Open a terminal (PowerShell) and serve the project root. Serving is recommended because some browsers restrict local file requests:
```powershell
cd 'C:\Users\boser\Downloads\aurevo-ecommerce'
# If you have Python 3 installed
python -m http.server 8000
# open http://localhost:8000/index.html in your browser
```
2. Alternatively double-click `index.html` to open via `file://` (may work, but server is preferred).

## File map (detailed)
- `index.html`
	- Homepage. Product grid with small carousels inside each product card. Each product card uses `data-product` to identify its carousel state.
- `product1.html` … `product6.html`
	- Product detail pages. Include image gallery, size selection, and sticky bottom action (Add to Cart / Buy Now).
- `style.css`
	- Global styling (variables, header, badges, layout tokens). Large file — contains branded color tokens and many component rules.
- `product-page.css`
	- Styles scoped to product detail pages (product layout, thumbnails, flipkart-style layout in this project).
- `script.js`
	- Large utility and feature script. Contains a CarouselManager (for larger banner/carousels) and other shared helpers.
- `simple-carousel.js`
	- Homepage product-card carousel logic (initializes `.product-image-container[data-product]` nodes). Exposes `nextProductImage`, `prevProductImage`, `goToProductImage` as globals for inline handlers in `index.html`.
- `simple-product-carousel.js` / `product-carousel.js`
	- Helpers used by the product pages for image switching and gallery controls.
- `cart-wishlist.js`
	- Implements `CartWishlistManager` — cart and wishlist logic, localStorage persistence, modal rendering, badges and UI helpers.
- `product-page.js`
	- Product page specific behaviors (size selection, buy flow, updating main image from thumbnails).
- Images & assets (folders)
	- e.g. `black-t-shirt/`, `beige-t-shirt/`, `grey-tshirt/` — product images used by pages.

## Cart & Wishlist — behavior and API
The core cart/wishlist logic lives in `cart-wishlist.js` as a JS class `CartWishlistManager` and is instantiated as `window.cartWishlist`. Use this object in the console for debugging.

### Public methods available on `cartWishlist` (runtime)
- `addToCart(productId, productData)`
	- productId: string (e.g. `heritage-crewneck`)
	- productData: object containing at least: `{ name, price, originalPrice, image, size, color }`
	- Returns: `true` on success. Persists to `localStorage` key `aurevo_cart`.
- `removeFromCart(productId, size, color)`
	- Removes matching item (by id + size + color).
- `getCartTotal()`
	- Returns numeric total (sum price × qty).
- `getCartCount()`
	- Returns total item quantity (sum of quantities).
- `clearCart()`
	- Clears local cart and updates UI.
- `addToWishlist(productId, productData)`
	- Adds item to wishlist and persists to `aurevo_wishlist`.
- `removeFromWishlist(productId)`
- `toggleWishlist(productId, productData)`
- `isInWishlist(productId)`
- `showCartModal()` / `showWishlistModal()`
	- Render lightweight modal with contents (modal is appended to `document.body`).
- `goToCheckout()`
	- Redirects to `checkout.html` (if cart not empty).

### Data schema examples
- Cart item (stored in `aurevo_cart` — array):
```json
{
	"id": "heritage-crewneck",
	"name": "Black Essential Tee",
	"price": 349,
	"originalPrice": 1799,
	"image": "black-t-shirt/Untitled design (5).png",
	"size": "M",
	"color": "Default",
	"quantity": 1,
	"addedAt": 1690000000000
}
```

- Wishlist item (stored in `aurevo_wishlist` — array): similar to cart item but without `quantity`.

## Homepage carousels and how to add a new product
- The homepage carousel system (`simple-carousel.js`) is keyed by the `data-product` value on `.product-image-container` elements.
- To add a new product card: ensure `data-product` is unique, add the `product-image-container` markup with `.product-image` images, arrows calling `prevProductImage('your-key')` / `nextProductImage('your-key')`, and dot elements that call `goToProductImage('your-key', index)`.

### Example minimal product card markup (copy an existing card and update `data-product` and images):
```html
<div class="product-card">
	<div class="product-image-container" data-product="my-new-key">
		<img class="product-image active" src="images/my1.png">
		<img class="product-image" src="images/my2.png">
		<button onclick="event.stopPropagation(); prevProductImage('my-new-key')">‹</button>
		<button onclick="event.stopPropagation(); nextProductImage('my-new-key')">›</button>
		<div class="product-dots">
			<span onclick="event.stopPropagation(); goToProductImage('my-new-key',0)"></span>
		</div>
	</div>
</div>
```

## Product page gallery
- Product pages use `product-page.js` and `simple-product-carousel.js` to create a sticky image gallery with thumbnails. When you add or change images there, ensure `img` elements have the correct `id` attributes if other scripts expect them.

## Debugging & developer utilities
- In browser DevTools console:
	- `window.cartWishlist` — inspect cart/wishlist state and call methods interactively.
	- `localStorage.getItem('aurevo_cart')` — raw JSON string for cart.
	- `window.testProductCarousels()` — helper to exercise carousels across product cards (defined in `simple-carousel.js`).

### Common issues & fixes
- Duplicate `data-product` keys (homepage): causes two cards to share state so clicking arrows affects both. Fix: ensure unique `data-product` values per card.
- Missing `.product-dot` elements or mismatched count: make sure dot count equals image count or the dot handlers may reference non-existent indices.
- If badges don't appear: check that header badge spans exist with ids `cartBadge` / `wishlistBadge` and that `cart-wishlist.js` is loaded after the header in the HTML.

## Accessibility checklist (recommendations)
- Add `aria-live="polite"` area for cart count changes so assistive tech users hear updates.
- Ensure modal focus trapping and focus return on close.
- Add `alt` text for all product images (already present in many files; keep them descriptive).
- Ensure controls (arrows, dots) are keyboard-focusable (`button` or `a`), and add `aria-label` describing the action.

## Testing checklist (manual / quick)
1. Start server: `python -m http.server 8000`.
2. Load `http://localhost:8000/index.html`.
3. For each product card:
	 - Click right arrow — image shifts to next.
	 - Click left arrow — goes back.
	 - Click dots — jumps to correct image.
	 - Swipe on a mobile device (or emulator) — gestures change images.
4. Open a product page (e.g., `product1.html`):
	 - Select a size and click **Add to Cart**.
	 - Confirm `localStorage` has the item: `JSON.parse(localStorage.getItem('aurevo_cart'))`.
	 - Click header cart button — modal shows items and totals.
5. Clear cart with `cartWishlist.clearCart()` or `localStorage.removeItem('aurevo_cart')` and verify the badge hides.

## Deployment & git workflow
- The repo includes basic `GITBASH.MD` notes; to push to GitHub:
```bash
cd "C:\Users\boser\Downloads\aurevo-ecommerce"
git init
git remote set-url origin https://github.com/RatnadeepBose/Aurevo-E-commerce.git
git add .
git commit -m "Initial commit - new Aurevo E-Commerce project"
git branch -M main
git push -u origin main --force
```
> Note: `--force` will overwrite remote history — avoid it for day-to-day pushes unless you intentionally need to rewrite history.

## Known issues and future improvements
- Header duplication across pages — consider a runtime include or bundling header in a template.
- Add focus trapping to modals and `aria-live` regions for better accessibility.
- Add unit/integration tests and automated browser tests (Playwright / Cypress) for regression checks.
- Consider bundling/minification and an optional small Node.js dev server for a more robust dev workflow.

## Contributing
1. Fork and clone the repo.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Make changes, test locally, commit, and open a PR.

## License
See `LICENSE` in the repository root.

If you'd like, I can now:
- Add a small `CONTRIBUTING.md` with exact workflow and commit hooks, or
- Inject a shared header include (small `header.js`) and update all pages to import it, or
- Add a tiny Playwright test that cycles homepage carousels and verifies cart flows automatically.

Tell me which follow-up you prefer and I will implement it.

## Optional: Use a Google Sheet as a product data source
If you want a simple, non‑database backend for product data you can use a Google Sheet and fetch it from the site at runtime. Below are two common, reliable methods and example code you can copy into the project.

Why use a sheet
- Fast to edit product catalog without touching HTML
- Great for demos / prototyping and non-technical content editors

Important: keep the sheet read-only (do not put secrets or private keys in it). If you need protected data or higher scale, use a proper backend.

1) Prepare your sheet
- Create a sheet with a header row. Example columns:
	- `id` (unique string)
	- `name`
	- `price` (number)
	- `originalPrice` (number)
	- `image` (URL or relative path)
	- `images` (comma-separated URLs for gallery)
	- `sizeOptions` (comma-separated, e.g. `XS,S,M,L`)
	- `colorOptions` (comma-separated)
	- `description`

2) Publish / share and obtain a URL
- Option A — CSV (easiest): File → Publish to web → choose the sheet and select `Comma-separated values (.csv)` → copy the generated `publish` URL. It will look like:
	- `https://docs.google.com/spreadsheets/d/<SHEET_ID>/pub?output=csv`
- Option B — gviz JSON (no library required): the gviz endpoint returns JSON wrapped in a small JS prefix. URL:
	- `https://docs.google.com/spreadsheets/d/<SHEET_ID>/gviz/tq?tqx=out:json&gid=<GID>`

3) Client-side fetch examples

- CSV (recommended if you plan to use a CSV parser like PapaParse)

Install PapaParse (optional, or include via CDN):
```html
<script src="https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js"></script>
```

Then (example):
```javascript
const csvUrl = 'https://docs.google.com/spreadsheets/d/<SHEET_ID>/pub?output=csv';
fetch(csvUrl)
	.then(r => r.text())
	.then(csvText => {
		const result = Papa.parse(csvText, { header: true, skipEmptyLines: true });
		const rows = result.data; // array of objects
		const products = rows.map(r => ({
			id: r.id,
			name: r.name,
			price: Number(r.price) || 0,
			originalPrice: Number(r.originalPrice) || Number(r.price) || 0,
			images: r.images ? r.images.split(',').map(s => s.trim()) : [r.image].filter(Boolean),
			sizeOptions: r.sizeOptions ? r.sizeOptions.split(',').map(s=>s.trim()) : ['M'],
			colorOptions: r.colorOptions ? r.colorOptions.split(',').map(s=>s.trim()) : ['Default'],
			description: r.description || ''
		}));

		// now render the products on the page or wire them into existing code
		console.log('Products loaded from sheet', products);
	})
	.catch(err => console.error('Error loading CSV sheet', err));
```

- gviz JSON (no external parser)

```javascript
const gvizUrl = 'https://docs.google.com/spreadsheets/d/<SHEET_ID>/gviz/tq?tqx=out:json&gid=<GID>';
fetch(gvizUrl)
	.then(r => r.text())
	.then(txt => {
		// gviz wraps JSON in some characters, trim them
		const json = JSON.parse(txt.substring(txt.indexOf('{')));
		const rows = json.table.rows.map(r => {
			return json.table.cols.reduce((acc, col, i) => {
				const key = (col.label || col.id || `col${i}`).toString();
				const cell = r.c[i];
				acc[key] = cell ? cell.v : '';
				return acc;
			}, {});
		});

		// rows is an array of plain objects from the sheet
		console.log('GViz rows', rows);
	})
	.catch(err => console.error('GViz fetch failed', err));
```

4) Mapping sheet rows to your product rendering
- Once you have a `products` array (see CSV example), you can:
	- Generate product cards on the homepage by creating DOM nodes for each product and inserting them into `#productGrid`.
	- On a product page, look up the product by `id` and populate fields (title, price, images).

Simple DOM insertion example (homepage snippet):
```javascript
function createCard(p) {
	const div = document.createElement('div');
	div.className = 'product-card';
	div.innerHTML = `
		<div class="product-image-container" data-product="${p.id}">
			<img class="product-image active" src="${p.images[0] || p.image}">
			<!-- arrows and dots omitted for brevity; you can create them dynamically -->
		</div>
		<div class="product-info-section">
			<h3 class="product-title">${p.name}</h3>
			<div class="product-pricing"><span class="current-price">₹${p.price}</span></div>
		</div>`;
	return div;
}

// append to grid
products.forEach(p => document.getElementById('productGrid').appendChild(createCard(p)));

// after inserting, call the carousel initializer (if using the homepage carousels)
if (window.initHomepageCarousels) window.initHomepageCarousels();
```

Tips & gotchas
- Images: use public URLs (GitHub raw URLs, CDN, or hosted images). If you store relative paths in the sheet, those paths must match files in the repo and the site must be served from the same root.
- CSV parsing: use a robust parser (PapaParse) if your fields may contain commas or quotes.
- CORS: published CSV and the gviz endpoint are accessible from browsers. If you host a private sheet or use the Sheets API with credentials, you'll need a backend to proxy requests.
- Caching: consider caching the fetched JSON in localStorage or only fetching once per session for performance.

Security and production notes
- Google Sheets published to web are public. Do not store secrets or private data.
- For production or private catalogs, use a proper backend (Node/Express, Firebase, or any small API) and keep API keys/server-side.

If you want, I can add a small script in the project that demonstrates loading products from a provided sheet ID (prompting for the sheet ID at runtime or using a config file). Tell me if you prefer the CSV or gviz approach and I will scaffold the loader.

The site is ready for:
- Google Analytics integration
- Conversion tracking
- User behavior analysis
- A/B testing capabilities

## 🌱 Environmental Impact

AUREVO promotes:
- **Sustainable Materials**: Organic cotton and recycled polyester
- **Conscious Consumption**: Quality over quantity
- **Local Delivery**: Reduced carbon footprint
- **Unisex Design**: Inclusive fashion reducing waste

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Developer

**Website developed and managed by [Ratnadeep Bose](https://ratnadeepbose.github.io/portfolio-ratnadeep/)**

## 📞 Support

For setup help or customization requests:
- 📧 Email: 
- 💬 GitHub Issues:
- 📱 WhatsApp: 

## 🚀 Deployment Status

- ✅ **Development**: Local testing complete
- ✅ **Staging**: GitHub repository ready
- 🔄 **Production**: Deploy to GitHub Pages
- 📊 **Monitoring**: Google Sheets integration active

---

<div align="center">

**🌿 AUREVO - Conscious Luxury 🌿**

*Where inclusive minimalist design meets conscious luxury*

Made with 💚 for sustainable fashion

</div>