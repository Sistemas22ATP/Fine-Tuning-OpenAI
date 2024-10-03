const fs = require("fs");
const pdf = require("pdf-parse");
const { OpenAI } = require("openai");

async function TransformData() {
    const pdfBuffer = fs.readFileSync("src/shared/202403052204530809.pdf");
    const pdfData = await pdf(pdfBuffer);
    
    const productInfo = pdfData.text;

    console.log(productInfo); 

    const qaPairs = [];

    const addQuestionAnswer = (question, answer) => {
        qaPairs.push({ question, answer });
    };

    addQuestionAnswer("¿Cuál es el objetivo principal del Desarrollador de Power BI según el documento?", extractValue(productInfo, "1.0  Objetivo"));
    addQuestionAnswer("Describe el alcance de las actividades que se espera que realice el Desarrollador de Power BI.", extractValue(productInfo, "Área de tecnologías de"));
    addQuestionAnswer("¿Qué significa BI en el contexto de este documento?", extractValue(productInfo, "3.1 BI"));
    addQuestionAnswer("Explica brevemente qué es Dynamics 365 F&O y su función en la gestión empresarial.", extractValue(productInfo, "3.2  Dynamics  365  F&O"));
    addQuestionAnswer("¿Cuál es la función de Jira como sistema de tickets dentro del área de TI?", extractValue(productInfo, "3.3 Jira (Sistema de Tickets)"));
    addQuestionAnswer("Define el concepto de Tecnologías de Información (TI) y su importancia en las empresas.", extractValue(productInfo, "3.4  TI  (Tecnologías  de  Información)"));
    addQuestionAnswer("¿Qué es un ticket y en qué situaciones se utiliza en la gestión de TI?", extractValue(productInfo, "Es un registro o"));
    addQuestionAnswer("¿Cómo se define SCRUM y cuáles son sus componentes clave en el desarrollo de software?", extractValue(productInfo, "Scrum  es  un"));
    addQuestionAnswer("¿Qué implica la actividad de seguimiento de proyectos asignados para un Desarrollador de Power BI?", extractValue(productInfo, "Esta actividad consiste en"));
    addQuestionAnswer("¿Qué se espera lograr al monitorear el progreso de los proyectos asignados?", extractValue(productInfo, "El  objetivo  es  asegurarse  de  que  los  proyectos"));
    addQuestionAnswer("Describe el proceso que se sigue durante el levantamiento de requerimientos en el desarrollo de software.", extractValue(productInfo, "PROPIEDADES."));
    addQuestionAnswer("¿Cuál es la importancia de entender las necesidades del usuario antes de iniciar el desarrollo de una solución?", extractValue(productInfo, "Grosor"));
    addQuestionAnswer("¿Cómo se relaciona el desarrollo de informes con las solicitudes generadas por los usuarios?", extractValue(productInfo, "Adhesivo"));
    addQuestionAnswer("¿Qué pasos se deben seguir para garantizar la entrega exitosa de los resultados esperados por el usuario solicitante?", extractValue(productInfo, "Durabilidad"));
    addQuestionAnswer("¿Qué referencia se menciona para el desarrollo de software en el documento?", extractValue(productInfo, "Acabado"));
    addQuestionAnswer("¿Qué actividades específicas se incluyen en el rol del Desarrollador de Power BI?", extractValue(productInfo, "Medidas"));
    addQuestionAnswer("¿Por qué es importante la comunicación con los miembros del equipo en el seguimiento de proyectos?", extractValue(productInfo, "Color"));
    addQuestionAnswer("¿Cómo se pueden identificar y resolver problemas o desviaciones en el avance de un proyecto?", extractValue(productInfo, "ALMACENAMIENTO."));
    addQuestionAnswer('¿Qué es un "sprint" en el contexto de SCRUM y cómo se relaciona con la entrega de valor?', extractValue(productInfo, "Vida en anaquel"));
    addQuestionAnswer("¿Cómo contribuye el Desarrollador de Power BI al avance de la misión y visión empresarial?", extractValue(productInfo, "APLICACIONES"));
    addQuestionAnswer("¿Qué herramientas o recursos se pueden utilizar para el procesamiento y almacenamiento de información en TI?", extractValue(productInfo, "MANEJO."));
    addQuestionAnswer("¿Cuál es el papel de los usuarios clave en el seguimiento de proyectos asignados?", extractValue(productInfo, "PROPIEDADES."));

    for (const item of qaPairs) {
        const object = `{"prompt": "${item.question} ->", "completion": "${item.answer} END"}`;
        fs.appendFileSync("src/shared/data-set.jsonl", object + "\r\n", "utf8");
    }
}

function extractValue(text, keyword) {
    const regex = new RegExp(`${keyword}:?\\s*([^\\n]*)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : "Información no disponible.";
}

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

async function ListFiles(){
    const openai = new OpenAI({
        apiKey: "sk-RB4yfZYpnaZxx75-_ERoriYYm0BaUQRdndYcYG9N0-T3BlbkFJld_0D-SrMLuifCK_WPRJkSWGEQAONhbCAj_y9c9zYA",
    });

    const response = await openai.files.list();
    return response; 
}

async function RetrieveFile(fileId){
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

async function DeleteFile(fileId){
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