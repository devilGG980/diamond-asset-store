# How to Install Plugins and Scripts in After Effects

So you’ve just downloaded a cool new tool to speed up your workflow in Adobe After Effects—but now you're looking at a folder of files and don't know where they go. Installing add-ons in After Effects can be confusing because "Plugins," "Scripts," and "Script UI Panels" all live in different folders. In this guide, we’ll break down exactly where everything goes so you can get back to creating.

## 1. What's the Difference?
Before we install, we need to know what we have.
- **Plugins (.aex or .plugin):** These usually add new visual effects (like a glow or a particle system). They appear in the "Effect" menu.
- **Scripts (.jsx or .jsxbin):** These are tools that automate tasks (like centering an anchor point).
- **Script UI Panels:** These are scripts that have a "window" or "panel" you can dock into your workspace.

## 2. How to Install Plugins
Plugins are the most "integrated" add-ons and have their own dedicated folder.

### On Windows:
`C:\Program Files\Adobe\Adobe After Effects 2026\Support Files\Plug-ins`

### On macOS:
`/Applications/Adobe After Effects 2026/Plug-ins`

Simply drag the `.aex` (Windows) or `.plugin` (Mac) file into this folder. It’s a good idea to create a sub-folder inside "Plug-ins" (e.g., "My Custom Tools") to keep things organized. You will need to restart After Effects for the plugin to appear in your "Effect" menu.

## 3. How to Install Scripts
Scripts are different because they don't usually have a permanent "panel" on your screen.

### The Scripts Folder:
`.../Adobe After Effects 2026/Support Files/Scripts`

Drag your `.jsx` or `.jsxbin` files here. To run them, go to **File > Scripts > [Name of Script]**.

## 4. How to Install Script UI Panels (The Best Way)
Most modern scripts (like "Flow" or "Motion 4") are designed to be "Panels" that stay on your screen.

### The ScriptUI Panels Folder:
`.../Adobe After Effects 2026/Support Files/Scripts/ScriptUI Panels`

**Crucial Step:** You must put them in the **ScriptUI Panels** folder, not just the "Scripts" folder. Once installed, restart After Effects and go to **Window > [Name of Script]** (usually at the bottom of the list). Now you can dock the tool anywhere in your layout!

## 5. A Professional Alternative: The ZXP Installer
Many professional tools (like those from aescripts + aeplugins) come as a **.zxp** file. You cannot just "drag and drop" these.

### Using an Installer:
You will need to download a free tool like the **ZXP Installer** or the **aescripts + aeplugins manager**. Simply drag the .zxp file onto the installer, and it will automatically put all the files in the correct folders for you. This is the safest way to install complex tools.

## 6. Speeding Up Your Workflow with Assets
Installing tools makes the *software* better, but your *project* is only as good as the assets you use.

### Discovering EditorVault
While you're customizing your After Effects setup with new plugins and scripts, don't forget about the "content." [EditorVault](https://editorvault.web.app) is an incredible resource for creators. They offer free, high-quality asset packs including transitions, textures, and sound effects that don't require any "installation" at all. You just drag them straight from your folder into your After Effects project. By combining your newly installed scripts with the professional assets from EditorVault, you create a powerful, efficient environment where the technical side of editing never gets in the way of your creativity.

## 7. Troubleshooting: "Script is Not Allowed to Write Files"
If you install a script and get an error message when you try to use it, don't panic. It's a security setting.

### How to Fix:
1. Go to After Effects > Preferences > **Scripting & Expressions**.
2. Check the box that says **"Allow Scripts to Write Files and Access Network."**
3. Most modern scripts need this setting enabled to save your presets or check for updates.

## Conclusion
Installing plugins and scripts is the first step toward becoming an After Effects power user. Once you know where the **Plug-ins**, **Scripts**, and **ScriptUI Panels** folders are, you can customize your workspace to perfectly fit your needs. Just remember to keep your folders organized, and always enable "Allow Scripts to Write Files" in your preferences!

## Key Takeaways
- **Plugins** go in the `Plug-ins` folder (requires restart).
- **Scripts** go in the `Scripts` folder (run via File > Scripts).
- **Script UI Panels** go in the `ScriptUI Panels` folder (run via Window menu).
- Use a **ZXP Installer** for `.zxp` files.
- Enable **"Allow Scripts to Write Files"** in Preferences.
- Use EditorVault to find free assets that complement your new tools.

## Keywords Targeted
- How to install After Effects plugins
- Where is the After Effects Scripts folder
- Installing Script UI Panels AE
- ZXP installer for After Effects
- After Effects scripting preferences
- Free assets for video editors
