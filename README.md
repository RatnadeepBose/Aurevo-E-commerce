# 🌿 AUREVO - Premium Unisex Essentials

> **Where inclusive minimalist design meets conscious luxury**

A premium e-commerce website for sustainable, unisex fashion essentials. Built with modern web technologies and integrated with Google Sheets for seamless order management.

![AUREVO Banner](https://via.placeholder.com/1200x400/005A2B/FFFFFF?text=AUREVO+-+Conscious+Luxury)

## ✨ Features

### 🛍️ **E-Commerce Core**
- **Premium Product Catalog** with responsive image carousels
- **Smart Shopping Cart** with localStorage persistence
- **Wishlist Functionality** with heart animations
- **Secure Checkout Process** with form validation
- **Real-time Notifications** with premium animations

### 🎨 **Design & UX**
- **Minimalist Premium Design** inspired by luxury brands
- **Rolex Green & Gold** color scheme
- **Mobile-First Responsive** design
- **Premium Typography** with Google Fonts integration
- **Smooth Animations** and micro-interactions

### 🔧 **Technical Features**
- **Google Sheets Integration** for order management
- **Email Notifications** for customers and store owner
- **PIN Code Validation** (Jalpaiguri - 735101 only)
- **Terms & Conditions Modal** with acceptance tracking
- **Loading States** and error handling

### 🌱 **Business Logic**
- **Conscious Luxury Branding** - sustainable fashion focus
- **Unisex Products** - inclusive design for everyone
- **Local Delivery** - Jalpaiguri area only (PIN: 735101)
- **Prepaid Orders** - secure payment processing
- **Executive Confirmation** - phone call verification system

## 🚀 Live Demo

- **Website**: [Your GitHub Pages URL]
- **Admin Panel**: [Your Google Sheets URL]

## 📁 Project Structure

```
aurevo-premium-ecommerce/
├── 📄 index.html              # Homepage with product grid
├── 🛍️ product1.html          # Heritage Crewneck product page
├── 🛍️ product2.html          # Oversized Comfort product page
├── 🛒 checkout.html           # Secure checkout page
├── 🎨 style.css               # Main stylesheet
├── 🎨 checkout.css            # Checkout page styles
├── 🎨 product-page.css        # Product page styles
├── ⚙️ script.js               # Homepage functionality
├── ⚙️ cart-wishlist.js        # Cart & wishlist management
├── ⚙️ checkout.js             # Checkout process & validation
├── ⚙️ product-page.js         # Product page interactions
├── ⚙️ simple-carousel.js      # Image carousel functionality
├── ⚙️ simple-product-carousel.js # Product carousel
├── ☁️ google-apps-script.gs   # Google Apps Script for orders
├── 📚 SETUP_INSTRUCTIONS.md   # Detailed setup guide
└── 📄 README.md               # This file
```

## 🛠️ Quick Setup

### Prerequisites
- Web browser (Chrome, Firefox, Safari, Edge)
- Google account (for order management)
- Text editor (VS Code recommended)

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/aurevo-premium-ecommerce.git
cd aurevo-premium-ecommerce
```

### 2. Set Up Google Sheets Integration
1. Create a new Google Sheet at [sheets.google.com](https://sheets.google.com)
2. Copy the Sheet ID from the URL
3. Go to [script.google.com](https://script.google.com)
4. Create a new project and paste the code from `google-apps-script.gs`
5. Replace `YOUR_SHEET_ID_HERE` with your Sheet ID
6. Deploy as Web App with "Anyone" access
7. Copy the Web App URL and update `checkout.js` line 14

### 3. Configure the Website
1. Open `checkout.js`
2. Replace `YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE` with your Web App URL
3. Optionally update the store email in the Google Apps Script

### 4. Deploy to GitHub Pages
1. Push your code to GitHub
2. Go to Repository Settings > Pages
3. Select "Deploy from a branch" > "main"
4. Your site will be live at `https://YOUR_USERNAME.github.io/aurevo-premium-ecommerce`

## 📖 Detailed Setup Guide

For complete setup instructions, see [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md)

## 🎯 Key Technologies

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: Custom CSS with CSS Grid & Flexbox
- **Fonts**: Google Fonts (Playfair Display, Cormorant Garamond, Source Sans 3)
- **Backend**: Google Apps Script
- **Database**: Google Sheets
- **Hosting**: GitHub Pages
- **Version Control**: Git & GitHub

## 🛒 Order Management

### Customer Journey
1. Browse products on homepage
2. View product details with image carousel
3. Select size, color, and add to cart/wishlist
4. Proceed to secure checkout
5. Fill delivery details (PIN 735101 validation)
6. Accept Terms & Conditions
7. Place order (generates unique Order ID)
8. Receive confirmation email
9. Executive calls for payment confirmation

### Admin View (Google Sheets)
- **Orders Sheet**: Complete customer and order information
- **Order Items Sheet**: Individual product details per order
- **Email Notifications**: Automatic customer confirmations and admin alerts

## 🎨 Customization

### Brand Colors
```css
--rolex-green: #005A2B;      /* Primary Brand Color */
--luxury-gold: #D4AF37;      /* Accent Gold */
--rolex-light: #1E8449;      /* Hover States */
--background: #F8F8F5;       /* Soft Background */
```

### Typography
- **Display**: Playfair Display (headings)
- **Heading**: Cormorant Garamond (subheadings)
- **Body**: Source Sans 3 (content)

### Adding New Products
1. Create new product HTML file (e.g., `product3.html`)
2. Update the product grid in `index.html`
3. Add product data to `cart-wishlist.js`
4. Update image sources and product information

## 📱 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🔒 Security Features

- **Input Validation**: All forms validated client and server-side
- **CORS Protection**: Secure API endpoints
- **Data Encryption**: HTTPS-only communication
- **PIN Validation**: Geographic delivery restriction
- **Terms Acceptance**: Legal compliance tracking

## 📈 Analytics & Tracking

The site is ready for:
- Google Analytics integration
- Conversion tracking
- User behavior analysis
- A/B testing capabilities

## 🌱 Environmental Impact

AUREVO promotes:
- **Sustainable Materials**: Organic cotton and recycled polyester
- **Conscious Consumption**: Quality over quantity
- **Local Delivery**: Reduced carbon footprint
- **Unisex Design**: Inclusive fashion reducing waste

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Developer

**Website developed and managed by [Ratnadeep Bose](https://ratnadeepbose.github.io/portfolio-ratnadeep/)**

## 📞 Support

For setup help or customization requests:
- 📧 Email: 
- 💬 GitHub Issues:
- 📱 WhatsApp: 

## 🚀 Deployment Status

- ✅ **Development**: Local testing complete
- ✅ **Staging**: GitHub repository ready
- 🔄 **Production**: Deploy to GitHub Pages
- 📊 **Monitoring**: Google Sheets integration active

---

<div align="center">

**🌿 AUREVO - Conscious Luxury 🌿**

*Where inclusive minimalist design meets conscious luxury*

Made with 💚 for sustainable fashion

</div>