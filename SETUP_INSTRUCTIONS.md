# 🚀 Trading Guide - Setup Instructions

## Prerequisites

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **npm** v9+ (comes with Node.js)
- **Git** (optional, for version control)

---

## 📦 Installation

### 1. Install Dependencies

```bash
npm install
```

This will install:
- **Vite** - Lightning-fast build tool
- **ESLint** - Code quality checker
- **Prettier** - Code formatter
- **PWA Plugin** - Progressive Web App support

---

## 🛠️ Development

### Start Development Server

```bash
npm run dev
```

- Opens at `http://localhost:3000`
- Hot module replacement (HMR)
- Auto-reload on file changes

### Lint Code

```bash
# Check for errors
npm run lint

# Auto-fix errors
npm run lint:fix
```

### Format Code

```bash
# Format all files
npm run format

# Check formatting
npm run format:check
```

---

## 🏗️ Build for Production

### Build the App

```bash
npm run build
```

Output: `dist/` folder

### Preview Production Build

```bash
npm run preview
```

Opens at `http://localhost:4173`

---

## 🚢 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI (first time only)
npm install -g vercel

# Deploy
npm run deploy
```

Or use Vercel Dashboard:
1. Connect your GitHub repo
2. Vercel auto-detects Vite
3. Deploy automatically on push

### Manual Deployment

```bash
npm run build
# Upload dist/ folder to your hosting
```

---

## 📁 Project Structure

```
Trading Guide/
├── index.html              # Main entry point
├── pages/                  # All HTML pages
│   ├── journal.html        # NEW: Trading journal
│   ├── calculators.html
│   └── ...
├── js/                     # JavaScript modules
│   ├── main.js
│   ├── navigation.js
│   └── ...
├── css/                    # Stylesheets
│   ├── styles.css
│   └── ...
├── config/                 # Configuration files
│   ├── manifest.json
│   └── vercel.json
├── package.json            # NEW: Dependencies
├── vite.config.js          # NEW: Build config
├── .eslintrc.json          # NEW: Linting rules
└── .prettierrc.json        # NEW: Formatting rules
```

---

## 🎨 Code Quality

### ESLint Rules

- ✅ No console.log in production
- ✅ No debugger statements
- ✅ Prefer const over let
- ✅ Always use === instead of ==
- ✅ Consistent code style

### Prettier Formatting

- Single quotes for JS
- 4 spaces for JS
- 2 spaces for HTML/CSS
- Semicolons required
- 100 character line width

---

## 🔧 Configuration

### Environment Variables

Create `.env.local` for local development:

```env
# Future: Add when backend is implemented
VITE_FIREBASE_API_KEY=your_key_here
VITE_STRIPE_PUBLIC_KEY=your_key_here
```

### Vite Config

Edit `vite.config.js` to:
- Add new pages
- Configure build options
- Modify PWA settings

---

## 📱 PWA Setup

### Generate Icons (Required)

You need to create app icons:

1. **Create icons folder:**
   ```bash
   mkdir public/icons
   ```

2. **Generate icons:**
   - Use [PWA Asset Generator](https://www.pwabuilder.com/imageGenerator)
   - Upload a 512x512 logo
   - Download icon pack
   - Place in `public/icons/`

3. **Required sizes:**
   - `icon-192.png` (192x192)
   - `icon-512.png` (512x512)

### Test PWA

1. Build: `npm run build`
2. Preview: `npm run preview`
3. Open Chrome DevTools > Application > Manifest
4. Check "Install" button appears

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- --port 3001
```

### Build Errors

```bash
# Clear cache
npm run clean
rm -rf node_modules
npm install
npm run build
```

### ESLint Errors

```bash
# Auto-fix most issues
npm run lint:fix

# Ignore specific lines
// eslint-disable-next-line no-console
console.log('Debug info');
```

---

## 📚 Next Steps

### Phase 1: Immediate (This Week)
- [x] ✅ Create package.json
- [x] ✅ Add Vite build system
- [x] ✅ Configure ESLint/Prettier
- [ ] 🔲 Generate PWA icons
- [ ] 🔲 Remove console.log statements
- [ ] 🔲 Test production build

### Phase 2: Backend (Next 2-3 Weeks)
- [ ] 🔲 Set up Firebase project
- [ ] 🔲 Implement authentication
- [ ] 🔲 Create cloud database
- [ ] 🔲 Migrate journal to cloud

### Phase 3: Monetization (Week 4-6)
- [ ] 🔲 Add Stripe integration
- [ ] 🔲 Create pricing page
- [ ] 🔲 Implement freemium model
- [ ] 🔲 Launch to users

---

## 🆘 Support

### Documentation
- [Vite Docs](https://vitejs.dev/)
- [ESLint Docs](https://eslint.org/)
- [PWA Guide](https://web.dev/progressive-web-apps/)

### Issues
- Check `WEB_AUDIT_REPORT.md` for known issues
- Review `PROJECT_SCALE_UP_RECOMMENDATIONS.md` for roadmap

---

## ✅ Quick Commands Reference

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Code Quality
npm run lint             # Check code
npm run lint:fix         # Fix code issues
npm run format           # Format all files

# Deployment
npm run deploy           # Deploy to Vercel
npm run clean            # Clean build files
```

---

**Ready to build! 🚀**

Run `npm install` to get started.
