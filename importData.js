const mongoose = require("mongoose");
const fs = require("fs");
const City = require("./models/City");

// MongoDB bağlantısı
mongoose.connect("mongodb+srv://keremhvlc:kerem.1234@clone.nrd0p.mongodb.net/?retryWrites=true&w=majority&appName=clone", )
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((error) => {
    console.error("Error connecting to DB:", error);
  });

// JSON dosyalarını okuma
const cities = JSON.parse(fs.readFileSync("turkiye-adresler/sehirler.json", "utf8"));
const districts = JSON.parse(fs.readFileSync("turkiye-adresler/ilceler.json", "utf8"));
const neighborhoods1 = JSON.parse(fs.readFileSync("turkiye-adresler/mahalleler-1.json", "utf8"));
const neighborhoods2 = JSON.parse(fs.readFileSync("turkiye-adresler/mahalleler-2.json", "utf8"));
const neighborhoods3 = JSON.parse(fs.readFileSync("turkiye-adresler/mahalleler-3.json", "utf8"));
const neighborhoods4 = JSON.parse(fs.readFileSync("turkiye-adresler/mahalleler-4.json", "utf8"));

// Mahalle verilerini birleştirme
const allNeighborhoods = [...neighborhoods1, ...neighborhoods2, ...neighborhoods3, ...neighborhoods4];

// Verileri MongoDB'ye aktar
const importData = async () => {
  try {
    await City.deleteMany(); // Eski verileri temizle

    // Şehir verilerini formatla
    const formattedCities = cities.map((city) => {
      // İlçeleri bul
      const cityDistricts = districts
        .filter((district) => district.sehir_id === city.sehir_id)  // Şehir ID'sine göre ilçeleri filtrele
        .map((district) => {
          // Mahalleleri bul
          const districtNeighborhoods = allNeighborhoods
            .filter((neighborhood) => neighborhood.ilce_id === district.ilce_id) // İlçe ID'sine göre mahalleleri filtrele
            .map((neighborhood) => ({ name: neighborhood.mahalle_adi, neighborhood_id: neighborhood.mahalle_id })); // Mahalle adlarını ve ID'lerini al

          return {
            name: district.ilce_adi,  // İlçe adını al
            neighborhoods: districtNeighborhoods, // Mahalleleri ekle
          };
        });

      return {
        name: city.sehir_adi,  // Şehir adını al
        districts: cityDistricts,  // İlçeleri ekle
      };
    });

    // Verileri MongoDB'ye ekle
    await City.insertMany(formattedCities);
    console.log("Veriler Başarıyla MongoDB'ye Eklendi!");
    process.exit();
  } catch (error) {
    console.log("Hata", error);
    process.exit(1);
  }
};

importData();
