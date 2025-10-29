# Export Instructions for VS Code

## How to Export and Set Up This Project

### Step 1: Download/Copy All Files
You need to copy all the files from this Figma Make project to your local machine. The complete file structure should look like this:

```
wreckshop-music-app/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── postcss.config.js
├── tailwind.config.js
├── eslint.config.js
├── index.html
├── main.tsx
├── App.tsx
├── README.md
├── components/
│   ├── [all .tsx files from the components folder]
│   └── ui/
│       └── [all .tsx and .ts files from components/ui]
├── styles/
│   └── globals.css
└── guidelines/
    └── Guidelines.md
```

### Step 2: Set Up the Project in VS Code

1. **Create a new folder** for your project (e.g., `wreckshop-music-app`)

2. **Copy all files** from this Figma Make project into the new folder

3. **Open VS Code** and open the project folder

4. **Install Node.js** (if not already installed):
   - Download from https://nodejs.org/
   - Use version 18 or higher

5. **Open terminal in VS Code** (Terminal → New Terminal)

6. **Install dependencies**:
   ```bash
   npm install
   ```

7. **Start the development server**:
   ```bash
   npm run dev
   ```

8. **Open your browser** to `http://localhost:5173`

### Step 3: Recommended VS Code Extensions

Install these extensions for the best development experience:

- **ES7+ React/Redux/React-Native snippets**
- **TypeScript Importer**
- **Tailwind CSS IntelliSense**
- **Prettier - Code formatter**
- **ESLint**
- **Auto Rename Tag**
- **Bracket Pair Colorizer**

### Step 4: Available Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

### Step 5: Customization

- **Theme colors**: Edit `/styles/globals.css`
- **Components**: Add new components in `/components/`
- **Pages**: Modify existing page components or add new ones
- **Dependencies**: Add new packages with `npm install package-name`

### Troubleshooting

**If you get dependency errors:**
1. Delete `node_modules` folder
2. Delete `package-lock.json`
3. Run `npm install` again

**If TypeScript errors occur:**
1. Make sure all `.tsx` files are properly copied
2. Check that import paths use `./` for relative imports
3. Restart TypeScript server in VS Code (Ctrl+Shift+P → "TypeScript: Restart TS Server")

**If Tailwind styles don't work:**
1. Ensure `globals.css` is imported in `main.tsx`
2. Check that all components are included in `tailwind.config.js` content array

### Notes

- This project uses **Tailwind CSS v4** (alpha) which may have different syntax than v3
- The theme system uses CSS custom properties for easy customization
- All UI components are built on **Radix UI** primitives
- The project includes comprehensive **TypeScript** support
- **Dark/Light mode** is fully implemented with theme persistence

### Support

If you encounter issues:
1. Check the browser console for errors
2. Verify all files were copied correctly
3. Ensure Node.js version is 18+
4. Check that all imports use correct file paths