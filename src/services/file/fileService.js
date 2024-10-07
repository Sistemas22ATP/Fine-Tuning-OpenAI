const fs = require("fs");
const pdf = require("pdf-parse");
const { OpenAI } = require("openai");

async function TransformData() {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
    
    const pdfBuffer = fs.readFileSync("src/shared/202408012132082488.pdf");
    const pdfData = await pdf(pdfBuffer);
    
    const productInfo = pdfData.text;

    console.log(productInfo);

    const qaPairs = [
        "Describe el objetivo principal de este procedimiento de desarrollo de software",
        "¿A quiénes aplica el alcance de este procedimiento? Enumera los grupos de personal involucrados.",
        "Explica qué es un Backlog en el contexto de un proyecto de software.",
        "Define qué es un RFP y su importancia en el proceso de desarrollo de software.",
        "¿Qué es un Sprint y cuál es su duración típica según el procedimiento?",
        "Indica las responsabilidades del usuario solicitante en el desarrollo de software.",
        "Describe las actividades que debe realizar un desarrollador Sr durante un proyecto.",
        "¿Cuál es el papel del coordinador de desarrollo en la creación del Backlog?",
        "Explica cómo el usuario solicitante organiza las funciones por prioridad en el Backlog.",
        "Describe el proceso de revisión de un RFP. ¿Qué se debe asegurar el coordinador de desarrollo?",
        "¿Cuáles son los pasos a seguir después de definir un Sprint?",
        "Explica el proceso de preparación del ambiente de desarrollo y su plazo máximo.",
        "¿Qué acciones debe llevar a cabo el equipo de desarrollo asignado durante la programación?",
        "Detalla el proceso de validación de funciones tras completar el procedimiento de programación.",
        "¿Qué es una demostración y cuál es su importancia en el proceso de desarrollo?",
        "Explica qué se incluye en la constancia de entrega de sprint y quiénes deben firmarla.",
        "Describe el proceso de Deploy y su horario recomendado.",
        "¿Qué sanciones pueden enfrentarse los usuarios que incumplan con este procedimiento?",
        "Enumera los entregables que se generan a lo largo del proceso de desarrollo de software.",
        "¿Qué métricas se utilizan para evaluar el progreso de los proyectos asignados?",
        "¿Qué documentos de referencia son mencionados en este procedimiento?",
        "Explica el control de cambios que se ha aplicado a este procedimiento. ¿Qué modificaciones se realizaron en la revisión del 01/08/2024?"
    ];

    for (const question of qaPairs) {
        const answer = await getAnswerFromOpenAI(openai, question, productInfo);
        const object = `{"prompt": "${question} ->", "completion": "${answer} END"}`;
        fs.appendFileSync("src/shared/data-set.jsonl", object + "\r\n", "utf8");
    }
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

TransformData();

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
    DeleteFile
}