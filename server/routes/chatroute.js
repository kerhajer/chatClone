const express = require("express");
const Openaicontroller = require("../controllers/Openaicontroller");
const {AuthMiddleWare} =require ("../Authmiddleware/Authmiddleware")

const router = express.Router();

//route
router.post("/summary", Openaicontroller.summaryController);
router.get("/models",AuthMiddleWare, Openaicontroller.modelsController);
router.get("/chatbot/history",AuthMiddleWare, Openaicontroller.getmychat);

router.post("/paragraph", Openaicontroller.paragraphController);
router.post("/chatbot",AuthMiddleWare, Openaicontroller.chatbotController);

router.post("/js-converter", Openaicontroller.jsconverterController);
router.post("/scifi-image", Openaicontroller.scifiImageController);

module.exports = router;