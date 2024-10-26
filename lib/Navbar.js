import Link from "next/link";

const Navbar = () => {
    return (
        <div className="flex flex-col text-4xl m-4">
            <div className="flex flex-row justify-between penn-font-400">
                <div className="text-sm invisible p-1 px-2">
                    Homepage
                </div>
                <div className="flex flex-row">
                    <h1 className="penn-red">Quaker</h1><h1 className="penn-blue">Chat</h1>
                </div>
                <div className="text-sm my-auto p-1 px-2 hover:bg-gray-100 rounded-full border penn-blue-border">
                    <Link href="/connect">Homepage</Link>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
