document.getElementById("submit").addEventListener("click", async () => {
    const prompt = document.getElementById("prompt").value; 
    const responseDiv = document.getElementById("response"); 

    if (!prompt) {
        responseDiv.innerText = "Por favor, escribe una pregunta.";
        return;
    } 

    responseDiv.inner = "Cargando..."; 

    try {
        const response = await fetch('http://localhost:3000/api/preguntas-persona', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
            }, 
            body: JSON.stringify({ preguntas: [prompt] }),
        });

        const data = await response.json(); 
        console.log("El valor dela data: ", data)
        console.log("El data.completion: ", data.completion)
        responseDiv.innerText = data.completion || "Respuesta no disponible."; 
    } catch (error) {
        responseDiv.innerText = "Error al obtener respuesta."; 
        console.error(error);
    } 

}); 