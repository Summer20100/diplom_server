const { Router } = require("express");

const controllerQRCode = require("../../controllers/admin/controllerQRCode");

const router = Router();

router.post("/", controllerQRCode.createQRCode);

module.exports = router;
