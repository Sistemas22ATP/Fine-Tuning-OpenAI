document.getElementById('questionForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const question = document.getElementById('question').value;

    const responseDiv = document.getElementById('response');
    responseDiv.innerText = 'Cargando...';

    try {
        const res = await fetch('/api/transform-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question }),
        });

        const data = await res.json();
        responseDiv.innerText = data.answer || 'No se obtuvo respuesta.';
    } catch (error) {
        console.error(error);
        responseDiv.innerText = 'Error al enviar la pregunta.';
    }
});

document.getElementById('uploadForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const fileInput = document.getElementById('fileUpload');
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    const uploadResponseDiv = document.getElementById('uploadResponse');
    uploadResponseDiv.innerText = 'Subiendo...';

    try {
        const res = await fetch('/api/upload-file', {
            method: 'POST',
            body: formData,
        });

        const data = await res.json();
        uploadResponseDiv.innerText = data.message || 'Archivo subido exitosamente.';
    } catch (error) {
        console.error(error);
        uploadResponseDiv.innerText = 'Error al subir el archivo.';
    }
});