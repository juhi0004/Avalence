# Avalene — Intelligence at Scale

Avalene is a modern, high-performance SaaS landing page built for an AI enterprise software company. It features highly interactive 3D WebGL components (React Three Fiber), fluid scroll-triggered animations (GSAP and Framer Motion), and seamlessly integrated CMS capabilities (Sanity) and a robust contact form backend (Firebase).

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS v4
- **Animations:** GSAP (ScrollTrigger), Framer Motion, Lenis Smooth Scroll
- **3D Graphics:** React Three Fiber (R3F)
- **CMS:** Sanity
- **Backend:** Firebase Firestore (for the Contact Form)

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables Configuration
Copy the template `.env.local.example` file into a new file called `.env.local`.
```bash
cp .env.local.example .env.local
```

You must fill in the values in `.env.local` for the CMS and Contact form to fully function.

### 3. Setting Up Sanity CMS (Blog)
1. Go to your terminal and start the Sanity Studio locally:
   ```bash
   npx sanity dev
   ```
2. Follow the prompts. It will give you a **Project ID** and **Dataset** (usually `production`).
3. Add these values to your `.env.local`:
   ```env
   NEXT_PUBLIC_SANITY_PROJECT_ID="your_project_id"
   NEXT_PUBLIC_SANITY_DATASET="production"
   ```
4. Access your local Sanity Studio at `http://localhost:3333` and create a few **Posts**!

---

### 🔥 Setting Up Firebase (Contact Form)
The contact form safely defaults to a "simulated mode" until you link it to a real Firebase database. Here is how to configure it:

**Step 1: Create a Firebase Project**
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add Project** and name it "Avalene".
3. Disable Google Analytics (optional) and create the project.

**Step 2: Register your Web App**
1. On the Firebase dashboard overview, click the **Web icon** (`</>`) to add Firebase to your web app.
2. Register the app with a nickname (e.g., "Avalene Website").
3. Firebase will provide you with a `firebaseConfig` object. Keep this open!

**Step 3: Enable Firestore Database**
1. In the left sidebar under "Build", click **Firestore Database**.
2. Click **Create database**.
3. Choose **Start in production mode**.
4. Choose a Cloud Firestore location (e.g., `nam5` for US).
5. Once created, go to the **Rules** tab and set the rules to allow external writes from your form:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /contacts/{document=**} {
         // Warning: This allows anyone to submit a contact form.
         // In production, you might want to add rate limiting or reCAPTCHA.
         allow write: if true;
         allow read: if false; 
       }
     }
   }
   ```

**Step 4: Add Keys to `.env.local`**
Take the values from the `firebaseConfig` object (from Step 2) and paste them into your `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSy..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="avalene-xxxx.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="avalene-xxxx"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="avalene-xxxx.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="1234567890"
NEXT_PUBLIC_FIREBASE_APP_ID="1:1234567890:web:abcdef..."
```

Your contact form is now live! Submissions will securely appear in your Firestore Database under the `contacts` collection.

---

## 🛠️ Running Locally
Once all your variables are set:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the site.

---

## ☁️ Vercel Deployment Steps
Deploying this Next.js app to Vercel is highly optimized.

1. Create a GitHub repository and push this codebase to it.
2. Go to [Vercel](https://vercel.com/), click **Add New...** -> **Project**.
3. Import your GitHub repository.
4. **Important**: Under **Environment Variables**, you MUST copy/paste all the variables from your `.env.local` file (Firebase and Sanity keys).
5. The `vercel.json` file handles the build commands automatically.
6. Click **Deploy**. Vercel will build the app and assign you a live URL!
