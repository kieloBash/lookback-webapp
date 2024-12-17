'use client'
import { CherryIcon, CoffeeIcon, DumbbellIcon, GuitarIcon, HardHatIcon, HopIcon, HouseIcon, PizzaIcon, ShirtIcon } from 'lucide-react'
import React from 'react'

const UiCategoriesIcon = ({ icon, className = "size-5" }: { icon: string, className?: string }) => {
    switch (icon) {
        case "Shirt":
            return <ShirtIcon className={className} />;
        case "Food":
            return <PizzaIcon className={className} />;
        case "Drinks":
            return <CoffeeIcon className={className} />;
        case "House":
            return <HouseIcon className={className} />;
        case "Hat":
            return <HardHatIcon className={className} />;
        case "Fruit":
            return <CherryIcon className={className} />;
        case "Vegetable":
            return <HopIcon className={className} />;
        case "Gym":
            return <DumbbellIcon className={className} />;
        case "Instruments":
            return <GuitarIcon className={className} />;
    }
}

export default UiCategoriesIcon