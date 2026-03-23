const mongoose = require('mongoose');
const path = require('path');
const Product = require('./models/Product');
const Category = require('./models/Category');

require('dotenv').config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/lichtor_admin';

// Re-structured parsed data from the PDF extract mapping each family to a category
const reseedData = [
    {
        name: 'Ssk Panel Light',
        applicationAreas: ['indoor', 'commercial'],
        product: {
            name: 'Ssk Panel Light',
            watt: '8W / 15W / 22W',
            cct: '6K, 5K, 4K, 3K, 3IN1',
            pkg: '40 / 30 / 20',
            features: ['In-built driver', 'Light, Polycarbonate Body', 'Anti-flicker LED light', 'In-built surge protection', 'High power factor'],
            types: [
                { name: 'Round', watts: ['8W', '15W', '22W'] },
                { name: 'Square', watts: ['15W', '22W'] }
            ],
            wattTable: [
                { watt: '8W', cutOut: '100X100', outer: '115X115X35' },
                { watt: '15W', cutOut: '125X125 / 150X150', outer: '140X140X35 / 165X165X35' },
                { watt: '22W', cutOut: '150X150 / 200X200', outer: '165X165X35 / 215X215X35' }
            ]
        }
    },
    {
        name: 'Moon Surface Light',
        applicationAreas: ['indoor', 'commercial'],
        product: {
            name: 'Moon Surface Light (PC)',
            watt: '8W / 15W / 22W',
            cct: '6K, 5K, 4K, 3K, 3IN1',
            pkg: '40 / 30 / 20',
            features: ['In-Built Driver', 'Superior Surge Protection', 'Can be fixed directly on wall/ceiling', 'High grade diffuser'],
            types: [
                { name: 'Round (White/Black Body)', watts: ['8W', '15W', '22W'] }
            ],
            wattTable: [
                { watt: '8W', cutOut: '-', outer: '115X115X35' },
                { watt: '15W', cutOut: '-', outer: '140X140X35' },
                { watt: '22W', cutOut: '-', outer: '165X165X35' }
            ]
        }
    },
    {
        name: 'Ecco Deep Down Light',
        applicationAreas: ['indoor', 'commercial'],
        product: {
            name: 'Ecco Deep Down Light (PC)',
            watt: '8W / 15W / 22W',
            cct: '6K, 5K, 4K, 3K, 3IN1',
            pkg: '40 / 30 / 20',
            features: ['In-built driver', 'Light, Polycarbonate Body', 'Anti-flicker LED light', 'In-built surge protection', 'High power factor'],
            types: [
                { name: 'Round (White/Black Body)', watts: ['8W', '15W', '22W'] }
            ],
            wattTable: [
                { watt: '8W', cutOut: '105X105', outer: '115X115X45' },
                { watt: '15W', cutOut: '135X135', outer: '145X145X45' },
                { watt: '22W', cutOut: '155X155', outer: '165X165X45' }
            ]
        }
    },
    {
        name: 'Regular Deep Down Light',
        applicationAreas: ['indoor', 'commercial'],
        product: {
            name: 'Regular Deep Down Light (ALLU)',
            watt: '12W / 18W / 22W',
            cct: '6K, 5K, 4K, 3K, 3IN1',
            pkg: '40 / 30 / 20',
            features: ['Recessed LED down light', 'Die Cast aluminium body', 'High grade, anti-glare diffuser', 'High lumen', 'High power factor'],
            types: [
                { name: 'Round (White/Black Body)', watts: ['12W', '18W', '22W'] }
            ],
            wattTable: [
                { watt: '12W', cutOut: '110X110', outer: '120X120X46' },
                { watt: '18W', cutOut: '140X140', outer: '154X154X49' },
                { watt: '22W', cutOut: '170X170', outer: '175X175X49' }
            ]
        }
    },
    {
        name: 'Ultra Deep Down Light',
        applicationAreas: ['indoor', 'commercial'],
        product: {
            name: 'Ultra Deep Down Light (ALLU)',
            watt: '12W / 18W / 22W',
            cct: '6K, 5K, 4K, 3K, 3IN1',
            pkg: '40 / 30 / 20',
            features: ['Extremely slim LED Panel', 'High Power Factor', 'Surge Protection upto 2.5KV', 'Die cast aluminum body', 'High grade powder coating'],
            types: [
                { name: 'Round', watts: ['12W', '18W', '22W'] }
            ],
            wattTable: [
                { watt: '12W', cutOut: '95x95', outer: '100x100x50' },
                { watt: '18W', cutOut: '125x125', outer: '130x130x50' },
                { watt: '22W', cutOut: '145x145', outer: '150x150x50' }
            ]
        }
    },
    {
        name: 'Mini Junction Light',
        applicationAreas: ['indoor'],
        product: {
            name: 'Mini Junction Light (PC)',
            watt: '4W',
            cct: '6K, 4K, 3K, C+W+N, R+B+P, RED, BLUE, GREEN, PINK, G+B+SKB',
            pkg: '100',
            features: ['In-built driver', 'Light, Polycarbonate Body', 'Anti-flicker LED light', 'In-built surge protection', 'High power factor'],
            types: [
                { name: 'Round Mini', watts: ['4W'] }
            ],
            wattTable: [
                { watt: '4W', cutOut: '50x50', outer: '80x80x30' }
            ]
        }
    },
    {
        name: 'Big Junction Light',
        applicationAreas: ['indoor'],
        product: {
            name: 'Big Junction Light (PC)',
            watt: '7W',
            cct: '6K, 4K, 3K, C+W+N, R+B+P, RED, BLUE, GREEN, PINK, G+B+SKB',
            pkg: '50',
            features: ['In-built driver', 'Light, Polycarbonate Body', 'Anti-flicker LED light', 'In-built surge protection', 'High power factor'],
            types: [
                { name: 'Round Big', watts: ['7W'] }
            ],
            wattTable: [
                { watt: '7W', cutOut: '85x85', outer: '110x110x65' }
            ]
        }
    },
    {
        name: 'COB Junction Light',
        applicationAreas: ['indoor'],
        product: {
            name: 'Moveable COB Junction Light',
            watt: '3W',
            cct: '6K, 4K, 3K, C+W+N, R+B+P, RED, BLUE, GREEN, PINK, G+B+SKB',
            pkg: '100',
            features: ['Ideal for niche area or to spotlight', 'Aluminium extruded body with heat sink', 'Best for product highlighting'],
            types: [
                { name: 'Round COB', watts: ['3W'] }
            ],
            wattTable: [
                { watt: '3W', cutOut: '52x52', outer: '70x70x40' }
            ]
        }
    },
    {
        name: 'Rembow Junction Light',
        applicationAreas: ['indoor'],
        product: {
            name: 'Rembow Junction Light (PC)',
            watt: '7w+7w / 12w+12w',
            cct: 'CW+PGB, CW+RED, CW+BLUE, CW+GREEN, CW+WW, CW+PINK',
            pkg: '75 / 50',
            features: ['Light, Polycarbonate Body', 'In-built driver', 'Frameless LED', 'Ultra slim round concealed dual color LED panel light', 'Switch power on/off to change light mode for Pure Color'],
            types: [
                { name: 'Round', watts: ['7w+7w', '12w+12w'] }
            ],
            wattTable: [
                { watt: '7w+7w', cutOut: '50x50', outer: '85x85x46' },
                { watt: '12w+12w', cutOut: '50x50', outer: '115x115x46' }
            ]
        }
    },
    {
        name: 'Bulb Light',
        applicationAreas: ['indoor'],
        product: {
            name: 'Bulb Light',
            watt: '9w / 12w / 15w / 18w / 30w / 40w / 50w',
            cct: 'CW',
            pkg: '100 / 100 / 50 / 50 / 20 / 20 / 20',
            features: ['Light, Polycarbonate Body', 'In-built driver', 'Frameless LED', 'Driverless (for specific models)'],
            types: [
                { name: 'Bulb (B-22 Cap)', watts: ['9w', '12w', '15w', '18w', '30w', '40w', '50w'] }
            ],
            wattTable: []
        }
    },
    {
        name: 'Tube Light',
        applicationAreas: ['indoor', 'commercial'],
        product: {
            name: 'Tube Light',
            watt: '20w / 36w',
            cct: 'CW',
            pkg: '50 / 20',
            features: ['Light, Polycarbonate Body', 'In-built driver', 'Frameless LED'],
            types: [
                { name: 'PC', watts: ['20w', '36w'] },
                { name: 'Aluminium', watts: ['36w'] }
            ],
            wattTable: []
        }
    },
    {
        name: 'Batan Spot Light',
        applicationAreas: ['indoor', 'commercial'],
        product: {
            name: 'Batan Spot Light (PC)',
            watt: '2W',
            cct: 'CW, WW, NW, RED, GREEN, BLUE, PINK',
            pkg: '100',
            features: ['Ideal for niche area or to spotlight', 'Aluminium extruded body with heat sink', 'Best for product highlighting', 'Driverless'],
            types: [
                { name: 'Round', watts: ['2W'] }
            ],
            wattTable: [
                { watt: '2W', cutOut: '33x33', outer: '42x42x17' }
            ]
        }
    },
    {
        name: 'PC Sticker Indoor SMD Surface Light',
        applicationAreas: ['indoor'],
        product: {
            name: 'PC Sticker Indoor SMD Surface Light',
            watt: '3W',
            cct: 'CW, WW, NW, C+W+N, R+B+P, RED, GREEN, BLUE, PINK, G+B+SKB',
            pkg: '100',
            features: ['In-Built Driver / Driverless', 'Superior Surge Protection', 'Can be fixed directly on wall/ceiling', 'High grade diffuser'],
            types: [
                { name: 'Round', watts: ['3W'] }
            ],
            wattTable: [
                { watt: '3W', cutOut: '-', outer: '50x50' }
            ]
        }
    },
    {
        name: 'Metal Spot Light',
        applicationAreas: ['indoor', 'commercial'],
        product: {
            name: 'Metal Spot Light (ALLU)',
            watt: '3W',
            cct: 'CW, WW, NW',
            pkg: '100',
            features: ['Ideal for niche area or to spotlight', 'Aluminium extruded body with heat sink', 'Best for product highlighting', 'Driverless'],
            types: [
                { name: 'Metal', watts: ['3W'] }
            ],
            wattTable: [
                { watt: '3W', cutOut: '33x33', outer: '42x42x17' }
            ]
        }
    },
    {
        name: 'Curve Spot Light',
        applicationAreas: ['indoor', 'commercial'],
        product: {
            name: 'Curve Spot Light (ALLU)',
            watt: '3W',
            cct: 'CW, WW, NW',
            pkg: '100',
            features: ['Ideal for niche area or to spotlight', 'Aluminium extruded body with heat sink', 'Best for product highlighting', 'Driverless'],
            types: [
                { name: 'Curve', watts: ['3W'] }
            ],
            wattTable: [
                { watt: '3W', cutOut: '33x33', outer: '42x42x17' }
            ]
        }
    },
    {
        name: 'Ring Cylinder Light',
        applicationAreas: ['indoor'],
        product: {
            name: 'Ring Cylinder Light (ALLU)',
            watt: '3W',
            cct: 'CW, WW, NW',
            pkg: '100',
            features: ['Ideal for niche area or to spotlight', 'Aluminium extruded body with heat sink', 'Best for product highlighting', 'Driverless'],
            types: [
                { name: 'Round Cylinder', watts: ['3W'] }
            ],
            wattTable: [
                { watt: '3W', cutOut: '33x33', outer: '42x42x17' }
            ]
        }
    },
    {
        name: 'Creta COB Light',
        applicationAreas: ['indoor', 'commercial'],
        product: {
            name: 'Creta COB Light (ALLU)',
            watt: '7W / 12W / 18W',
            cct: 'CW, WW, NW, 3IN1',
            pkg: '50',
            features: ['High bright COB down light', 'Matt, diffused lens', 'Swivel mechanism to focus light', 'Die cast aluminium body', 'High lumen output'],
            types: [
                { name: 'Round', watts: ['7W', '12W', '18W'] }
            ],
            wattTable: [
                { watt: '7W', cutOut: '65', outer: '70x50' },
                { watt: '12W', cutOut: '80', outer: '85x65' },
                { watt: '18W', cutOut: '90', outer: '95x75' }
            ]
        }
    },
    {
        name: 'Delta COB Light',
        applicationAreas: ['indoor', 'commercial'],
        product: {
            name: 'Delta COB Light (ALLU)',
            watt: '7W / 12W / 18W',
            cct: 'CW, WW, NW, 3IN1',
            pkg: '50',
            features: ['High bright COB down light', 'Heat sink for heat management', 'Die cast aluminium body', 'High grade powder coating', 'High lumen output'],
            types: [
                { name: 'Round', watts: ['7W', '12W', '18W'] }
            ],
            wattTable: [
                { watt: '7W', cutOut: '55', outer: '63x61' },
                { watt: '12W', cutOut: '75', outer: '84x61' },
                { watt: '18W', cutOut: '80', outer: '90x87' }
            ]
        }
    },
    {
        name: 'Creta COB Cylinder Light',
        applicationAreas: ['indoor', 'commercial'],
        product: {
            name: 'Creta COB Cylinder Light (ALLU)',
            watt: '7W / 12W / 18W',
            cct: 'CW, WW, NW, 3IN1',
            pkg: '50',
            features: ['High bright COB down light', 'Heat sink for heat management', 'Die cast aluminium body', 'High grade powder coating', 'High lumen output'],
            types: [
                { name: 'Round', watts: ['7W', '12W', '18W'] }
            ],
            wattTable: [
                { watt: '7W', cutOut: '-', outer: '62X72' },
                { watt: '12W', cutOut: '-', outer: '77X90' },
                { watt: '18W', cutOut: '-', outer: '88X110' }
            ]
        }
    },
    {
        name: 'Profile Strip Light',
        applicationAreas: ['indoor', 'commercial'],
        product: {
            name: 'Profile Strip Light',
            watt: '18W (Per MTR)',
            cct: 'CW, WW, NW',
            pkg: '250 ROLL',
            features: ['LEDs: 240', 'Width: 10MM', 'IP20', 'Length: 5MTR / Roll'],
            types: [
                { name: 'Strip', watts: ['18W'] }
            ],
            wattTable: []
        }
    },
    {
        name: 'Profile Light',
        applicationAreas: ['indoor', 'commercial'],
        product: {
            name: 'Profile Light Channel',
            watt: '-',
            cct: '-',
            pkg: '400 / 48 / 24',
            features: ['Aluminium Profile for LED Strips', 'Includes Diffuser'],
            types: [
                { name: 'Conceal / Surface / Corner', watts: [] }
            ],
            wattTable: [
                { watt: '-', cutOut: '7x9 mm to 50x35mm', outer: 'Length: 2 MTR / PC' }
            ]
        }
    },
    {
        name: 'Oval Bulkhead Light',
        applicationAreas: ['outdoor'],
        product: {
            name: 'Ovel Bulkhead Light (PC)',
            watt: '9W / 18W',
            cct: 'CW, WW',
            pkg: '110 / 55',
            features: ['Light up your outdoor space reliably', 'Waterproof and corrosion-resistant', 'Easy to mount on the wall', 'Provides wide, diffused light'],
            types: [
                { name: 'Oval', watts: ['9W', '18W'] }
            ],
            wattTable: [
                { watt: '9W', cutOut: '-', outer: '68 x 169' },
                { watt: '18W', cutOut: '-', outer: '100 x 208' }
            ]
        }
    },
    {
        name: 'Water Proof Sticker Outdoor COB Surface Light',
        applicationAreas: ['outdoor'],
        product: {
            name: 'Water Proof Sticker Outdoor COB Surface Light',
            watt: '3W',
            cct: 'WW',
            pkg: '100',
            features: ['In-Built Driver / Driverless', 'Superior Surge Protection', 'Can be fixed directly on wall/ceiling', 'High grade diffuser'],
            types: [
                { name: 'Round', watts: ['3W'] }
            ],
            wattTable: [
                { watt: '3W', cutOut: '-', outer: '50x50' }
            ]
        }
    },
    {
        name: 'Lens Street Light',
        applicationAreas: ['outdoor', 'industrial'],
        product: {
            name: 'Lens Street Light (ALLU)',
            watt: '24w / 36w / 50w / 72w / 100w',
            cct: 'CW, WW, NW',
            pkg: '50 / 40 / 30 / 12',
            features: ['Clear, high grade lens', 'High surge protection', 'IP65 rated, water proof', 'In-built drivers', 'Sleek design', 'Pressure die cast aluminium'],
            types: [
                { name: 'Street Light', watts: ['24w', '36w', '50w', '72w', '100w'] }
            ],
            wattTable: [
                { watt: '24w', cutOut: '-', outer: '180X110X55' },
                { watt: '36w', cutOut: '-', outer: '335X130X57' },
                { watt: '50w/72w', cutOut: '-', outer: '385X165X57' },
                { watt: '100w', cutOut: '-', outer: '455X190X60' }
            ]
        }
    },
    {
        name: 'X Series Flood Light',
        applicationAreas: ['outdoor', 'industrial'],
        product: {
            name: 'X Series Flood Light (ALLU)',
            watt: '50W / 100W / 200W',
            cct: 'CW, WW, NW, RED, GREEN, BLUE, PINK, 2IN1',
            pkg: '20 / 10',
            features: ['Die cast metal body', 'Dust & water proof with IP65 protection', 'High performance electronic inbuilt driver', 'Wide operating range', 'Specially designed in built heat sink', 'High surge protection'],
            types: [
                { name: 'Flood Light', watts: ['50W', '100W', '200W'] }
            ],
            wattTable: [
                { watt: '50W', cutOut: '-', outer: '205l175x49' },
                { watt: '100W', cutOut: '-', outer: '256x211x49' },
                { watt: '200W', cutOut: '-', outer: '350x285x55' }
            ]
        }
    },
    {
        name: 'Back Chock Flood Light',
        applicationAreas: ['outdoor', 'industrial'],
        product: {
            name: 'Back Chock Flood Light (ALLU)',
            watt: '100W / 150W / 200W / 300W / 400W',
            cct: 'CW, WW, NW, RED, GREEN, BLUE, PINK, 2IN1, 5050',
            pkg: '10 / 8 / 6 / 4',
            features: ['Die cast metal body', 'Dust & water proof with IP65 protection', 'High performance electronic inbuilt driver', 'Specially designed in built heat sink', 'High surge protection'],
            types: [
                { name: 'Flood Light', watts: ['100W', '150W', '200W', '300W', '400W'] }
            ],
            wattTable: [
                { watt: '100W', cutOut: '-', outer: '240x300x115' },
                { watt: '150W', cutOut: '-', outer: '240x350x120' },
                { watt: '200W', cutOut: '-', outer: '300x400x140' },
                { watt: '300W / 400W', cutOut: '-', outer: '340x500x150' }
            ]
        }
    },
    {
        name: 'Wired Rope Light',
        applicationAreas: ['outdoor'],
        product: {
            name: 'Wired Rope Light',
            watt: '120(2835) / 60(5050)',
            cct: 'CW, WW, NW, GREEN, BLUE, PINK, AMBER, ICE BLUE, RGB',
            pkg: '5 ROLL',
            features: ['LEDs: 120 or 60 per MTR', 'Width: 10MM', 'Length: 50MTR / Roll'],
            types: [
                { name: 'Rope Light', watts: ['120', '60'] }
            ],
            wattTable: []
        }
    },
    {
        name: 'High Bay Flood Light',
        applicationAreas: ['industrial'],
        product: {
            name: 'High Bay Flood Light (ALLU)',
            watt: '100W / 150W / 200W',
            cct: 'CW, WW, NW, RED, GREEN, BLUE, PINK, 2IN1, 5050',
            pkg: '12 / 6 / 6',
            features: ['Die cast metal body', 'Dust & water proof with IP65 protection', 'High performance electronic inbuilt driver', 'Specially designed in built heat sink', 'High surge protection'],
            types: [
                { name: 'High Bay', watts: ['100W', '150W', '200W'] }
            ],
            wattTable: [
                { watt: '100W', cutOut: '-', outer: '255x255x100' },
                { watt: '150W', cutOut: '-', outer: '355x355x110' },
                { watt: '200W', cutOut: '-', outer: '385x385x115' }
            ]
        }
    },
    {
        name: 'Street Light Clamp',
        applicationAreas: ['accessories'],
        product: {
            name: 'Street Light Clamp',
            watt: '-',
            cct: '-',
            pkg: '100',
            features: ['PVC and Metal Material', 'Long Lasting Durability', 'Useful for Streetlight, Walkways, Garden Society, Compound, Garage etc.'],
            types: [
                { name: 'Wall Clamp 1.5 MM', watts: [] },
                { name: 'Medium Vakiya 1.25 INCH', watts: [] },
                { name: 'Big Vakiya 1.5 INCH', watts: [] },
                { name: 'Adj Stand ABC PVC', watts: [] }
            ],
            wattTable: []
        }
    },
    {
        name: 'SMPS Strip Driver',
        applicationAreas: ['accessories'],
        product: {
            name: 'SMPS Strip Driver',
            watt: '24W to 360W',
            cct: '-',
            pkg: '200 to 50',
            features: ['12 V Output Voltage', '180-265 V Input Voltage'],
            types: [
                { name: 'SMPS Driver', watts: ['24W', '60W', '120W', '180W', '240W', '360W'] }
            ],
            wattTable: []
        }
    }
];

// Group mapping for existing 30 LICHTOR products
const productGroupMap = {
    'Ssk Panel Light': 'panel',
    'Moon Surface Light': 'surface',
    'Ecco Deep Down Light': 'downlight',
    'Regular Deep Down Light': 'downlight',
    'Ultra Deep Down Light': 'downlight',
    'Mini Junction Light': 'junction',
    'Big Junction Light': 'junction',
    'COB Junction Light': 'junction',
    'Rembow Junction Light': 'junction',
    'Bulb Light': 'bulb',
    'Tube Light': 'tube',
    'Batan Spot Light': 'spotlight',
    'PC Sticker Indoor SMD Surface Light': 'surface',
    'Metal Spot Light': 'spotlight',
    'Curve Spot Light': 'spotlight',
    'Ring Cylinder Light': 'ceiling',
    'Creta COB Light': 'spotlight',
    'Delta COB Light': 'spotlight',
    'Creta COB Cylinder Light': 'ceiling',
    'Profile Strip Light': 'track',
    'Profile Light': 'track',
    'Oval Bulkhead Light': 'surface',
    'Water Proof Sticker Outdoor COB Surface Light': 'surface',
    'Lens Street Light': 'street',
    'X Series Flood Light': 'flood',
    'Back Chock Flood Light': 'flood',
    'Wired Rope Light': 'rope',
    'High Bay Flood Light': 'flood',
    'Street Light Clamp': 'accessories',
    'SMPS Strip Driver': 'accessories'
};

const bodyColorMap = {
    'Ssk Panel Light': ['White'],
    'Moon Surface Light (PC)': ['White', 'Black'],
    'Ecco Deep Down Light (PC)': ['White', 'Black'],
    'Regular Deep Down Light (ALLU)': ['White', 'Black'],
    'Ultra Deep Down Light (ALLU)': ['White', 'Black'],
    'Mini Junction Light (PC)': ['White'],
    'Big Junction Light (PC)': ['White'],
    'COB Junction Light (PC)': ['White'],
    'Rembow Junction Light (PC)': ['White'],
    'Bulb Light': ['White'],
    'Tube Light (PC)': ['White'],
    'Ovel Bulkhead Light (PC)': ['White', 'Black'],
    'Batan Spot Light (PC)': ['White'],
    'Driverless Surface Light - PC Sticker / Indoor SMD': ['White'],
    'Water Proof Sticker Outdoor COB Surface Light': ['Black'],
    'Driverless Metal Spot Light (ALLU)': ['White', 'Black', 'Copper'],
    'Driverless Spot Light (ALLU) - Curve': ['White', 'Black', 'Copper'],
    'Driverless Cylinder Light (ALLU) - Ring': ['White', 'Black'],
    'Creta COB Light (ALLU)': ['White', 'Black'],
    'Delta COB Light (ALLU)': ['White', 'Black'],
    'Creta COB Cylinder Light (ALLU)': ['White', 'Black'],
    'Lens Street Light (ALLU)': ['Grey'],
    'Street Light Clamp': ['Metal', 'PVC'],
    'X Series Flood Light (ALLU)': ['Grey'],
    'Back Chock Flood Light (ALLU)': ['Grey'],
    'High Bay Flood Light (ALLU)': ['Grey'],
    'Wired Rope Light': ['Transparent'],
    'Profile Strip Light': ['White'],
    'Profile Light': ['Aluminium Silver'],
    'SMPS Strip Driver': ['Metal Grey']
};

const descriptionMap = {
    'Ssk Panel Light': 'Ultra-slim recessed panel light for false ceilings with flicker-free illumination.',
    'Moon Surface Light (PC)': 'Modern surface-mounted LED light for rooms without false ceilings.',
    'Ecco Deep Down Light (PC)': 'Compact recessed downlight with glare-free focused lighting.',
    'Regular Deep Down Light (ALLU)': 'Aluminium deep downlight with powerful beam for offices and homes.',
    'Ultra Deep Down Light (ALLU)': 'High-performance ultra-deep downlight with anti-glare optics.',
    'Mini Junction Light (PC)': 'Compact junction box light with easy snap-fit ceiling installation.',
    'Big Junction Light (PC)': 'Larger junction light for spacious rooms and bright illumination.',
    'COB Junction Light (PC)': 'COB-powered junction light with high-intensity focused output.',
    'Rembow Junction Light (PC)': 'Decorative junction light with rainbow-inspired aesthetics.',
    'Bulb Light': 'Energy-efficient LED bulb for warm everyday household lighting.',
    'Tube Light (PC)': 'Slim LED tube replacement with flicker-free instant start.',
    'Ovel Bulkhead Light (PC)': 'Weather-resistant oval bulkhead for outdoor corridors and balconies.',
    'Batan Spot Light (PC)': 'Adjustable LED spotlight for accent and display lighting.',
    'Driverless Surface Light - PC Sticker / Indoor SMD': 'Ultra-thin driverless surface light with peel-and-stick installation.',
    'Water Proof Sticker Outdoor COB Surface Light': 'Weatherproof COB light with adhesive mounting for outdoor use.',
    'Driverless Metal Spot Light (ALLU)': 'Premium aluminium spotlight with sleek driverless design.',
    'Driverless Spot Light (ALLU) - Curve': 'Elegantly curved aluminium spotlight with modern aesthetics.',
    'Driverless Cylinder Light (ALLU) - Ring': 'Cylindrical ring-shaped ceiling light for ambient illumination.',
    'Creta COB Light (ALLU)': 'High-intensity COB spotlight with precision beam control.',
    'Delta COB Light (ALLU)': 'Triangular-profile COB light for retail and architectural lighting.',
    'Creta COB Cylinder Light (ALLU)': 'Surface-mounted COB cylinder with elegant spotlight design.',
    'Lens Street Light (ALLU)': 'High-efficiency LED street light with precision optic lens.',
    'X Series Flood Light (ALLU)': 'Powerful LED flood light for wide-area outdoor illumination.',
    'Back Chock Flood Light (ALLU)': 'Heavy-duty aluminium flood light for stadiums and warehouses.',
    'High Bay Flood Light (ALLU)': 'Industrial-grade high bay LED for warehouses and factories.',
    'Wired Rope Light': 'Flexible LED rope light for decorative and festive lighting.',
    'Profile Strip Light': 'Aluminium profile LED strip for clean, linear illumination.',
    'Profile Light': 'Premium aluminium LED profile with integrated diffuser.',
    'Street Light Clamp': 'Durable clamp accessory for street light pole mounting.',
    'SMPS Strip Driver': 'Power supply driver for LED strip installations.'
};

const categoryDescriptionMap = {
    'Ssk Panel Light': 'Ultra-slim recessed panel light for false ceilings with flicker-free illumination.',
    'Moon Surface Light': 'Modern surface-mounted LED light for rooms without false ceilings.',
    'Ecco Deep Down Light': 'Compact recessed downlight with glare-free focused lighting.',
    'Regular Deep Down Light': 'Aluminium deep downlight with powerful beam for offices and homes.',
    'Ultra Deep Down Light': 'High-performance ultra-deep downlight with anti-glare optics.',
    'Mini Junction Light': 'Compact junction box light with easy snap-fit ceiling installation.',
    'Big Junction Light': 'Larger junction light for spacious rooms and bright illumination.',
    'COB Junction Light': 'COB-powered junction light with high-intensity focused output.',
    'Rembow Junction Light': 'Decorative junction light with rainbow-inspired aesthetics.',
    'Bulb Light': 'Energy-efficient LED bulb for warm everyday household lighting.',
    'Tube Light': 'Slim LED tube replacement with flicker-free instant start.',
    'Batan Spot Light': 'Adjustable LED spotlight for accent and display lighting.',
    'PC Sticker Indoor SMD Surface Light': 'Ultra-thin driverless surface light with peel-and-stick installation.',
    'Metal Spot Light': 'Premium aluminium spotlight with sleek driverless design.',
    'Curve Spot Light': 'Elegantly curved aluminium spotlight with modern aesthetics.',
    'Ring Cylinder Light': 'Cylindrical ring-shaped ceiling light for ambient illumination.',
    'Creta COB Light': 'High-intensity COB spotlight with precision beam control.',
    'Delta COB Light': 'Triangular-profile COB light for retail and architectural lighting.',
    'Creta COB Cylinder Light': 'Surface-mounted COB cylinder with elegant spotlight design.',
    'Profile Strip Light': 'Aluminium profile LED strip for clean, linear illumination.',
    'Profile Light': 'Premium aluminium LED profile with integrated diffuser.',
    'Oval Bulkhead Light': 'Weather-resistant oval bulkhead for outdoor corridors and balconies.',
    'Water Proof Sticker Outdoor COB Surface Light': 'Weatherproof COB light with adhesive mounting for outdoor use.',
    'Lens Street Light': 'High-efficiency LED street light with precision optic lens.',
    'X Series Flood Light': 'Powerful LED flood light for wide-area outdoor illumination.',
    'Back Chock Flood Light': 'Heavy-duty aluminium flood light for stadiums and warehouses.',
    'Wired Rope Light': 'Flexible LED rope light for decorative and festive lighting.',
    'High Bay Flood Light': 'Industrial-grade high bay LED for warehouses and factories.',
    'Street Light Clamp': 'Durable clamp accessory for street light pole mounting.',
    'SMPS Strip Driver': 'Power supply driver for LED strip installations.'
};

function generateSlug(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

async function seedData() {
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB via', uri);

        console.log('Clearing existing categories and products...');
        await Category.deleteMany({});
        await Product.deleteMany({});

        let totalCategories = 0;
        let totalProducts = 0;

        const imageMap = {
            'Ssk Panel Light': 'page_3.jpeg',
            'Moon Surface Light': 'page_4.jpeg',
            'Ecco Deep Down Light': 'page_5.jpeg',
            'Regular Deep Down Light': 'page_6.jpeg',
            'Ultra Deep Down Light': 'page_7.jpeg',
            'Mini Junction Light': 'page_8.jpeg',
            'Big Junction Light': 'page_8.jpeg',
            'COB Junction Light': 'page_9.jpeg',
            'Rembow Junction Light': 'page_10.png',
            'Bulb Light': 'page_11.jpeg',
            'Tube Light': 'page_12.jpeg',
            'Batan Spot Light': 'page_14.jpeg',
            'PC Sticker Indoor SMD Surface Light': 'page_15.jpeg',
            'Metal Spot Light': 'page_17.jpeg',
            'Curve Spot Light': 'page_18.jpeg',
            'Ring Cylinder Light': 'page_19.jpeg',
            'Creta COB Light': 'page_20.jpeg',
            'Delta COB Light': 'page_21.jpeg',
            'Creta COB Cylinder Light': 'page_22.jpeg',
            'Profile Strip Light': 'page_29.jpeg',
            'Profile Light': 'page_30.jpeg',
            'Oval Bulkhead Light': 'page_13.jpeg',
            'Water Proof Sticker Outdoor COB Surface Light': 'page_16.jpeg',
            'Lens Street Light': 'page_23.jpeg',
            'X Series Flood Light': 'page_25.png',
            'Back Chock Flood Light': 'page_26.jpeg',
            'Wired Rope Light': 'page_28.jpeg',
            'High Bay Flood Light': 'page_27.jpeg',
            'Street Light Clamp': 'page_24.png',
            'SMPS Strip Driver': 'page_31.jpeg'
        };

        for (const catData of reseedData) {
            // Create the new Category
            const imgFile = imageMap[catData.name];
            
            const category = await Category.create({
                name: catData.name,
                slug: generateSlug(catData.name),
                description: categoryDescriptionMap[catData.name] || `Premium ${catData.name} from the LICHTOR catalogue.`,
                applicationAreas: catData.applicationAreas,
                productGroup: productGroupMap[catData.name] || '',
                bannerImage: imgFile ? `/assets/products/${imgFile}` : '',
                status: 'active'
            });
            console.log(`Created Category: ${category.name} [${catData.applicationAreas.join(', ')}] with image ${imgFile}`);
            totalCategories++;

            // Create exactly 1 Product for this Category
            const p = catData.product;
            await Product.create({
                name: p.name,
                slug: generateSlug(p.name),
                category: category._id,
                image: imgFile ? `/assets/products/${imgFile}` : '',
                watt: p.watt,
                bodyColors: bodyColorMap[p.name] || [],
                cct: p.cct,
                pkg: p.pkg,
                features: p.features,
                types: p.types || [],
                wattTable: p.wattTable || [],
                description: descriptionMap[p.name] || `High-quality ${p.name} designed to be durable and extremely efficient.`,
                isActive: true
            });
            totalProducts++;
        }

        console.log(`\nImport Summary:\n================\nCategories Added: ${totalCategories}\nProducts Added: ${totalProducts}\n`);
    } catch (e) {
        console.error('Error importing:', e);
    } finally {
        await mongoose.disconnect();
    }
}

seedData();
