// Clean Project Gallery Data - Fixed and Deduplicated
// Generated: 2025-07-20

const cleanProjectGallery = [
    {
        id: 1,
        title: "Modern Kitchen Remodel - Desert Ridge",
        description: "Complete kitchen transformation with quartz countertops, custom white shaker cabinets, and designer lighting",
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&auto=format",
        alt: "Modern kitchen remodel with white quartz countertops, custom cabinetry, and stainless steel appliances",
        category: "Kitchen",
        completionTime: "3 weeks",
        budget: "$25,000 - $35,000",
        location: "Desert Ridge",
        features: ["Quartz Countertops", "Custom Cabinets", "LED Under-Cabinet Lighting", "Subway Tile Backsplash", "Stainless Steel Appliances", "Soft-Close Drawers"]
    },
    {
        id: 2,
        title: "Luxury Master Bathroom - Old Town",
        description: "Spa-like master bathroom with walk-in glass shower, marble vanity, and smart home features",
        image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&h=600&fit=crop&auto=format",
        alt: "Luxury bathroom renovation with walk-in glass shower, marble vanity, and modern fixtures",
        category: "Bathroom",
        completionTime: "2 weeks",
        budget: "$15,000 - $25,000",
        location: "Old Town Scottsdale",
        features: ["Walk-in Glass Shower", "Heated Tile Floors", "Marble Double Vanity", "Smart Fixtures", "Rain Showerhead", "Built-in Storage"]
    },
    {
        id: 3,
        title: "Custom Laundry Room Organization",
        description: "Transformed basic laundry room into organized, functional space with custom storage and folding station",
        image: "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&h=600&fit=crop&auto=format",
        alt: "Well-organized laundry room with custom storage, folding station, and utility sink",
        category: "Laundry",
        completionTime: "1 week",
        budget: "$5,000 - $10,000",
        location: "McCormick Ranch",
        features: ["Custom Storage Cabinets", "Folding Station", "Utility Sink", "Organization Systems", "Tile Flooring", "Task Lighting"]
    },
    {
        id: 4,
        title: "Walk-in Closet Organization System",
        description: "Custom storage solutions maximizing space with built-in shelving and organization systems",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&auto=format",
        alt: "Walk-in closet with custom organization system and built-in shelving",
        category: "Storage",
        completionTime: "3 days",
        budget: "$3,000 - $8,000",
        location: "Gainey Ranch",
        features: ["Custom Shelving", "Shoe Storage Racks", "Hanging Systems", "LED Strip Lighting", "Jewelry Drawer Inserts", "Full-Length Mirror"]
    },
    {
        id: 5,
        title: "Desert Outdoor Kitchen Paradise",
        description: "Ultimate entertaining space with built-in BBQ grill, bar seating, and ambient lighting perfect for Arizona climate",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&auto=format",
        alt: "Outdoor kitchen with built-in grill, bar seating, and desert landscaping",
        category: "Outdoor",
        completionTime: "2 weeks",
        budget: "$20,000 - $40,000",
        location: "Scottsdale Ranch",
        features: ["Built-in Gas Grill", "Granite Bar Top", "Weather-Resistant Cabinets", "String Lighting", "Outdoor Refrigerator", "Shade Structure"]
    },
    {
        id: 6,
        title: "Executive Home Office Design",
        description: "Professional workspace with custom built-ins, cable management, and sophisticated lighting design",
        image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600&fit=crop&auto=format",
        alt: "Modern home office with built-in desk, custom storage, and professional lighting",
        category: "Office",
        completionTime: "1 week",
        budget: "$5,000 - $12,000",
        location: "North Scottsdale",
        features: ["Built-in Desk", "Custom Shelving", "Task & Ambient Lighting", "Cable Management", "Built-in Filing", "USB Charging Stations"]
    },
    {
        id: 7,
        title: "Smart Security System Installation",
        description: "Comprehensive smart home security system with cameras, sensors, and mobile app control",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&auto=format",
        alt: "Smart home security system with cameras and control panel",
        category: "Smart Home",
        completionTime: "2 days",
        budget: "$2,500 - $8,000",
        location: "Fountain Hills",
        features: ["Smart Cameras", "Door/Window Sensors", "Smart Locks", "Mobile App Control", "Motion Detection", "Professional Installation"]
    },
    {
        id: 8,
        title: "Pool Equipment Organization",
        description: "Organized pool equipment area with proper ventilation and maintenance access",
        image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=600&fit=crop&auto=format",
        alt: "Well-organized pool equipment room with proper ventilation and storage",
        category: "Pool",
        completionTime: "1 day",
        budget: "$1,500 - $3,000",
        location: "Pinnacle Peak",
        features: ["Equipment Shelving", "Ventilation Upgrade", "Chemical Storage", "Maintenance Access", "Safety Features", "Drainage Improvement"]
    },
    {
        id: 9,
        title: "Energy-Efficient Window Upgrades",
        description: "Whole-house window replacement with energy-efficient double-pane windows",
        image: "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&h=600&fit=crop&auto=format",
        alt: "Modern energy-efficient windows with double-pane glass installation",
        category: "Energy Efficiency",
        completionTime: "3 days",
        budget: "$12,000 - $25,000",
        location: "Carefree",
        features: ["Double-Pane Glass", "Low-E Coating", "Insulated Frames", "Professional Installation", "Energy Tax Credits", "UV Protection"]
    },
    {
        id: 10,
        title: "Backyard Fire Pit Installation",
        description: "Custom fire pit area with seating and landscape integration perfect for desert evenings",
        image: "https://picsum.photos/800/600?random=10",
        alt: "Custom stone fire pit with built-in seating and desert landscaping",
        category: "Outdoor",
        completionTime: "3 days",
        budget: "$3,000 - $8,000",
        location: "Cave Creek",
        features: ["Natural Stone Fire Pit", "Built-in Seating", "Gas Line Installation", "Landscape Integration", "Ambient Lighting", "Fire Safety Features"]
    }
];

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = cleanProjectGallery;
}
