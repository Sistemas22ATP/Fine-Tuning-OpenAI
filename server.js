const Express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const { TransformData } = require('./src/shared/');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = Express(); 
const PORT = process.env.PORT || 3000;

const apiProxy = createProxyMiddleware({
    target: 'http://localhost:3000',
    changeOrigin: true,
    // pathRewrite: {
    //   '^/api': '/api/v1'
    // },
    // onProxyReq: function(proxyReq, req, res) {
    //   proxyReq.setHeader('Authorization', `Bearer ${req.headers.authorization}`);
    // },
    onProxyRes: function(proxyRes, req, res) {
      proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    }
  });
  
  app.use('/api', apiProxy);

/*var corsOptions = {
    origin: ["http://127.0.0.1:5500"],
};
*/
/*
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(Express.static('public'));*/

app.post('/api/ask', async (req, res) => {
    const { question } = req.body;

    if (!question) {
        return res.status(400).json({ answer: "Pregunta no válida." }); 
    }

    try {
        const respuesta = await TransformData([question]);
        res.json({ answer: respuesta[0] })
    } catch (error) {
        console.error(error);
        res.status(500).json({ answer: "Error al procesar la pregunta." }); 
    }
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`); 
});