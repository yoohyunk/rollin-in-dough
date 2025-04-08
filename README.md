# Rollin' in Dough 🍪

An online cookie store platform connecting a passionate home baker with customers with a sweet tooth. Built with React and Node.js web application that allows customers to choose and buy from a variety of cookies.

## Deploy on Vercel
[Vercel Platform](https://rollin-in-dough.onrender.com) - Live Demostration

## Features 

### Core Functionality
- **Auth System**: 
  - Google & email/password authentication
  - Firebase management
  - Seamless guest/login state management

- **Cart System**:
  - Hybrid storage (LocalStorage + Firebase sync)
  - Real-time adjustment updates
  - Automatic merging of carts

- **Order Management**:
  - Square API integration for payments
  - Order history tracking

### UX Features
- WebDev responsive design
- Interactive product cards
- Social media integration

## Tech Stack

### Frontend
- **Framework**: Next.js 
- **Styling**: Tailwind CSS + Custom Theme

### Backend
- **Authentication**: Firebase Auth
- **Database**: Firestore

### DevOps
- **Hosting**: Vercel

## Project Structure

```bash
rollin-in-dough/
├── app/
│   ├── (tabs)/              # Navigation sections
│   │   ├── cart/
│   │   ├── contact/
│   │   ├── instagram/
│   │   └── shop/
│   ├── about/               # About section
│   ├── api/                 # API endpoints
│   ├── Context/             # Context providers
│   ├── order/[id]/          # Order details
│   ├── orders/              # Orders section
│   ├── profile/             # User profile section
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/              # Reusable components
├── firebase/                # Firebase configuration
├── lib/                     # Utility functions
├── public/                  # Static assets
├── types/
└── package.json             # Project dependencies
```

### Getting Started

1. **Clone repository**
```bash
git clone https://github.com/yoohyunk/rollin-in-dough.git
cd rollin-in-dough


2. **Install dependencies**
```bash
npm install
npm firebase

3. **Start development server**
```bash
npm run dev
```
## Learn More
To learn more about Our Project you can check out [the GitHub repository](https://github.com/yoohyunk/rollin-in-dough?tab=readme-ov-file) - your feedback is welcomed!

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Team
Leona Motyer, Yoohyun Kim, Nawal Mohamuud


