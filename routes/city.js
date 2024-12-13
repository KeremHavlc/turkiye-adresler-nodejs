const express = require("express");
const City = require("../models/City");

const router = express.Router();

// Tüm şehirleri getir
router.get("/cities", async (req, res) => {
  try {
    const cities = await City.find({}, { name: 1 });
    res.json(cities);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Seçilen şehir id'ye göre ilçeleri getir
router.get("/cities/:cityId/districts", async (req, res) => {
  try {
    const cityId = req.params.cityId;
    const city = await City.findById(cityId, { districts: 1 });
    res.json(city.districts);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Seçilen ilçe adına göre mahalleleri getir
router.get("/districts/:districtName/neighborhoods", async (req, res) => {
  try {
    const districtName = req.params.districtName;
    const city = await City.findOne({ "districts.name": districtName }, { "districts.$": 1 });
    const neighborhoods = city.districts[0].neighborhoods;
    res.json(neighborhoods);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
