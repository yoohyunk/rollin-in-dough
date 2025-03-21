import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <div>
      {/* Logo and Title Section */}
      <div className="flex flex-row items-center justify-center py-6 bg-[#ffccff]">
        <Image 
          src="/rollin-in-dough.jpg"
          alt="Rollin in Dough Logo" 
          width={100} 
          height={100}
          className="mr-4"
        />
        
        <h1 className="text-5xl text-[#000080] font-sans" 
           style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}>
          Rollin in Dough
        </h1>
      </div>
      
      {/* Navigation Header Section */}
      <header className="site-header">
        <nav className="container mx-auto flex justify-center items-center">
          <ul className="flex space-x-8">
            <li><Link href="/" className="nav-link">Home</Link></li>
            <li><Link href="/(tabs)/menu" className="nav-link">View Menu</Link></li>
            <li><Link href="/cart" className="nav-link">View Cart</Link></li>
            <li><Link href="/checkout" className="nav-link">Checkout</Link></li>
          </ul>
        </nav>
      </header>
    </div>
  );
}