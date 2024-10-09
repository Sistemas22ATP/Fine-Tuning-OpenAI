document.getElementById('questionForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const question = document.getElementById('question').value;

    const responseDiv = document.getElementById('response');
    responseDiv.innerText = 'Cargando...';

    try {
        const res = await fetch('/api/preguntas-persona', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ preguntas: [question] }),
        });

        // Verifica si la respuesta fue exitosa
        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`HTTP error! Status: ${res.status} - ${errorText}`);
        }

        const data = await res.json();
        responseDiv.innerText = data || 'No se obtuvo respuesta.';
    } catch (error) {
        console.error("Error al enviar la pregunta:", error);
        responseDiv.innerText = 'Error al enviar la pregunta: ' + error.message;
    }
});