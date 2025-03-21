import Link from "next/link";
import Image from "next/image";

export default function Header() {
    return (
        <div className="relative bg-[#ffccff] py-4 px-8">
            {/* Main header container */}
            <div className="flex justify-between items-center bg-teal-500 h-16 px-8"> {/* Added horizontal padding */}
                {/* Left-aligned navigation buttons */}
                <nav className="flex-1">
                    <ul className="flex space-x-6 ml-1"> 
                        <li>
                            <Link 
                                href="/shop" 
                                className="nav-link px-6 py-3 text-lg border-x-2 border-transparent hover:border-teal-600 hover:shadow-none transition-all"
                            >
                                Shop
                            </Link>
                        </li>
                        <li>
                            <Link 
                                href="/cart" 
                                className="nav-link px-6 py-3 text-lg border-x-2 border-transparent hover:border-teal-600 hover:shadow-none transition-all"
                            >
                                Cart
                            </Link>
                        </li>
                        <li>
                            <Link 
                                href="/instagram" 
                                className="nav-link px-6 py-3 text-lg border-x-2 border-transparent hover:border-teal-600 hover:shadow-none transition-all"
                            >
                                Instagram
                            </Link>
                        </li>
                        <li>
                            <Link 
                                href="/contact" 
                                className="nav-link px-6 py-3 text-lg border-x-2 border-transparent hover:border-teal-600 hover:shadow-none transition-all"
                            >
                                Contact
                            </Link>
                        </li>
                    </ul>
                </nav>

                {/* Right-aligned login button */}
                <div className="flex-1 flex justify-end">
                    <Link
                        href="/login"
                        className="bg-teal-500 text-white px-6 py-2 rounded-md hover:bg-teal-600 transition-colors duration-300 text-lg"
                    >
                        Login
                    </Link>
                </div>
            </div>

            {/* Centered logo and title */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center">
                <Image 
                    src="/rollin-in-dough.jpg"
                    alt="Rollin in Dough Logo" 
                    width={80} 
                    height={80}
                    className="mr-4"
                />
                <h1 className="text-4xl text-[#000080] font-bold font-sans" 
                    style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)" }}>
                    Rollin in Dough
                </h1>
            </div>
        </div>
    );
}