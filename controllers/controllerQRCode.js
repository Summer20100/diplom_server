const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const createQRCode = async (req, res) => {
  const dataQR = req.body;
  const outputPath = path.join(__dirname, 'qrcode.png');

  try {
    await QRCode.toFile(outputPath, JSON.stringify(dataQR));
    res.sendFile(outputPath);
  } catch (err) {
    console.error('Ошибка генерации QR-кода:', err);
    return res.status(500).json({ error: "Ошибка генерации QR-кода" });
  }
};

module.exports = {
  createQRCode,
};
