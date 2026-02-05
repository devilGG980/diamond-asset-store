const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/VANSH SINGH/projects/website/diamond-assets-store/public/blog-images';

const mapping = [
    { src: 'unnamed.jpg', dest: 'thumbnail-tutorial.jpg' },
    { src: 'unnamed (1).jpg', dest: 'workflow-optimization.jpg' },
    { src: 'unnamed (2).jpg', dest: 'iphone-editing-apps.jpg' },
    { src: 'unnamed (3).jpg', dest: 'iphone-video-editing.jpg' },
    { src: 'unnamed (4).jpg', dest: 'remote-editing-workspace.jpg' },
    { src: 'unnamed (5).jpg', dest: 'video-editing-course.jpg' },
    { src: 'unnamed (6).jpg', dest: 'final-cut-windows.jpg' },
    { src: 'unnamed (7).jpg', dest: 'tiktok-video-editing.jpg' },
    { src: 'unnamed (8).jpg', dest: 'editing-pc-system.jpg' },
    { src: 'unnamed (9).jpg', dest: 'editing-laptop.jpg' },
    { src: 'unnamed (10).jpg', dest: 'vsdc-editor-interface.jpg' },
    { src: 'unnamed (11).jpg', dest: 'color-accurate-monitor.jpg' },
    { src: 'unnamed (12).jpg', dest: 'youtube-thumbnail-dimensions.jpg' },
    { src: 'unnamed (13).jpg', dest: 'mrbeast-thumbnail-analysis.jpg' },
    { src: 'unnamed (14).jpg', dest: 'fortnite-thumbnail-design.jpg' },
    { src: 'unnamed (15).jpg', dest: 'thumbnail-concept-visual.jpg' },
    { src: 'unnamed (16).jpg', dest: 'youtube-thumbnail-download.jpg' },
    { src: 'unnamed (17).jpg', dest: 'instagram-video-dimensions.jpg' },
    { src: 'unnamed (18).jpg', dest: 'thumbnail-sketch-drawing.jpg' },
    { src: 'unnamed (19).jpg', dest: 'vfx-compositing-example.jpg' },
    { src: 'unnamed (20).jpg', dest: 'film-vfx-production.jpg' },
    { src: 'unnamed (21).jpg', dest: 'blood-effect-compositing.jpg' }
];

mapping.forEach(file => {
    const oldPath = path.join(dir, file.src);
    const newPath = path.join(dir, file.dest);
    if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
        console.log(`Renamed ${file.src} to ${file.dest}`);
    } else {
        console.log(`File not found: ${file.src}`);
    }
});
