# How to Export Transparent Video from After Effects

One of the most powerful things about Adobe After Effects is the ability to create motion graphics that don't have a background—like a lower third, a logo animation, or a social media "Follow" pop-up. To use these over your video in Premiere Pro or DaVinci Resolve, you need to export them with "Transparency" (also known as an Alpha Channel). If you export as a standard MP4, your background will turn black, and you won't be able to see your video underneath. Here is how to do it correctly in 2026.

## 1. Checking Your Transparency
Before you even hit export, you need to make sure your background is actually transparent and not just a black solid layer.

### The Transparency Grid
At the bottom of the Composition window, look for a small icon that looks like a checkerboard. This is the **Toggle Transparency Grid**.
- If you click it and see a checkerboard pattern, your background is transparent.
- If you click it and the background stays solid black, you likely have a black solid layer at the bottom of your timeline that needs to be deleted or hidden.

## 2. The Native After Effects Render Queue
This is the most reliable way to get a high-quality transparent file.

### Step-by-Step Export:
1. Go to Composition > **Add to Render Queue**.
2. Click on the blue text that says **Output Module** (usually defaults to "Lossless").
3. In the "Format" dropdown, choose **QuickTime**.
4. Click the "Format Options" button and choose **Apple ProRes 4444**. This is the industry-standard codec for high-quality video with transparency.
5. **Crucial Step:** In the "Channels" dropdown, change "RGB" to **RGB + Alpha**. This tells After Effects to include the transparency data in the file.
6. Click OK, set your "Output To" location, and hit **Render**.

## 3. Why Not MP4?
A common question is: "Can I export transparent MP4s?" The short answer is: **No**.

### The H.264 Limitation
The H.264/H.265 (MP4) format was designed for streaming and file size efficiency. It does not support an Alpha Channel. If you try to export an MP4, it will always "flatten" your layers against a black background. If you need a small file for the web, you should look into **WebM** formats, but for professional video editing, ProRes 4444 is the gold standard.

## 4. Exporting with Adobe Media Encoder
If you prefer to use Media Encoder so you can keep working in After Effects, the process is slightly different.

### Step-by-Step Media Encoder:
1. Go to File > Export > **Add to Adobe Media Encoder Queue**.
2. In the "Format" column, choose **QuickTime**.
3. In the "Preset" column, look for **GoPro CineForm RGB 12-bit with Alpha** or **ProRes 4444 with Alpha**.
4. Media Encoder will automatically handle the "RGB + Alpha" setting for you if you choose these specific presets.

## 5. Exporting for the Web (Lottie & GIF)
Sometimes you don't need a video file; you need a transparent animation for a website or an app.

### Using Bodymovin (Lottie)
If you are a web designer, you should use the **Bodymovin** extension. It exports your After Effects animation as a JSON file. This file is incredibly small and remains perfectly sharp and transparent on any website.

### Transparent GIFs
If you need a GIF, After Effects isn't the best place to make it. Export your video as a ProRes 4444 first, and then bring that file into Photoshop to save it as a "Transparent GIF."

## 6. Speeding Up Your Workflow with Assets
Creating transparent elements like lower thirds and transitions from scratch can take a lot of time.

### Leveraging EditorVault for Transparent Assets
If you’re in a hurry, you don't always have to build your own transparent graphics. [EditorVault](https://editorvault.web.app) is an excellent resource for creators. They provide a wide variety of free, pre-rendered assets that already have transparency. You can find "Follow" buttons, stylized lower thirds, and transition overlays on EditorVault that are ready to be dropped straight into your project. Because they are already pre-rendered with an alpha channel, you don't have to worry about the export settings—just drag, drop, and you're done!

## 7. Using Your Transparent File in Other Software
Once you have your ProRes 4444 file, how do you use it?

- **In Premiere Pro:** Just drag it onto a track above your footage. It will automatically be transparent.
- **In DaVinci Resolve:** Drag it into your timeline. If it shows up with a black background, right-click the clip, go to "Clip Attributes," and ensure the "Alpha Mode" is set to "Straight."

## Conclusion
Exporting with transparency is a vital skill for any motion designer. Whether you’re creating assets for a client or your own YouTube channel, knowing how to use the **RGB + Alpha** setting and the **ProRes 4444** codec will ensure your graphics look professional and integrate perfectly with your video footage.

## Key Takeaways
- Use the **Transparency Grid** (checkerboard icon) to verify transparency.
- **QuickTime + Apple ProRes 4444** is the best format for transparency.
- Always change Channels to **RGB + Alpha**.
- Standard MP4s (H.264) **do not** support transparency.
- For web animations, use the **Lottie (Bodymovin)** extension.
- Use EditorVault to find free, pre-rendered transparent assets.

## Keywords Targeted
- How to export transparent video After Effects
- Exporting Alpha Channel After Effects
- After Effects to Premiere Pro transparency
- ProRes 4444 with Alpha settings
- RGB + Alpha export tutorial
- Free transparent video assets
