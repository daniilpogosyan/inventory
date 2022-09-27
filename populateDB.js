const Brand = require('./models/brand');
const Category = require('./models/category');
const Item = require('./models/item');

const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://daniilpogosyan1234134:12341234@cluster0.42kht8d.mongodb.net/inventory?retryWrites=true&w=majority';
mongoose.connect(MONGODB_URI);

const brandsData = [
  {
    name: 'Abibas',
    description: 'The best hoes for your feets'
  },
  {
    name: 'Pumalar',
    description: 'Mahalliy kompaniya tilida soxta xaridorlar uchun soxta tavsif'
  },
  {
    name: 'The Descriptionless'
  },
  {
    name: 'No-drunkie',
    description: 'Soft drinks for every taste'
  }
];

const categoriesData = [
  { name: 'Shoes' },
  { name: 'Shorts' },
  { name: 'Drink' },
];


(async () => {
  const brands = [];
  const categories = [];

  console.log('Creating brands...')
  for (const brandData of brandsData) {
    const brand = new Brand(brandData);
    await brand.save();
    brands.push(brand);
    console.log('Brand:' + brandData.name)
  }

  console.log('Creating categories...')
  for (const categoryData of categoriesData) {
    const category = new Category(categoryData);
    await category.save();
    categories.push(category);
    console.log('Category: ' + category.name)
  }

  const items = [
    {
      name: 'Coca-Ebola',
      description: 'Sugar will kill you',
      category: categories[2],
      brand: brands[3],
      price: 4.50,
      numberInStock: 9231,
    },
    {
      name: 'DOWN',
      description: 'Sugar-free drink',
      category: categories[2],
      brand: brands[3],
      price: 6.52,
      numberInStock: 2331,
    },
    {
      name: 'AT-AT',
      description: 'Lil clumpsies',
      category: categories[0],
      brand: brands[0],
      price: 25.60,
      numberInStock: 123,
    },
    {
      name: 'T-800',
      description: 'Shoes for zombie-apocalypse',
      category: categories[0],
      brand: brands[0],
      price: 220.00,
      numberInStock: 9,
    },
    {
      name: 'Kittens',
      description: 'Almost alive kittens',
      category: categories[0],
      brand: brands[1],
      price: 210.00,
      numberInStock: 12
    },
  ]
  console.log('Creating items...')
  await Promise.all(items.map(async (itemData) => {
    const item = new Item(itemData);
    await item.save();
    console.log('Item:', item.name);
  }));

  mongoose.connection.close();
})();

