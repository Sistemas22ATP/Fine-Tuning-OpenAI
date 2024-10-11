const { response } = require("express");

document.getElementById("submit").addEventListener("click", async () => {
    const prompt = document.getElementById("prompt").value; 
    const responseDiv = document.getElementById("response"); 

    if (!prompt) {
        responseDiv.innerText = "Por favor, escribe una pregunta.";
        return;
    } 

    responseDiv.inner = "Cargando..."; 

    try {
        const response = await fetch('/api/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
            }, 
            body: JSON.stringify({ question: prompt }),
        });

        const data = await response.json(); 
        responseDiv.innerText = data.asnwers || "Respuesta no disponible."; 
    } catch (error) {
        responseDiv.innerText = "Error al obtener respuesta."; 
        console.error(error);
    } 

}); 