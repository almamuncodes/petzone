import Product from "../models/Product.js";

// @desc    Get dashboard statistics for charts & metrics
// @route   GET /api/dashboard/stats
export const getDashboardStats = async (req, res) => {
  try {
    // 1. Core counters
    const totalProducts = await Product.countDocuments();
    
    // Total stock count and total review counts
    const products = await Product.find({}, "stock reviews");
    const totalStock = products.reduce((acc, p) => acc + (p.stock || 0), 0);
    const totalReviews = products.reduce((acc, p) => acc + (p.reviews?.length || 0), 0);

    // 2. Category distribution for pie chart
    const categoryStats = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          value: { $sum: 1 }
        }
      },
      {
        $project: {
          name: "$_id",
          value: 1,
          _id: 0
        }
      }
    ]);

    // 3. Pet Type distribution for bar chart
    const petTypeStats = await Product.aggregate([
      {
        $group: {
          _id: "$petType",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          name: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id", "dog"] }, then: "কুকুর" },
                { case: { $eq: ["$_id", "cat"] }, then: "বিড়াল" },
                { case: { $eq: ["$_id", "bird"] }, then: "পাখি" },
                { case: { $eq: ["$_id", "fish"] }, then: "মাছ" }
              ],
              default: "অন্যান্য"
            }
          },
          count: 1,
          _id: 0
        }
      }
    ]);

    // 4. Five most recent products
    const recentProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      metrics: {
        totalProducts,
        totalStock,
        totalReviews,
        avgRating: totalProducts > 0 ? 4.7 : 0 // Mock placeholder average rating
      },
      categoryStats,
      petTypeStats,
      recentProducts
    });
  } catch (error) {
    console.error("Error in getDashboardStats:", error);
    res.status(500).json({ error: "সার্ভার এরর! ড্যাশবোর্ড পরিসংখ্যান লোড করা যায়নি।" });
  }
};
