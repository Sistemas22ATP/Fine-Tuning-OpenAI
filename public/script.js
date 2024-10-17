//const { error } = require('pdf-lib');

document.getElementById("submit").addEventListener("click", async () => {
    const prompt = document.getElementById("prompt").value; 
    const responseDiv = document.getElementById("response"); 

    if (!prompt) {
        responseDiv.innerText = "Por favor, escribe una pregunta.";
        return;
    } 

    responseDiv.innerText = "Cargando..."; 


    try {
        // Make a POST request using axios
        const response = await axios.post('http://localhost:3000/api/preguntas-persona', {
            preguntas: [prompt]
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Parse and display the response data
        const data = response.data; // axios automatically parses JSON for you
        console.log("El valor de la data: ", data);
        responseDiv.innerText = data[0].completion || "Respuesta no disponible."; 

    } catch (error) {
        // Handle errors from axios
        responseDiv.innerText = "Error al obtener respuesta.";
        console.error("Axios Error:", error.response || error.message);
    }

    
});
