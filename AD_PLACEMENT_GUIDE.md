# 📺 Ad Placement Guide - Diamond Assets Store

## Overview
Your Diamond Assets Store now has **6 dedicated ad containers** strategically placed to maximize revenue while providing great user experience.

---

## 🎯 **Ad Container Locations**

### **1. Offer Cards (3 containers)**
Located on each earning offer card in the main ads page.

#### **Container #1: Watch 15s Ad**
- **ID**: `ad-container-watch15`
- **Location**: Inside the "📺 Watch Short Ad" card
- **Size**: 200px minimum height, full card width
- **Best for**: Short video ads, display banners
- **User sees**: Before clicking to watch the 15s ad

#### **Container #2: Watch 30s Ad**
- **ID**: `ad-container-watch30`
- **Location**: Inside the "🎬 Watch & Click Ad" card
- **Size**: 200px minimum height, full card width
- **Best for**: Interactive ads, rich media ads
- **User sees**: Before clicking to watch the 30s ad

#### **Container #3: YouTube Subscribe**
- **ID**: `ad-container-youtube`
- **Location**: Inside the "🔔 Subscribe YouTube" card
- **Size**: 200px minimum height, full card width
- **Best for**: YouTube channel promotions, creator ads
- **User sees**: Before clicking to subscribe

### **2. Ad Watching Modal (2 containers)**
Located in the full-screen modal when users are watching ads.

#### **Container #4: Main Video Ad**
- **ID**: `ad-container-watching-main`
- **Location**: Primary area in ad watching modal
- **Size**: 350px minimum height, responsive width (max 2xl)
- **Best for**: Video ads, large banners, interactive content
- **User sees**: While watching the countdown timer

#### **Container #5: Secondary Banner**
- **ID**: `ad-container-watching-secondary`
- **Location**: Below main ad in watching modal
- **Size**: 120px minimum height, responsive width
- **Best for**: Banner ads, promotional content
- **User sees**: While watching the countdown timer

### **3. Sidebar Ad Container (Existing)**
Your existing permanent ad container on the right side.

#### **Container #6: Permanent Sidebar**
- **ID**: Check your existing AdContainer component
- **Location**: Right sidebar, always visible
- **Size**: Fixed width sidebar
- **Best for**: Persistent display ads, affiliate promotions

---

## 🛠 **How to Add Real Ads**

### **Google AdSense Example**
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-XXXXXXXXX"
     data-ad-slot="XXXXXXXXX"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
```

### **Implementation Steps**
1. **Replace placeholder content** in each container
2. **Add your ad network code** (AdSense, Facebook, etc.)
3. **Test each container** individually
4. **Monitor performance** and optimize

### **Recommended Ad Types by Container**

#### **Offer Cards (watch15, watch30, youtube)**
- ✅ Display banners (300x250, 320x100)
- ✅ Native ads
- ✅ Small video ads
- ❌ Avoid full-screen takeovers

#### **Watching Modal (main, secondary)**
- ✅ Video ads (recommended for main)
- ✅ Large banners (728x90, 970x250)
- ✅ Interactive ads
- ✅ Rich media ads

#### **Sidebar (permanent)**
- ✅ Skyscraper ads (160x600, 120x600)
- ✅ Square ads (250x250, 300x300)
- ✅ Sticky ads

---

## 💡 **Revenue Optimization Tips**

### **High-Impact Placement**
1. **Main watching modal** = Highest engagement (users are waiting)
2. **Offer cards** = Good visibility (users browsing offers)
3. **Sidebar** = Persistent but lower engagement

### **Ad Network Recommendations**
- **Google AdSense**: Best for beginners, easy setup
- **Facebook Audience Network**: Good mobile performance
- **Media.net**: Alternative to AdSense
- **PropellerAds**: Pop-unders and native ads
- **AdThrive/Mediavine**: Premium networks (require traffic)

### **Performance Tracking**
- Track **click-through rates** for each container
- Monitor **revenue per container**
- A/B test **different ad sizes and types**
- Use **heatmaps** to see user interaction

---

## 🎨 **Styling Notes**

### **Current Styling**
- All containers have **responsive design**
- **Dark theme compatible**
- **Rounded corners** and **subtle borders**
- **Placeholder text** shows container purpose

### **Customization**
You can modify the styling in `QuickAds.tsx`:
- Change `minHeight` for different ad sizes
- Adjust `className` for custom styling
- Modify `border` and `background` colors

---

## 🚀 **Next Steps**

1. **Choose your ad networks**
2. **Get ad codes** from your chosen networks
3. **Replace placeholder content** in each container
4. **Test thoroughly** on desktop and mobile
5. **Monitor revenue** and optimize

Your Diamond Assets Store is now ready for maximum ad revenue! 💎📈