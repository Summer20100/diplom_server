const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const createQRCode = async (req, res) => {
  const dataQR = req.body;
  const outputPath = path.join(__dirname, 'qrcode.png');

  try {
    await QRCode.toFile(outputPath, JSON.stringify(dataQR));
    console.log('QR-код успешно сгенерирован');
    res.sendFile(outputPath);
  } catch (err) {
    console.error('Ошибка при генерации QR-кода:', err);
    return res.status(500).json({ error: "Ошибка при генерации QR-кода" });
  }
};

module.exports = {
  createQRCode,
};
