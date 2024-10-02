const { OpenAI } = require("openai"); 

async function CreateFineTune(fileId){
    const openai = new OpenAI({
        apiKey: "sk-RB4yfZYpnaZxx75-_ERoriYYm0BaUQRdndYcYG9N0-T3BlbkFJld_0D-SrMLuifCK_WPRJkSWGEQAONhbCAj_y9c9zYA",
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