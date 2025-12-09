# Raju Mehendi Artist - Official Website

A premium, dark-themed portfolio website for Raju Mehendi Artist, designed to showcase detailed henna artistry with sophisticated animations and a luxury aesthetic.

## 🌟 Features
- **Royal Dark Theme**: Deep emerald and gold color palette for a premium look.
- **Responsive Design**: Looks perfect on mobile, tablet, and desktop.
- **Gallery**: Categorized image gallery with a lightbox viewer.
- **Services**: Detailed service cards highlighting specialized skills.
- **Animations**: Smooth scroll reveals and parallax effects using Framer Motion.
- **Contact Integration**: Direct WhatsApp booking links and Google Maps integration.
- **Editor Mode**: Upload and delete images directly from the website (requires Firebase).

---

## 🔧 SETTING UP EDITOR MODE (Important)

To make the "Edit Website" button work, you need to connect the site to Google Firebase.

### Step 1: Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Click **"Add project"** and name it "Raju Mehendi".
3. Disable Google Analytics (simpler setup).

### Step 2: Enable Authentication & Database
1. In the sidebar, go to **Build > Authentication**.
   - Click "Get Started".
   - Select **Google**, enable it, and save.
2. Go to **Build > Firestore Database**.
   - Click "Create Database".
   - Select **Start in test mode** (allows read/write for now).
   - Choose a location (e.g., `asia-south1`).
3. Go to **Build > Storage**.
   - Click "Get Started".
   - Select **Start in test mode**.

### Step 3: Get Your Keys
1. Click the **Gear Icon** (Project Settings) > General.
2. Scroll down to "Your apps" and click the web icon (`</>`).
3. Register the app (name it "Website").
4. You will see a `firebaseConfig` object (apiKey, authDomain, etc.).
5. **Copy these keys** into the file `src/firebaseConfig.ts` in your project code.

---

## 📸 HOW TO UPLOAD YOUR OWN IMAGES (Static Method)

If you do not want to use the Editor Mode, you can still add images manually:

### Step 1: Save your photos
1. Create a folder inside your project here: `src/assets/images/`
2. Save all your photos (e.g., `wedding-1.jpg`, `me.jpg`) into that folder.

### Step 2: Main Website Images (Home Page, etc.)
1. Open the file **`src/constants.ts`**.
2. You will see a list of images being exported.
3. Import your photo at the top of the file:
   ```typescript
   import myNewBg from './assets/images/my-bg.jpg';
   ```
4. Scroll down to `export const IMAGES` and replace the link:
   ```typescript
   // Change this:
   heroBg: "https://unsplash.com/...",
   // To this:
   heroBg: myNewBg,
   ```

### Step 3: Gallery Images (The big grid)
1. Open the file **`src/pages/Gallery.tsx`**.
2. Import your photo at the top:
   ```typescript
   import design1 from '../assets/images/design-1.jpg';
   ```
3. Scroll down to `const BASE_ITEMS`.
4. Add a new line for your image:
   ```typescript
   { id: 20, src: design1, category: 'Bridal' },
   ```

---

## 🚀 Deployment Guide (Hostinger)

Follow these steps to host this website on Hostinger or any standard web hosting cPanel.

### Step 1: Prepare the Build
1. Open your terminal in the project folder.
2. Run the build command:
   ```bash
   npm run build
   ```
   *This creates a `dist` (or `build`) folder containing the optimized production files.*

### Step 2: Zip the Files
1. Go into the newly created `dist` folder.
2. Select **all files** inside it (`index.html`, `assets` folder, etc.).
3. Right-click and **Compress** (Zip) them into a file named `website.zip`.
   *(Note: Do not zip the parent 'dist' folder, zip the contents inside it)*.

### Step 3: Upload to Hostinger
1. Log in to your **Hostinger hPanel**.
2. Go to **File Manager**.
3. Navigate to the `public_html` folder.
4. Delete default files (like `default.php`) if they exist.
5. Click the **Upload** icon and upload your `website.zip`.

### Step 4: Extract and Live
1. Right-click `website.zip` in File Manager and select **Extract**.
2. Ensure the files (`index.html`, etc.) are directly in `public_html`.
   *(If they extracted into a subfolder, move them out to `public_html`)*.
3. Visit your domain (e.g., `www.rajumehendi.com`). Your site is live!

---

## 📁 Project Structure

- **src/components**: Reusable UI parts (Buttons, Layout, Navbar).
- **src/pages**: Individual page content (Home, Gallery, Services, Contact).
- **src/constants.ts**: Central place for text, links, and image paths.
- **src/firebaseConfig.ts**: Configuration for Editor Mode.
- **src/assets**: Place for your static image files.