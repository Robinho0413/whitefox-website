"use client";
import React, { useState } from "react";
import Image from "next/image";
import previousEnabled from "../icons/PreviousEnabled";
import previousDisabled from "../icons/PreviousDisabled";
import nextEnabled from "../icons/NextEnabled";
import nextDisabled from "../icons/NextDisabled";
import { motion } from "framer-motion";

const Carousel = () => {
    // image index state
    const [activeIndex, setActiveIndex] = useState(0);

    // transition direction state
    const [transitionDirection, setTransitionDirection] = useState("next");

    // function to handle next button click
    const handleNext = () => {
        setTransitionDirection("next");
        setActiveIndex((prevIndex) =>
            prevIndex === 2 ? prevIndex : prevIndex + 1
        );
    };

    // function to handle previous button click
    const handlePrevious = () => {
        setTransitionDirection("previous");
        setActiveIndex((prevIndex) =>
            prevIndex === 0 ? prevIndex : prevIndex - 1
        );
    };

    // array for titles and descriptions
    const texts = [
        {
            title: "Immersive gaming experience",
            description:
                "adipisicing elit. Iure doloremque aut ratione eos! Laudantium ipsum velit, modi quae repudiandae, in quidem iste cupiditate sequi expedita placeat quam rerum, optio facilis. Officia iure quo illo eligendi. Perspiciatis voluptatibus itaque natus maiores alias vitae, reprehenderit distinctio cupiditate libero fugiat aut architecto ratione?",
        },
        {
            title: "On demand support when you need it",
            description:
                "doloremque aut ratione eos! Laudantium ipsum velit, modi quae repudiandae, in quidem iste cupiditate sequi expedita placeat quam rerum, optio facilis. Officia iure quo illo eligendi. Perspiciatis voluptatibus itaque natus maiores alias vitae, reprehenderit distinctio cupiditate libero fugiat aut architecto ratione?",
        },
        {
            title: "Accessible and inclusive to all",
            description:
                "Laudantium ipsum velit, modi quae repudiandae, in quidem iste cupiditate sequi expedita placeat quam rerum, optio facilis. Officia iure quo illo eligendi. Perspiciatis voluptatibus itaque natus maiores alias vitae, reprehenderit distinctio cupiditate libero fugiat aut architecto ratione?",
        },
    ];

    // defining text animation
    const textVariants = {
        hidden: {
            opacity: 0,
            x: transitionDirection === "next" ? 100 : -100,
            transition: { duration: 0.5, ease: "easeInOut" },
        },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.5, ease: "easeInOut" },
        },
    };

    // defining stagger text effect
    const textContainerVariant = {
        hidden: {},
        visible: {
            transition: { staggerChildren: 0.1 },
        },
    };

    return (
        <div className="grid h-screen w-full grid-cols-2 items-center justify-between px-[10vw]">
            <motion.div
                className="space-y-8"
                key={activeIndex}
                variants={textContainerVariant}
                initial="hidden"
                animate="visible"
            >
                <div className="pb-8">
                    <motion.h1 variants={textVariants}>
                        {texts[activeIndex].title}
                    </motion.h1>
                </div>
                <div className="pb-8">
                    <motion.p variants={textVariants}>
                        {texts[activeIndex].description}
                    </motion.p>
                </div>
                <div>
                    <button className="px-4 py-2 bg-transparent border-2 border-primary-500 rounded-lg">
                        learn more
                    </button>
                </div>
            </motion.div>
            <div className="relative flex flex-row-reverse items-center justify-start h-[30rem]">
                <motion.div
                    className="absolute z-20 w-[clamp(20rem,_22.5vw,_25rem)] h-full"
                    animate={{
                        opacity:
                            activeIndex === 0
                                ? 1
                                : activeIndex === 1
                                ? 0
                                : 0,
                        x:
                            activeIndex === 0
                                ? "0"
                                : activeIndex === 1
                                    ? "96px"
                                    : "96px",
                        scale:
                            activeIndex === 0
                                ? 1
                                : activeIndex === 1
                                    ? 1.2
                                    : 1.2,
                    }}
                    transition={{
                        duration: 0.5,
                        ease: "easeInOut",
                    }}
                >
                    <Image
                        className="w-[clamp(20rem,_22.5vw,_25rem)] h-full border-2 border-primary-500 rounded-2xl"
                        alt="first image"
                        src={"/images/bg-image.jpg"}
                        fill
                        objectFit="cover"
                    />
                </motion.div>
                <motion.div
                    className="absolute z-10 w-[clamp(20rem,_22.5vw,_25rem)] h-full"
                    animate={{
                        opacity:
                            activeIndex === 0
                                ? 0.66
                                : activeIndex === 1
                                    ? 1
                                    : 0,
                        x:
                            activeIndex === 0
                                ? "-96px"
                                : activeIndex === 1
                                    ? "0"
                                    : "96px",
                        scale:
                            activeIndex === 0
                                ? 0.8
                                : activeIndex === 1
                                    ? 1
                                    : 1.2,
                    }}
                    transition={{
                        duration: 0.5,
                        ease: "easeInOut",
                    }}
                >
                    <Image
                        className="w-[clamp(20rem,_22.5vw,_25rem)] h-full border-2 border-primary-500 rounded-2xl"
                        alt="second image"
                        src={"/images/bg-image.jpg"}
                        fill
                        objectFit="cover"
                    />
                </motion.div>
                <motion.div
                    className="absolute z-0 w-[clamp(20rem,_22.5vw,_25rem)] h-full"
                    animate={{
                        opacity:
                            activeIndex === 0
                                ? 0.33
                                : activeIndex === 1
                                    ? 0.66
                                    : 1,
                        x:
                            activeIndex === 0
                                ? "-192px"
                                : activeIndex === 1
                                    ? "-96px"
                                    : "0",
                        scale:
                            activeIndex === 0
                                ? 0.6
                                : activeIndex === 1
                                    ? 0.8
                                    : 1,
                    }}
                    transition={{
                        duration: 0.5,
                        ease: "easeInOut",
                    }}
                >
                    <Image
                        className="w-[clamp(20rem,_22.5vw,_25rem)] h-full border-2 border-primary-500 rounded-2xl"
                        alt="third image"
                        src={"/images/bg-image.jpg"}
                        fill
                        objectFit="cover"
                    />
                </motion.div>
                <div className="absolute bottom-0 left-0 w-[10rem] z-30 transform translate-y-[5rem] flex justify-between">
                    <button
                        className={`flex items-center justify-center h-[4.5rem] w-[4.5rem] border-2 transition-all ease-in-out ${
                            activeIndex !== 0
                                ? "border-transparent hover:border-primary-500 transform hover:scale-105"
                                : "cursor-default"
                        }`}
                        onClick={handlePrevious}
                    >
                        <Image
                            src={
                                activeIndex !== 0
                                    ? previousEnabled
                                    : previousDisabled
                            }
                            alt="previous icon"
                            className="w-8 h-8"
                        />
                    </button>
                    <button
                        className={`flex items-center justify-center h-[4.5rem] w-[4.5rem] border-2 transition-all ease-in-out ${
                            activeIndex !== 2
                                ? "border-transparent hover:border-primary-500 transform hover:scale-105"
                                : "cursor-default"
                        }`}
                        onClick={handleNext}
                    >
                        <Image
                            src={activeIndex !== 2 ? nextEnabled : nextDisabled}
                            alt="next icon"
                            className="w-8 h-8"
                        />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Carousel;
