

const Chat=require('../models/chatmodel')

const User = require('../models/Usermodel')


const dotenv = require("dotenv");
dotenv.config();



const OpenAI =require ("openai");


const openai = new OpenAI({
  key: process.env.OPENAI_API_KEY,
});





const summaryController = async (req, res) => {
    try {
      const { text }=req.body     
       const response = await openai.completions.create({
        model: "gpt-3.5-turbo-instruct",
      prompt:`Summarize this\n${text}`,
      max_tokens: 500,
      temperature: 0.5,
      });
      console.log("OpenAI API Response:", response);
  
      if (
        response &&
        response.choices &&
        Array.isArray(response.choices) &&
        response.choices.length > 0 &&
        response.choices[0].text
        ) {
          const generatedContent = response.choices[0].text.trim();
          console.log("Generated Content:", generatedContent);
          res.status(200).json({ generatedContent });
        } else {
          console.error("Unexpected response structure from OpenAI:", response);
          res.status(500).json({ error: "Unexpected response structure from OpenAI" });
        }
      } catch (err) {
        console.error("Error from OpenAI API:", err);
        res.status(500).json({ error: "Error from OpenAI API" });
      }
    };

















const paragraphController = async (req, res) => {
  try {
    const { text }= req.body
    const response = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
    prompt: `write a detail paragraph about \n${text}`,
    max_tokens: 500,
    temperature: 0.5,
    });
    console.log("OpenAI API Response:", response);

    if (
      response &&
      response.choices &&
      Array.isArray(response.choices) &&
      response.choices.length > 0 &&
      response.choices[0].text
      ) {
        const generatedContent = response.choices[0].text.trim();
        console.log("Generated Content:", generatedContent);
        res.status(200).json({ generatedContent });
      } else {
        console.error("Unexpected response structure from OpenAI:", response);
        res.status(500).json({ error: "Unexpected response structure from OpenAI" });
      }
    } catch (err) {
      console.error("Error from OpenAI API:", err);
      res.status(500).json({ error: "Error from OpenAI API" });
    }
  };


  const chatbotController = async (req, res) => {
    try {
      const { text, currentModel } = req.body;
      console.log('User ID:', req.userId);

      // Save user message to the database
      const userMessage = await Chat.create({
        owner:req.userId,
        role: 'user',
        content: text,
      });
  
      // Call OpenAI API
      const response = await openai.chat.completions.create({
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: text },
        ],
        model: `${currentModel}`,
        max_tokens: 300,
        temperature: 0.7,
      });
  
      // Save chatbot response to the database
      const generatedContent = response.choices[0]?.message?.content || '';
      await Chat.create({owner:req.userId,
        role: 'chatbot',
        content: generatedContent,
      });
  
      console.log('Generated Content:', generatedContent);
  
      res.status(200).json({ userMessage,generatedContent });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };


  const getmychat = async (req, res) => {
    try {
      console.log('User ID:', req.userId);

      const history = await Chat.find({ owner: req.userId }).populate({
        path: 'owner',
        select: '-password -__v',
      });
  
      res.json(history);
    } catch (error) {
      console.error('Error:', error);
      res.status(501).json({ message: error.message });
    }
  };







  const modelsController = async (req, res) => {
    try {
      const response = await openai.models.list();
      console.log("OpenAI Models List:", response.data);

      // Extract relevant information from the response
      const modelNames = response.data
  
      // Send a clearer and more informative response to the client
      res.status(200).json(modelNames)
    } catch (error) {
      console.error("Error from OpenAI API:", error);
      res.status(500).json({ error: "Error from OpenAI API" });
    }
  };









 const jsconverterController = async (req, res) => {
  try {
    const { text }= req.body
    const response = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt: `/* convert these instruction into javascript code \n${text}`,
      max_tokens: 400,
      temperature: 0.25,

    });
    console.log("OpenAI API Response:", response);

    if (
      response &&
      response.choices &&
      Array.isArray(response.choices) &&
      response.choices.length > 0 &&
      response.choices[0].text
      ) {
        const generatedContent = response.choices[0].text.trim();
        console.log("Generated Content:", generatedContent);
        res.status(200).json({ generatedContent });
      } else {
        console.error("Unexpected response structure from OpenAI:", response);
        res.status(500).json({ error: "Unexpected response structure from OpenAI" });
      }
    } catch (err) {
      console.error("Error from OpenAI API:", err);
      res.status(500).json({ error: "Error from OpenAI API" });
    }
  };



const scifiImageController = async (req, res) => {
  const { text }= req.body

  try {
    const response = await openai.createImage({
      model: "image-alpha-001",
      prompt: `generate a scifi image of ${text}`,
      n: 1,
      size: "1024x1024",
    });
    image_url = response.data.data[0].url;


    if (
      response &&
      response.data &&
      Array.isArray(response.data.data[0]) &&
      response.data.data.length > 0 &&
      response.data.data[0].url
    ) {
      console.log("Contenu généré :", response.data.data[0].url);
      // Vous pouvez utiliser cette URL pour afficher l'image dans votre application
    } else {
      console.error("Structure de réponse inattendue d'OpenAI :", response);
    }
  } catch (err) {
    console.error("Erreur de l'API OpenAI :", err);
  }
};





























module.exports = { getmychat,summaryController , paragraphController ,chatbotController, jsconverterController,scifiImageController,modelsController
}