const fs = require("fs");
const pdf = require("pdf-parse");
const { OpenAI } = require("openai");

async function TransformData() {
    const openai = new OpenAI({
        apiKey: "sk-RB4yfZYpnaZxx75-_ERoriYYm0BaUQRdndYcYG9N0-T3BlbkFJld_0D-SrMLuifCK_WPRJkSWGEQAONhbCAj_y9c9zYA",
    });
    
    const pdfBuffer = fs.readFileSync("src/shared/202403052204530809.pdf");
    const pdfData = await pdf(pdfBuffer);
    
    const productInfo = pdfData.text;

    console.log(productInfo);

    const qaPairs = [
        "¿Cuál es el objetivo principal del Desarrollador de Power BI según el documento?",
        "Describe el alcance de las actividades que se espera que realice el Desarrollador de Power BI.",
        "¿Qué significa BI en el contexto de este documento?",
        "Explica brevemente qué es Dynamics 365 F&O y su función en la gestión empresarial.",
        "¿Cuál es la función de Jira como sistema de tickets dentro del área de TI?",
        "Define el concepto de Tecnologías de Información (TI) y su importancia en las empresas.",
        "¿Qué es un ticket y en qué situaciones se utiliza en la gestión de TI?",
        "¿Cómo se define SCRUM y cuáles son sus componentes clave en el desarrollo de software?",
        "¿Qué implica la actividad de seguimiento de proyectos asignados para un Desarrollador de Power BI?",
        "¿Qué se espera lograr al monitorear el progreso de los proyectos asignados?",
        "Describe el proceso que se sigue durante el levantamiento de requerimientos en el desarrollo de software.",
        "¿Cuál es la importancia de entender las necesidades del usuario antes de iniciar el desarrollo de una solución?",
        "¿Cómo se relaciona el desarrollo de informes con las solicitudes generadas por los usuarios?",
        "¿Qué pasos se deben seguir para garantizar la entrega exitosa de los resultados esperados por el usuario solicitante?",
        "¿Qué referencia se menciona para el desarrollo de software en el documento?",
        "¿Qué actividades específicas se incluyen en el rol del Desarrollador de Power BI?",
        "¿Por qué es importante la comunicación con los miembros del equipo en el seguimiento de proyectos?",
        "¿Cómo se pueden identificar y resolver problemas o desviaciones en el avance de un proyecto?",
        "¿Qué es un sprint en el contexto de SCRUM y cómo se relaciona con la entrega de valor?",
        "¿Cómo contribuye el Desarrollador de Power BI al avance de la misión y visión empresarial?",
        "¿Qué herramientas o recursos se pueden utilizar para el procesamiento y almacenamiento de información en TI?",
        "¿Cuál es el papel de los usuarios clave en el seguimiento de proyectos asignados?"
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
        apiKey: "sk-RB4yfZYpnaZxx75-_ERoriYYm0BaUQRdndYcYG9N0-T3BlbkFJld_0D-SrMLuifCK_WPRJkSWGEQAONhbCAj_y9c9zYA",
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
        apiKey: "sk-RB4yfZYpnaZxx75-_ERoriYYm0BaUQRdndYcYG9N0-T3BlbkFJld_0D-SrMLuifCK_WPRJkSWGEQAONhbCAj_y9c9zYA",
    });

    const response = await openai.files.list();
    return response; 
}

async function RetrieveFile(fileId) {
    const openai = new OpenAI({
        apiKey: "sk-RB4yfZYpnaZxx75-_ERoriYYm0BaUQRdndYcYG9N0-T3BlbkFJld_0D-SrMLuifCK_WPRJkSWGEQAONhbCAj_y9c9zYA",
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
        apiKey: "sk-RB4yfZYpnaZxx75-_ERoriYYm0BaUQRdndYcYG9N0-T3BlbkFJld_0D-SrMLuifCK_WPRJkSWGEQAONhbCAj_y9c9zYA",
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