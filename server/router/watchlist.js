const express = require("express");
const router = express.Router();
const Watchlist = require("../schema/Watchlist");

router.post("/watchlist", async (req, res) => {
  console.log("=== ADD TO WATCHLIST DEBUG ===");
  console.log("Request body:", JSON.stringify(req.body, null, 2));
  
  const { username, product } = req.body;

  if (!username) {
    console.log("ERROR: No username provided");
    return res.status(400).json({ error: "Username is required" });
  }

  if (!product) {
    console.log("ERROR: No product provided");
    return res.status(400).json({ error: "Product is required" });
  }

  try {
    const existingItem = await Watchlist.findOne({
      username,
      name: product.name
    });

    if (existingItem) {
      console.log("Item already in watchlist");
      return res.status(200).json({ message: "Already in watchlist" });
    }

    const item = new Watchlist({
      username,
      name: product.name,
      price: product.price,
      img: product.img
    });
    await item.save();
    console.log("Watchlist item saved successfully!");
    res.status(200).json({ message: "Added to watchlist" });
  } catch (err) {
    console.error("=== WATCHLIST ERROR ===");
    console.error("Error message:", err.message);
    console.error("Error stack:", err.stack);
    res.status(500).json({ error: "Failed to save", details: err.message });
  }
});

router.get("/watchlist/:username", async (req, res) => {
  try {
    const items = await Watchlist.find({ username: req.params.username });
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json("Error fetching watchlist");
  }
});

// Delete item
router.delete("/watchlist/:id", async (req, res) => {
  try {
    await Watchlist.findByIdAndDelete(req.params.id);
    res.status(200).json("Item removed");
  } catch (err) {
    res.status(500).json("Delete failed");
  }
});

module.exports = router;
