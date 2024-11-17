import * as React from "react";
import { FC } from "react";

export default function PricingTable() {
    const categories = [
        { name: "14 ans +", prices: ["20€", "20€", "20€"] },
        { name: "5 - 13 ans", prices: ["10€", "20€", "20€"] },
    ];
    const pricingTypes = ["Adhésion + T-shirt + bow", "Adhésion + T-shirt", "Adhésion + bow"];

    return (
        <div className="overflow-x-auto p-4">
            <table className="min-w-full border-separate border-spacing-4 shadow-lg rounded-md">    
                <thead>
                    <tr className="text-white">
                        <th className="bg-transparent border border-primary-500 text-primary rounded-lg">Catégorie</th>
                        {pricingTypes.map((type, index) => (
                            <th key={index} className="bg-transparent p-4 border border-primary-500 text-primary rounded-lg">
                                {type}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {categories.map((category, index) => (
                        <tr key={index}>
                            <td className="p-4 border border-gray-300 font-semibold rounded-lg">
                                {category.name}
                            </td>
                            {category.prices.map((price, idx) => (
                                <td key={idx} className="p-4 border border-gray-300 text-center rounded-lg">
                                    {price}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
