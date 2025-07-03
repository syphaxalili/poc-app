const express = require("express");
const router = express.Router();

const huggingController = require("../controllers/huggingController");

router.post("/test-ia", huggingController.upload, huggingController.handleUploadAndProcess);

module.exports = router;
