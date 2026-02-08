# How to Use After Effects Expressions for Basic Automation

If you’ve ever felt like you’re doing the same tedious tasks over and over in After Effects—like making an object bounce or rotate constantly—then it’s time to learn about Expressions. Expressions are small bits of code based on JavaScript that allow you to automate properties without setting a single keyframe. Don't worry, you don't need to be a programmer to use them!

## 1. What are Expressions?
In After Effects, an expression is a way to link properties together or use math to drive an animation.

### The Power of Automation
Imagine you want a light to flicker for 10 minutes. Doing that with keyframes would take forever. With a single line of code (an expression), you can make it happen in five seconds.

### How to Add an Expression
To add an expression, hold the **Alt** (Windows) or **Option** (Mac) key and click the **Stopwatch** icon next to any property. A text box will appear in your timeline where you can type your code.

## 2. The "Wiggle" Expression: Adding Life
The `wiggle` expression is the most famous and useful one in After Effects. It adds random movement to any property.

### How it Works
The syntax is `wiggle(frequency, amplitude)`. 
- **Frequency:** How many times per second it wiggles.
- **Amplitude:** How far it moves (in pixels, degrees, or percentage).

### Example
Typing `wiggle(5, 50)` on the Position property will make the layer shake 5 times a second by up to 50 pixels. It’s perfect for handheld camera effects or vibrating text.

## 3. The "Time" Expression: Constant Motion
If you want something to move or rotate forever at a steady speed, use the `time` expression.

### Simple Math
The `time` expression returns the current time of the composition in seconds. If you want a gear to rotate, you could type `time * 100` into the Rotation property. This tells After Effects to rotate the object 100 degrees for every second that passes.

### Why It’s Useful
It’s great for background elements like spinning stars, ticking clock hands, or moving clouds. No keyframes required, and it never ends!

## 4. The "LoopOut" Expression: Endless Cycles
Have you ever created a perfect 1-second animation and then had to copy-paste the keyframes for the rest of the project? Never do that again.

### Creating a Loop
Set your keyframes for one cycle of the movement. Then, add this expression: `loopOut()`. After Effects will now repeat those keyframes indefinitely.

### Different Loop Types
- `loopOut("cycle")`: Restarts from the beginning (default).
- `loopOut("pingpong")`: Plays forward, then backward, then forward again.

## 5. The Pick Whip: Linking Properties
You don't always have to write code. The Pick Whip is a visual way to create expressions.

### Parent-Child Relationships
Want the scale of one layer to always match the opacity of another? Click the spiral icon (the Pick Whip) next to the Scale property and drag it to the Opacity property of the other layer. After Effects will write the expression for you!

## 6. Real-World Applications
Expressions aren't just for cool tricks; they solve real production problems.

### Keeping Text Centered
You can use expressions to ensure that a background box always resizes itself to fit the length of the text inside it. This is essential for creating "Responsive Design" templates.

### Speeding Up with Assets
While expressions automate the *movement*, you still need high-quality *content* to animate. If you’re building complex rigs, you can save a ton of time by using professional assets. Check out [EditorVault](https://editorvault.web.app) for a wide range of free assets and tools that you can use alongside your expressions. Using a pre-made asset from EditorVault and adding a `wiggle` or `loopOut` expression is a pro-level shortcut to high-end results.

## 7. Troubleshooting Expressions
Sometimes expressions "break" and show a yellow warning banner.

### Common Errors
- **Missing Semicolons:** While not always required, it’s good practice to end lines with `;`.
- **Case Sensitivity:** `Wiggle` (with a capital W) will not work. It must be `wiggle`.
- **Value Mismatch:** You can't link a property with one value (like Opacity) to one with two values (like Scale [x, y]) without specifying which value you want.

## Conclusion
Expressions might seem scary at first, but mastering just the `wiggle`, `time`, and `loopOut` functions will put you in the top 10% of After Effects users. They save time, reduce file size, and make your projects much easier to edit later.

## Key Takeaways
- Alt-click the stopwatch to start an expression.
- Use `wiggle(freq, amp)` for random motion.
- Use `time * multiplier` for constant, unending motion.
- Use `loopOut()` to repeat keyframes forever.
- Link properties visually using the Pick Whip.
- Combine expressions with free assets from EditorVault for maximum efficiency.

## Keywords Targeted
- After Effects expressions for beginners
- How to use wiggle expression AE
- After Effects automation
- loopOut expression tutorial
- Time expression After Effects
- Free After Effects tools
