import ValuesCarousel from "@/components/sections/ValuesCarousel";

export default function Page() {
    return (
        <div className="mt-10 p-16">
            <h1 className="text-3xl font-semibold mb-8 relative inline-block">
                Club
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary-500 animate-underline"></span>
            </h1>
            <div>
                <ValuesCarousel />
            </div>
        </div>
    );
}