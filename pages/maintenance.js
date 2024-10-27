import Link from "next/link";
import Navbar from "@/lib/Navbar";

export default function Maintenance() {
    return (
        <div className="flex flex-col">
            <div className="mx-auto my-16 penn-blue text-center w-64">
                <h1 className="text-xl m-4 penn-red">Website Under Maintenance</h1>
                <p className="penn-blue">QuakerChat services are currently unavailable due to current integrations. We apologize for any inconveniences this has caused.</p>
            </div>
        </div>
    );
};
