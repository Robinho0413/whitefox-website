"use client";

import React, { useState, useEffect } from 'react';

interface CarouselItemProps {
    item: {
        id: number;
        name: string;
        description: string;
        image: string;
    };
    isActive: boolean;
}

const CarouselItem: React.FC<CarouselItemProps> = ({ item, isActive }) => (
    <div className={`relative flex-shrink-0 w-full h-64 md:h-96 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 absolute top-0 left-0'}`}>
        <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 overflow-hidden rounded-b-lg">
            <h3 className="text-white text-xl font-bold">{item.name}</h3>
            <p className="text-white text-sm mt-1">{item.description}</p>
        </div>
    </div>
);

const Carousel = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    const items = [
        { id: 1, name: 'Gourmet Burger', description: 'Juicy beef patty with premium toppings', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80' },
        { id: 2, name: 'Margherita Pizza', description: 'Classic Italian pizza with fresh mozzarella', image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80' },
        { id: 3, name: 'Sushi Platter', description: 'Assorted fresh sushi and sashimi', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80' },
        { id: 4, name: 'Grilled Salmon', description: 'Perfectly grilled salmon with lemon butter', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80' },
    ];

    const nextSlide = () => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % items.length);
    };

    const prevSlide = () => {
        setActiveIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (touchStart - touchEnd > 50) {
            nextSlide();
        }
        if (touchStart - touchEnd < -50) {
            prevSlide();
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full max-w-4xl mx-auto ">
            <div className='overflow-hidden'>
                <div
                    className="flex transition-transform duration-300 ease-in-out"
                    style={{ transform: `translateX(-${activeIndex * 100}%)` }}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {items.map((item, index) => (
                        <CarouselItem key={item.id} item={item} isActive={index === activeIndex} />
                    ))}
                </div>
            </div>
            <button
                className="absolute top-1/2 left-4 lg:-left-16 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 duration-100"
                onClick={prevSlide}
                aria-label="Previous slide"
            >
                <img
                    src="/icon/arrowRight.svg"
                    alt="Next"
                    width={26}
                    height={26}
                    className="rotate-180"
                />
            </button>
            <button
                className="absolute top-1/2 right-4 lg:-right-16 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 duration-100"
                onClick={nextSlide}
                aria-label="Next slide"
            >
                <img
                    src="/icon/arrowRight.svg"
                    alt="Next"
                    width={26}
                    height={26}
                />
            </button>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {items.map((_, index) => (
                    <button
                        key={index}
                        className={`w-3 h-3 rounded-full focus:outline-none ${index === activeIndex ? 'bg-white' : 'bg-white bg-opacity-50'}`}
                        onClick={() => setActiveIndex(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Carousel;