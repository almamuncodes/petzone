import Product from "../models/Product.js";

// @desc    Get all products with filters, sorting & pagination
// @route   GET /api/products
export const getProducts = async (req, res) => {
  try {
    const { 
      search, 
      category, 
      petType, 
      priceMin, 
      priceMax, 
      sort, 
      page = 1, 
      limit = 9 
    } = req.query;

    const query = {};

    // 1. Full text Search
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // 2. Category Filter
    if (category && category !== "all") {
      query.category = category;
    }

    // 3. Pet Type Filter
    if (petType && petType !== "all") {
      query.petType = petType;
    }

    // 4. Price range Filter
    if (priceMin || priceMax) {
      query.price = {};
      if (priceMin) query.price.$gte = Number(priceMin);
      if (priceMax) query.price.$lte = Number(priceMax);
    }

    // 5. Sorting
    let sortQuery = { createdAt: -1 }; // default: newest
    if (sort === "price_asc") {
      sortQuery = { price: 1 };
    } else if (sort === "price_desc") {
      sortQuery = { price: -1 };
    } else if (sort === "rating_desc") {
      sortQuery = { rating: -1 };
    }

    // 6. Pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, parseInt(limit));
    const skip = (pageNum - 1) * limitNum;

    const totalProducts = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(limitNum);

    res.json({
      products,
      pagination: {
        total: totalProducts,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(totalProducts / limitNum)
      }
    });
  } catch (error) {
    console.error("Error in getProducts:", error);
    res.status(500).json({ error: "সার্ভার এরর! প্রোডাক্ট তালিকা লোড করা যায়নি।" });
  }
};

// @desc    Get single product details
// @route   GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "প্রোডাক্টটি খুঁজে পাওয়া যায়নি।" });
    }
    res.json(product);
  } catch (error) {
    console.error("Error in getProductById:", error);
    res.status(500).json({ error: "সার্ভার এরর! প্রোডাক্টের তথ্য লোড করা যায়নি।" });
  }
};

// @desc    Create new product (Admin)
// @route   POST /api/products
export const createProduct = async (req, res) => {
  try {
    const { name, category, petType, price, stock, brand, description, image } = req.body;

    if (!name || !category || !petType || !price || !brand || !description || !image) {
      return res.status(400).json({ error: "সবগুলো ফিল্ড পূরণ করা আবশ্যক।" });
    }

    const product = new Product({
      name,
      category,
      petType,
      price: Number(price),
      stock: Number(stock),
      brand,
      description,
      image,
      rating: 5,
      reviews: []
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error in createProduct:", error);
    res.status(500).json({ error: "সার্ভার এরর! নতুন প্রোডাক্ট যুক্ত করা যায়নি।" });
  }
};

// @desc    Update a product (Admin)
// @route   PUT /api/products/:id
export const updateProduct = async (req, res) => {
  try {
    const { name, category, petType, price, stock, brand, description, image } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "প্রোডাক্টটি খুঁজে পাওয়া যায়নি।" });
    }

    product.name = name || product.name;
    product.category = category || product.category;
    product.petType = petType || product.petType;
    product.price = price !== undefined ? Number(price) : product.price;
    product.stock = stock !== undefined ? Number(stock) : product.stock;
    product.brand = brand || product.brand;
    product.description = description || product.description;
    product.image = image || product.image;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error("Error in updateProduct:", error);
    res.status(500).json({ error: "সার্ভার এরর! প্রোডাক্ট আপডেট করা যায়নি।" });
  }
};

// @desc    Delete a product (Admin)
// @route   DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "প্রোডাক্টটি খুঁজে পাওয়া যায়নি।" });
    }
    res.json({ message: "প্রোডাক্টটি সফলভাবে ডিলিট করা হয়েছে।" });
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    res.status(500).json({ error: "সার্ভার এরর! প্রোডাক্ট ডিলিট করা যায়নি।" });
  }
};

// @desc    Add review to product
// @route   POST /api/products/:id/reviews
export const addProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    // For demo purposes, we fallback to Anonymous or User name if logged in
    const username = req.user ? req.user.name : "বেনামী গ্রাহক";

    if (!rating || !comment) {
      return res.status(400).json({ error: "রেটিং এবং মন্তব্য উভয়ই আবশ্যক।" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "প্রোডাক্টটি খুঁজে পাওয়া যায়নি।" });
    }

    const newReview = {
      username,
      rating: Number(rating),
      comment,
      createdAt: new Date()
    };

    product.reviews.push(newReview);
    
    // Recalculate average rating
    const totalRating = product.reviews.reduce((acc, item) => item.rating + acc, 0);
    product.rating = Number((totalRating / product.reviews.length).toFixed(1));

    await product.save();
    res.status(201).json({ message: "রিভিউটি সফলভাবে যুক্ত হয়েছে!", product });
  } catch (error) {
    console.error("Error in addProductReview:", error);
    res.status(500).json({ error: "সার্ভার এরর! রিভিউ যুক্ত করা যায়নি।" });
  }
};
