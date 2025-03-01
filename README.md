# Interactive Audio-Visual Creative Lab & Canvas Playground

> **Enterprise Software Product by [Taliyo Technologies](https://www.taliyotechnologies.com)**  
> *Architected by Viraj Srivastav ([VirajVerse](https://github.com/virajverse))*

---

## 🌟 Executive Summary
Creative experiment sandbox with dynamic sound integration, particle bursts, reactive canvas physics, and spring animations.

This solution is engineered as a zero-dependency, ultra-performance standalone product ready for client deployment, white-label reselling, or enterprise integration.

- **Product Category**: `Interactive Audio-Visual Labs`
- **Local Port Allocation**: `http://localhost:8880`
- **License**: `Commercial Proprietary // Taliyo Technologies`

---

## 🛠️ Architecture & Tech Stack

### Core Technologies
- **HTML5 Canvas 2D / WebGL**
- **Web Audio API Synthesis**
- **GSAP Motion Suite**
- **Dynamic JSON Project Feeds**
- **Spring Physics Controllers**

### Key Capabilities
- Interactive Canvas 2D / WebGL audio-visual playground
- Dynamic project feed loaded from structured `data/projects.xjson`
- Sound-reactive particle bursts and spring animations
- Interactive client showcase reel with SVG logo integration
- Smooth inertia scrolling with touch and mouse coordination

---

## 🚀 Quick Start Guide

### 1. Zero-Config Local Launch (Windows)
Double-click `start.bat` in this folder. It initializes the local multi-threaded server and opens the application in your default browser automatically.

### 2. Node / NPM Standard Command
```bash
npm start
```

### 3. Command Line (Cross-Platform Python)
```bash
python serve.py
```
Open **[http://localhost:8880](http://localhost:8880)** in any modern web browser.

---

## 🎨 White-Label & Developer Customization

- **Step 1**: Projects Feed: Edit `data/projects.xjson` to add, remove, or modify showcase items
- **Step 2**: Logos & Assets: Replace client SVG logos in `img/` with your portfolio clients
- **Step 3**: Canvas Effects: Modify particle density and spring stiffness in `js/headerAnim.js`

---

## 📂 Repository Structure
```text
├── index.html              # Main application entry point & view markup
├── package.json            # Project manifest, dependencies, and lifecycle scripts
├── serve.py                # Multi-threaded zero-dependency local server
├── start.bat               # 1-click Windows desktop launcher
├── README.md               # Enterprise product documentation & setup guide
├── .gitignore              # Standard version control filter
└── [assets/ / js/ / css/]  # Localized stylesheets, scripts, fonts, 3D meshes, and media
```

---

## 🌐 Production Deployment

This project is fully static and can be deployed in seconds to any production host:
- **Vercel**: Import repository -> Framework: `Other` -> Output Directory: `.`
- **Netlify**: Drag-and-drop root folder or connect Git repository
- **Nginx / Apache / Cloudflare Pages**: Copy root directory to your web root (`/var/www/html`)

---

## 🛡️ Commercial License & Support
Copyright © 2026 **Taliyo Technologies Pvt Ltd**. All rights reserved.  
Commercial re-use, enterprise distribution, and customized builds are governed by Taliyo Technologies software licensing agreements.

For enterprise inquiries, custom feature integration, or volume licensing:
- 🌐 **Corporate Portal**: [https://www.taliyotechnologies.com](https://www.taliyotechnologies.com)
- 📧 **Direct Technical Inquiries**: [virajverse016@gmail.com](mailto:virajverse016@gmail.com)
