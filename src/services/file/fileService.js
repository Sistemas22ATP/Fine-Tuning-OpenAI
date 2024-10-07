const fs = require("fs");
const pdf = require("pdf-parse");
const { OpenAI } = require("openai");

async function TransformData() {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
    
    const pdfBuffer = fs.readFileSync("src/shared/202406281441230174.pdf");
    const pdfData = await pdf(pdfBuffer);
    
    const productInfo = pdfData.text;

    console.log(productInfo);

    const qaPairs = [
        "Proporciona un resumen del objetivo del procedimiento para dar de alta una sección de nuevo producto en la página web.",
        "¿Qué roles están involucrados en el alcance del procedimiento y cuáles son sus responsabilidades?",
        "Define 'BackOffice' en el contexto del e-commerce según el documento.",
        "¿Qué es un 'E-Commerce' y qué funciones principales tiene en el procedimiento?",
        "Explica qué es el formato de imágenes webp y su importancia en la creación de secciones de productos.",
        "Describe la responsabilidad del Desarrollador Junior en el proceso de alta de nuevos productos.",
        "¿Qué información debe enviar el Desarrollador de Negocios e Innovación al solicitar la creación de un nuevo producto?",
        "¿Cómo debe proceder el Desarrollador Junior si la solicitud recibida no cuenta con toda la información necesaria?",
        "Detalla los pasos que debe seguir el Desarrollador Junior para crear una nueva sección en el BackOffice.",
        "¿Qué acciones debe tomar el Desarrollador de Negocios e Innovación tras recibir el enlace de la nueva sección para su revisión?",
        "Enumera las posibles respuestas que el Desarrollador de Negocios e Innovación puede dar después de revisar la nueva sección.",
        "Describe el proceso de habilitación de la nueva sección una vez que ha sido autorizada.",
        "¿Qué información debe validar el Desarrollador Junior después de habilitar la nueva sección?",
        "Explica el procedimiento para que el Supervisor de E-Commerce valide la información de la nueva sección.",
        "¿Qué sanciones se mencionan en el documento por incumplimiento del procedimiento?",
        "Detalla los entregables esperados al finalizar el proceso de alta de un nuevo producto.",
        "¿Cuáles son las métricas de tiempo establecidas para el alta de la sección del nuevo producto?",
        "¿Qué documento se menciona como referencia para el procedimiento de alta de producto nuevo en la página web?",
        "Proporciona ejemplos de información que se debe incluir en la ficha técnica comprimida.",
        "¿Cómo se debe comunicar el alta de un nuevo producto al equipo involucrado?",
        "Describe las características principales que deben mostrarse en el título del nuevo producto.",
        "¿Qué materiales gráficos son requeridos por el departamento de Mercadotecnia para la alta de la sección del nuevo producto?"
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