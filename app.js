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

        const data = await res.json();
        responseDiv.innerText = data[0] || 'No se obtuvo respuesta.';
    } catch (error) {
        console.error(error);
        responseDiv.innerText = 'Error al enviar la pregunta.';
    }
});