import Link from "next/link";
import Navbar from "@/lib/Navbar";

export default function NotFound() {
    return (
        <div className="flex flex-col">
            <Navbar/>
            <div className="mx-auto my-16 penn-blue text-center">
                <h1 className="text-xl m-4">Page Not Found</h1>
                <Link className="hover:underline" href="/connect">Go To Homepage</Link>
            </div>
        </div>
    );
};