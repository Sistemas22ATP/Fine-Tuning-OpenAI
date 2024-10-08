const fs = require("fs");
const pdf = require("pdf-parse");
const { OpenAI } = require("openai");

async function TransformData() {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    }); 
    
    const pdfBuffer = fs.readFileSync(
        "src/shared/202409182226312576.pdf", 
        "src/shared/202408121854108846.pdf", 
        "src/shared/202408061658530486.pdf", 
        "src/shared/202408061655494402.pdf", 
        "src/shared/202408012132082488.pdf", 
        "src/shared/202406281441230174.pdf",
        "src/shared/202403052204530809.pdf"
    );

    const pdfData = await pdf(pdfBuffer);
    
    const productInfo = pdfData.text;

    console.log(productInfo);

    const qaPairs = [
        "¿Cuáles son las actividades diarias que debe realizar el Gerente de TI según el documento?",
        "Describe la responsabilidad del Gerente de TI en la continuidad de operaciones.",
        "¿Qué sistemas y herramientas debe utilizar el Gerente de TI para la gestión de incidencias?",
        "¿Cuáles son las principales actividades mensuales que debe llevar a cabo el Gerente de TI?",
        "Explica cómo el Gerente de TI debe llevar a cabo la rendición de cuentas con la gerencia general.",
        "¿Qué información es esencial para mantener actualizada la plataforma Project según las directrices del documento?",
        "Describe el proceso de captura de indicadores que realiza el Gerente de TI.",
        "¿Cómo se debe asegurar la actualización del calendario de suscripciones en la empresa?",
        "Explica la importancia de los PACs y cómo el Gerente de TI debe actualizarlos.",
        "¿Cuáles son las responsabilidades específicas del Desarrollador Jr en el departamento de TI?",
        "¿Qué procedimientos debe seguir el Gerente de TI para la contratación de servicios y autorización de compras?",
        "Enumera los departamentos con los que el Gerente de TI debe interactuar y su relevancia.",
        "¿Qué herramientas y plataformas se mencionan en el documento y para qué sirven?",
        "Describe el proceso de actualización de procedimientos que debe llevar a cabo el Gerente de TI.",
        "¿Cuáles son las preguntas clave que el Gerente de TI debe hacer en el Daily Scrum Meeting?",
        "Explica el rol de la infraestructura en las actividades del Gerente de TI.",
        "¿Qué pasos debe seguir el Gerente de TI para garantizar la integridad de la información almacenada?",
        "¿Cómo debe el Gerente de TI gestionar el seguimiento de correos electrónicos?",
        "Describe las responsabilidades del Administrador de infraestructura en el equipo de TI.",
        "¿Qué información se debe incluir en la entrega de resultados mensual?",
        "¿Cómo se realiza la captura de incidencias en la plataforma intranet?",
        "Explica la relación entre el Gerente de TI y los indicadores de desempeño dentro del departamento."
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