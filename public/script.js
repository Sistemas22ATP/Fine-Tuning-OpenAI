document.getElementById("submit").addEventListener("click", async () => {
    const prompt = document.getElementById("prompt").value; 
    const responseDiv = document.getElementById("response"); 

    if (!prompt) {
        responseDiv.innerText = "Por favor, escribe una pregunta.";
        return;
    } 

    responseDiv.innerText = "Cargando..."; 

    try {
        console.log("entre al try")
        const response = await fetch ('http://localhost:3000/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
            }, 
            body: JSON.stringify({ preguntas: [prompt] }),
        });

        console.log("el valor del response.status", response.status);

        const data = await response.json(); 
        console.log("El valor de la data: ", data);

        if (data && data.completion) {
            responseDiv.innerText = data.completion;
        } else {
            responseDiv.innerText = "Respuesta no disponible.";
            console.error("Estructura de repuesta inesperada: ", data); 
        }
        
    } catch (error) {
        responseDiv.innerText = "Error al obtener respuesta."; 
        console.error("Error en la solicitud; ", error);
    } 

});