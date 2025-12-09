// ==========================================
// IMAGE MANIFEST & CONSTANTS
// ==========================================

/* 
   INSTRUCTIONS FOR LOCAL IMAGES:
   1. Ensure you have these files in your src/assets/images/ folder:
      - src/assets/images/backgrounds/hero.jpg
      - src/assets/images/bridal/1.jpg
      - src/assets/images/hand/1.jpg
      - src/assets/images/feet/1.jpg
      - src/assets/images/figures/1.jpg
      - src/assets/images/artist.jpg
   
   2. The imports below assume these exact filenames. If your filenames differ, 
      update the import paths accordingly.
*/

// --- 1. IMPORT YOUR IMAGES HERE ---
import heroBg from './assets/optimized/backgrounds/hero.webp';
import bridal1 from './assets/optimized/bridal/1.webp';
import hand1 from './assets/optimized/hand/1.webp';
import hand2 from './assets/optimized/hand/2.webp';
import hand3 from './assets/optimized/hand/3.webp';
import hand4 from './assets/optimized/hand/4.webp';
import hand5 from './assets/optimized/hand/5.webp';
import hand6 from './assets/optimized/hand/6.webp';
import hand7 from './assets/optimized/hand/7.webp';
import hand8 from './assets/optimized/hand/8.webp';
import hand9 from './assets/optimized/hand/9.webp';
import hand10 from './assets/optimized/hand/10.webp';
import hand11 from './assets/optimized/hand/11.webp';
import hand12 from './assets/optimized/hand/12.webp';
import hand13 from './assets/optimized/hand/13.webp';
import hand14 from './assets/optimized/hand/14.webp';
import hand15 from './assets/optimized/hand/15.webp';
import hand16 from './assets/optimized/hand/16.webp';
import hand17 from './assets/optimized/hand/17.webp';
import hand18 from './assets/optimized/hand/18.webp';
import hand19 from './assets/optimized/hand/19.webp';
import hand20 from './assets/optimized/hand/20.webp';
import hand21 from './assets/optimized/hand/21.webp';
import hand22 from './assets/optimized/hand/22.webp';
import hand23 from './assets/optimized/hand/23.webp';
import hand24 from './assets/optimized/hand/24.webp';
import hand25 from './assets/optimized/hand/25.webp';
import hand26 from './assets/optimized/hand/26.webp';
import hand27 from './assets/optimized/hand/27.webp';
import hand28 from './assets/optimized/hand/28.webp';
import hand29 from './assets/optimized/hand/29.webp';
import hand30 from './assets/optimized/hand/30.webp';
import hand31 from './assets/optimized/hand/31.webp';
import hand32 from './assets/optimized/hand/32.webp';
import hand33 from './assets/optimized/hand/33.webp';
import hand34 from './assets/optimized/hand/34.webp';
import hand35 from './assets/optimized/hand/35.webp';
import hand36 from './assets/optimized/hand/36.webp';
import hand37 from './assets/optimized/hand/37.webp';
import hand38 from './assets/optimized/hand/38.webp';
import hand39 from './assets/optimized/hand/39.webp';
import hand40 from './assets/optimized/hand/40.webp';
import hand41 from './assets/optimized/hand/41.webp';
import hand42 from './assets/optimized/hand/42.webp';
import hand43 from './assets/optimized/hand/43.webp';
import hand44 from './assets/optimized/hand/44.webp';
import hand45 from './assets/optimized/hand/45.webp';
import hand46 from './assets/optimized/hand/46.webp';
import feet1 from './assets/optimized/feet/1.webp';
import feet2 from './assets/optimized/feet/2.webp';
import feet3 from './assets/optimized/feet/3.webp';
import feet4 from './assets/optimized/feet/4.webp';
import feet5 from './assets/optimized/feet/5.webp';
import feet6 from './assets/optimized/feet/6.webp';
import fig1 from './assets/images/figures/1.jpg'; // This image was not optimized
import artist from './assets/optimized/artist.webp';


// --- 2. ADD YOUR IMAGES TO THE ASSETS OBJECT ---

export const ASSETS = {
    // Background Images for Home Page
    backgrounds: [heroBg],

    // Branding Images (Optional)
    branding: {
        logo: "https://images.unsplash.com/photo-1621155940027-e4c16a505b82?q=80&w=200&auto=format&fit=crop", // Placeholder logo
        artist: artist,
    },

    // Gallery Categories
    gallery: {
        Bridal: [bridal1],
        Hand: [hand1, hand2, hand3, hand4, hand5, hand6, hand7, hand8, hand9, hand10, hand11, hand12, hand13, hand14, hand15, hand16, hand17, hand18, hand19, hand20, hand21, hand22, hand23, hand24, hand25, hand26, hand27, hand28, hand29, hand30, hand31, hand32, hand33, hand34, hand35, hand36, hand37, hand38, hand39, hand40, hand41, hand42, hand43, hand44, hand45, hand46],
        Feet: [feet1, feet2, feet3, feet4, feet5, feet6],
    },

    // Specific images for Service Cards on Homepage
    services: {
        bridal: bridal1, // Using bridal gallery image for service preview
        arabic: hand2,   // Using hand gallery image for service preview
        guest: hand3     // Using hand gallery image for service preview
    }
};

export const CONTACT = {
    phone: "+919918048575",
    whatsapp: "+919918928267",
    email: "rajumehendiartist3@gmail.com",
    instagram: "rajumehendiartist",
    whatsappLink: `https://wa.me/919918928267?text=${encodeURIComponent("Hi Raju, I'm interested in booking a Mehendi session.")}`
};

export const NAV_LINKS = [
    { name: "Home", path: "/" },
    { name: "Gallery", path: "/gallery" },
    { name: "Services", path: "/services" },
    { name: "Contact", path: "/contact" },
];
