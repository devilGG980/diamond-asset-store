const fs = require('fs');
const path = require('path');

const srcDir = 'c:/Users/VANSH SINGH/projects/website/diamond-assets-store/public/assets';
const destDir = 'c:/Users/VANSH SINGH/projects/website/diamond-assets-store/public/blog-images';

const moves = [
    { src: 'ASSET (18).png', dest: 'dmc5-vfx.png' },
    { src: 'ASSET (19).png', dest: 'realism-vfx.png' },
    { src: 'ASSET (20).png', dest: 'green-screen-basics.png' }
];

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

moves.forEach(file => {
    const oldPath = path.join(srcDir, file.src);
    const newPath = path.join(destDir, file.dest);
    if (fs.existsSync(oldPath)) {
        fs.copyFileSync(oldPath, newPath); // using copy to be safe
        console.log(`Copied ${file.src} to ${file.dest}`);
    } else {
        console.log(`File not found: ${file.src}`);
    }
});
