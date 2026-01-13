import p_img1 from './p_img1.png';
import p_img2 from './p_img2.png';
import p_img3 from './p_img3.png';
import p_img4 from './p_img4.png';
import p_img5 from './p_img5.png';
import p_img6 from './p_img6.png';
import p_img7 from './p_img7.png';
import p_img8 from './p_img8.png';
import p_img9 from './p_img9.png';
import p_img10 from './p_img10.png';

import p_img12 from './p_img12.png';
import p_img13 from './p_img13.png';
import p_img14 from './p_img14.png';

export const products = [
  {
    _id: 1,
    name: "Apple",
    description: "Fresh and juicy apples.",
    price: 89,
    image: [p_img1,p_img12,p_img13,p_img14],
    category: "Fruits",
    subcategory: "apple",
    sizes: ["S", "M", "L"],
    date: 1622515800000, // Example timestamp
    bestseller: true,
  },
  {
    _id: 2,
    name: "Oranges",
    description: "Sweet and tangy oranges.",
    price: 79,
    image: [p_img2],
    category: "Fruits",
    subcategory: "citrus",
    sizes: ["S", "M", "L"],
    date: 1622515800000,
    bestseller: true,
  },
  {
    _id: 3,
    name: "Grapes",
    description: "Delicious seedless grapes.",
    price: 99,
    image: [p_img3],
    category: "Fruits",
    subcategory: "grapes",
    sizes: ["S", "M", "L"],
    date: 1622515800000,
    bestseller: false,
  },
  {
    _id: 4,
    name: "Bananas",
    description: "Ripe and sweet bananas.",
    price: 49,
    image: [p_img4],
    category: "Fruits",
    subcategory: "bananas",
    sizes: ["S", "M", "L"],
    date: 1622515800000,
    bestseller: true,
  },
  {
    _id: 5,
    name: "Pomegranate",
    description: "Fresh and juicy pomegranates.",
    price: 119,
    image: [p_img5],
    category: "Fruits",
    subcategory: "pomegranate",
    sizes: ["S", "M", "L"],
    date: 1622515800000,
    bestseller: false,
  },
  {
    _id: 6,
    name: "Carrots",
    description: "Crunchy and fresh carrots.",
    price: 40,
    image: [p_img6],
    category: "Vegetables",
    subcategory: "root_vegetables",
    sizes: ["S", "M", "L"],
    date: 1622515800000,
    bestseller: false,
  },
  {
    _id: 7,
    name: "Broccoli",
    description: "Healthy green broccoli.",
    price: 150,
    image: [p_img7],
    category: "Vegetables",
    subcategory: "leafy_greens",
    sizes: ["S", "M", "L"],
    date: 1622515800000,
    bestseller: true,
  },
  {
    _id: 8,
    name: "Cauliflower",
    description: "Fresh cauliflower.",
    price: 70,
    image: [p_img8],
    category: "Vegetables",
    subcategory: "flowering",
    sizes: ["S", "M", "L"],
    date: 1622515800000,
    bestseller: true,
  },
  {
    _id: 9,
    name: "Beetroot",
    description: "Fresh beetroot.",
    price: 60,
    image: [p_img9],
    category: "Vegetables",
    subcategory: "root_vegetables",
    sizes: ["S", "M", "L"],
    date: 1622515800000,
    bestseller: false,
  },
  {
    _id: 10,
    name: "Beans",
    description: "Fresh green beans.",
    price: 55,
    image: [p_img10],
    category: "Vegetables",
    subcategory: "legumes",
    sizes: ["S", "M", "L"],
    date: 1622515800000,
    bestseller: false,
  },
];
