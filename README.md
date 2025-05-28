# 🎯 Contest Radar

A modern, responsive web application for tracking upcoming coding contests from various competitive programming platforms.

## ✨ Features

- 🏠 **Beautiful Homepage** - Hero section with real-time statistics and contest previews
- 📅 **Contest Listings** - Display upcoming contests from Codeforces API
- 🔍 **Search & Filter** - Find contests by name with real-time search
- 📱 **Responsive Design** - Optimized for desktop, laptop, tablet, and mobile
- ⚡ **Fast & Modern** - Built with React and Vite for optimal performance
- 🎨 **Professional UI** - Modern design system with smooth animations
- 📧 **Contact Form** - Send messages directly via EmailJS integration
- ❓ **FAQ Section** - Common questions and answers
- 📊 **About Page** - Detailed information about the platform

## 🚀 Tech Stack

- **Frontend**: React 18, React Router DOM
- **Styling**: CSS3 with modern features, CSS Grid, Flexbox
- **Build Tool**: Vite
- **Email Service**: EmailJS (for contact form)
- **API**: Codeforces Contest API
- **Icons**: Emoji-based for universal compatibility

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd contest_radar
```

2. Install dependencies:
```bash
cd client
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Open browser and navigate to `http://localhost:5173`

## 📧 Email Setup (Optional)

To enable the contact form to send emails to your inbox:

1. Create a free EmailJS account at https://www.emailjs.com/
2. Create an email service and template
3. Create a `.env` file in the `client` directory with your credentials:
```bash
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

**Note**: The contact form will work without setup, but emails won't be sent until EmailJS is configured.

## 📱 Pages

1. **Home** (`/`) - Hero section, statistics, features, platform showcase
2. **Contests** (`/contests`) - Browse and search upcoming contests
3. **About** (`/about`) - Mission, features, team information
4. **Contact** (`/contact`) - Contact form, FAQ, social links

## 🎨 Design Features

- **Modern gradient backgrounds** with professional dark themes
- **Responsive grid layouts** optimized for all screen sizes
- **Smooth hover animations** with hardware acceleration
- **Loading states** and error handling
- **Form validation** and user feedback
- **Mobile-first responsive design**

## 🔧 Performance Optimizations

- Hardware-accelerated animations
- Optimized images and icons
- Efficient CSS with CSS custom properties
- Fast API calls with proper error handling
- Responsive images and layouts
- Smooth scrolling and font rendering

## 🌐 Browser Support

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

## 📈 Future Enhancements

- More platform integrations (LeetCode, AtCoder, etc.)
- User accounts and favorites
- Calendar integration
- Contest reminders
- Dark/light theme toggle
- Progressive Web App (PWA) features

## 🚀 Live Demo

🌐 **[View Live Demo](https://your-username.github.io/contest-radar)**

*Replace with your actual deployment URL*

## 📦 Deployment

### Deploy to GitHub Pages

1. Install the gh-pages package:
```bash
cd client
npm install --save-dev gh-pages
```

2. Add deployment scripts to your `package.json`:
```json
{
  "homepage": "https://your-username.github.io/contest-radar",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. Deploy:
```bash
npm run deploy
```

### Deploy to Netlify/Vercel

1. Build the project:
```bash
npm run build
```

2. Upload the `dist` folder to your hosting platform or connect your GitHub repository for automatic deployments.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Contact

- Use the contact form on the website
- GitHub: [subhajitlucky](https://github.com/subhajitlucky)

## 📄 License

MIT License - see LICENSE file for details

---

**Built with ❤️ for the competitive programming community**