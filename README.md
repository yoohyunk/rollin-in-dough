# Rollin' in Dough 🍪

An online cookie store platform connecting a passionate home baker with customers with a sweet tooth. Built with React and Node.js web application that allows customers to choose and buy from a variety of cookies.

## Deploy on Vercel
[Vercel Platform](https://rollin-in-dough.vercel.app/) - Live Demostration

## Features 

### Core Functionality
- **Auth System**:
  - **Cookie-Based Authorization**:
    - **Implementation**: Automatically sets a secure, HTTP-only cookie using the Set-Cookie header to protect sensitive endpoints.
    - **Purpose**: Ensures that each request for secure data includes the proper authorization token.
  - **Customer Synchronization**:
    - **Implementation**: Square is used to create customer records, which are then synchronized with Firebase Auth.
    - **Purpose**: To link Square customer data with Firebase Auth for simplified customer record management.
  - **Authentication Options**:
    - Supports both Google and email/password login, ensuring flexible sign-in options.
  - **Firebase Management**:
    - Firebase is used to manage authentication and user data.
  - **Seamless State Management**:
    - Ensures cohesive state management and smooth transitions between guest and logged-in states.

- **Cart System**:
  - **Hybrid Storage Model**:
    - **Implementation**: Integrates LocalStorage for guests and Firestore for logged-in users.
    - **Purpose**: Allows cart data to persist locally until the user logs in, at which point it is synced to Firestore.
  - **Real-Time Adjustments**:
    - **Implementation**: Ensures that cart contents are instantly updated as changes are made.
    - **Purpose**: Handles the cart contents and ensures they are updated in real-time as modifications occur.
  - **Automatic Cart Merging**:
    - **Implementation**: Merges local cart data with the Firestore cart when the customer logs in.
    - **Purpose**: Guarantees no data is lost, providing an optimized and efficient shopping experience.

- **Order Management**:
  - **Square API Integration for Checkout**:
    - **Implementation**: Employs the Square API to create orders, process payments, and redirect users to the Square Checkout URL.
  - **Order History Tracking**:
    - A detailed history of orders is maintained for customer reference and management.

### UX Features
 **Responsive Web Design**:
  - Guarantees consistent user experience across devices.
- **Interactive Product Cards**:
  - Enhances user engagement with dynamic, clickable product displays.
- **Social Media Integration**:
  - Facilitates sharing and connectivity, allowing users to integrate with social sites such as Instagram.

## Tech Stack

### Frontend
- **Framework**: Next.js 
- **Styling**: Tailwind CSS + Custom Theme

### Backend
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **Square SDK**: Utilized for managing customer information, handling catalog operations, processing checkouts, and managing orders.

### DevOps
- **Hosting**: Deployed on Vercel, guaranteeing reliable and scalable web hosting.

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


