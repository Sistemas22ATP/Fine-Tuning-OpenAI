const fs = require("fs");
const fs2 = require("fs").promises
const pdf = require("pdf-parse");
const { OpenAI } = require("openai");

async function TransformData(qaPairs) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    }); 

    const pdfs = [
        "src/shared/202409182226312576.pdf", 
        "src/shared/202408121854108846.pdf", 
        "src/shared/202408061658530486.pdf", 
        "src/shared/202408061655494402.pdf", 
        "src/shared/202408012132082488.pdf", 
        "src/shared/202406281441230174.pdf",
        "src/shared/202403052204530809.pdf"
    ]

    let contenidos = "";
    for (let i of pdfs){

        const pdfBuffer = await fs2.readFile(i);
        contenidos += (await pdf(pdfBuffer)).text;
    }

    console.log(contenidos);

    let respuestas = []
    
    for (const question of qaPairs) {
        const answer = await getAnswerFromOpenAI(openai, question, contenidos);
        const object = `{"prompt": "${question} ->", "completion": "${answer} END"}`;
        respuestas.push(object);
        fs.appendFileSync("src/shared/data-set.jsonl", object + "\r\n", "utf8");
    }

    return respuestas
}

async function getAnswerFromOpenAI(openai, question, context) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [
                { role: "system", content: "Eres un asistente útil que extrae información del texto proporcionado." },
                { role: "user", content: `Con base en el siguiente texto:\n\n${context}\n\nResponde la pregunta: ${question}` }
            ],
            max_tokens: 200, 
        });
        
        return response.choices[0].message.content.trim();
    } catch (error) {
        console.error("Error al obtener respuesta de OpenAI:", error);
        return "Información no disponible.";
    }
}

async function UploadFile() {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    const fileStream = fs.createReadStream("src/shared/data-set.jsonl");
    const response = await openai.files.create({
        file: fileStream,
        purpose: 'fine-tune', 
    });

    return response; 
}

async function ListFiles() {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.files.list();
    return response; 
}

async function RetrieveFile(fileId) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    try {
        const response = await openai.files.retrieve(fileId); 
        return response;
    } catch(e) {
        return "fileId not found"; 
    }
}

async function DeleteFile(fileId) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    try {
        const response = await openai.files.delete(fileId); 
        return response;
    } catch(e) {
        return "fileId not found"; 
    }
}

module.exports = {
    TransformData,
    UploadFile,
    ListFiles,
    RetrieveFile,
    DeleteFile,
}