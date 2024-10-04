const { OpenAI } = require("openai"); 

async function CreateFineTune(fileId){
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    try{
        const response = await openai.fineTunes.create({
            training_file: fileId,
            model: "gpt-4o",
            suffix: "question-answer-01"
        }); 
    
        return response;
    }catch(e){
        return {status: 400, data: e}
    }
}

module.exports = {
    CreateFineTune
}