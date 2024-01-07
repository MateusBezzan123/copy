const { Pool } = require('pg');
const express = require('express');
const Papa = require('papaparse');
const multer = require('multer');
const fs = require('fs');
const XLSX = require('xlsx');
const cors = require('cors');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'copybase',
  password: 'docker',
  port: 5432,
});


const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:8080' // Permitir apenas solicitações do seu frontend
}));

const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Servidor rodando!');
});

app.post('/process-data', upload.single('file'), async (req, res) => {
  const file = req.file;
  const workbook = XLSX.readFile(file.path);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet);

 
  const { mrr, churnRate } = calculateMetrics(data);

  try {
    const client = await pool.connect();
    const insertQuery = 'INSERT INTO metrics(mrr, churn_rate) VALUES($1, $2) RETURNING *';
    const result = await client.query(insertQuery, [mrr, churnRate]);
    client.release();
    fs.unlinkSync(file.path);
    res.json(result.rows[0]); 
  } catch (err) {
    console.error('Erro ao salvar no banco: ', err);
    res.status(500).send('Erro ao salvar no banco');
  }
});


async function calculateMetrics(data) {
  try {
    let totalRevenue = 0;
    let activeCustomers = 0;
    let cancelledCustomers = 0;

    data.forEach(customer => {
      if (customer.status === 'active') {
        totalRevenue += parseFloat(customer.monthly_revenue);
        activeCustomers++;
      } else if (customer.status === 'cancelled') {
        cancelledCustomers++;
      }
    });

    const mrr = totalRevenue;
    let churnRate = 0;
    if (activeCustomers > 0) {
      churnRate = (cancelledCustomers / activeCustomers) * 100;
    }
    return { mrr, churnRate };
  } catch (err) {
    console.error('Erro ao calcular métricas', err);
    return { mrr: 0, churnRate: 0 };
  }
}

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
