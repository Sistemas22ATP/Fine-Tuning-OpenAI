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
        const response = await fetch('/api/ask', )
    }

}) 