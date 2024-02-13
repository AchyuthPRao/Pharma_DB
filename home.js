const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors'); // Import the cors middleware

const app = express();
const port = 4000;

app.use(cors()); // Enable CORS for all routes
app.use(express.json());


const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'achyuth123',
    database: 'pharmaceutical_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function createTable() {
    const createMfTableQuery = `
    CREATE TABLE IF NOT EXISTS manufacturers (
        manufacturer_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address VARCHAR(255),
        phone_number VARCHAR(15)
    );    
    `;
    const createOrderTableQuery = `
    CREATE TABLE IF NOT EXISTS orders (
        order_id INT AUTO_INCREMENT PRIMARY KEY,
        drug_id INT,
        FOREIGN KEY (drug_id) REFERENCES drugs(drug_id),
        quantity INT NOT NULL,
        order_date DATE NOT NULL,
        total_price DECIMAL(10, 2) NOT NULL
    );  
    `;
    const createDrugsTableQuery = `
    CREATE TABLE IF NOT EXISTS drugs (
        drug_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        manufacturer_id INT,
        FOREIGN KEY (manufacturer_id) REFERENCES manufacturers(manufacturer_id),
        dosage VARCHAR(50),
        price DECIMAL(10, 2) NOT NULL
    );
    `;

    try {
        const [result] = await db.query(createMfTableQuery);
        console.log('Table created or already exists');
    } catch (err) {
        console.error('Error creating table:', err);
    }
    try {
        const [result2] = await db.query(createOrderTableQuery);
        console.log('Table created or already exists');
    } catch (err) {
        console.error('Error creating table:', err);
    }
    try {
        const [result3] = await db.query(createDrugsTableQuery);
        console.log('Table created or already exists');
    } catch (err) {
        console.error('Error creating table:', err);
    }
}

app.get('/fetchAllMfData', async (req, res) => {
    const fetchAllDataQuery = 'SELECT * FROM manufacturers';
    try {
        const [result] = await db.query(fetchAllDataQuery);
        console.log('Data fetched successfully');
        res.status(200).json([result]);
    } catch (err) {
        console.error('MySQL query error:', err);
        res.status(500).send('Error fetching data');
    }
});
app.get('/fetchAllDrugData', async (req, res) => {
    const fetchAllDrugData = 'SELECT * FROM drugs';

    try {
        const [result2] = await db.query(fetchAllDrugData);
        console.log('Data fetched successfully');
        res.status(200).json(result2);
    } catch (err) {
        console.error('MySQL query error:', err);
        res.status(500).send('Error fetching data');
    }
});
app.get('/fetchAllOrderData', async (req, res) => {
    const fetchAllOrderData = 'SELECT * FROM orders';

    try {
        const [result3] = await db.query(fetchAllOrderData);
        console.log('Data fetched successfully');
        res.status(200).json(result3);
    } catch (err) {
        console.error('MySQL query error:', err);
        res.status(500).send('Error fetching data');
    }
});

app.post('/submitmf', async (req, res) => {
    const formData = req.body;
    const insertQuery = 'INSERT INTO manufacturers SET ?';

    try {
        const [result] = await db.query(insertQuery, formData);
        console.log('Data submitted successfully');
        res.status(200).send('Data submitted successfully');
    } catch (err) {
        console.error('MySQL query error:', err);
        res.status(500).send('Error submitting data');
    }
});
app.post('/submitOrders', async (req, res) => {
    const formData = req.body;
    const insertQuery = 'INSERT INTO orders SET ?';

    try {
        const [result2] = await db.query(insertQuery, formData);
        console.log('Data submitted successfully');
        res.status(200).send('Data submitted successfully');
    } catch (err) {
        console.error('MySQL query error:', err);
        res.status(500).send('Error submitting data');
    }
});
app.post('/submitDrugs', async (req, res) => {
    const formData = req.body;
    const insertQuery = 'INSERT INTO drugs SET ?';

    try {
        const [result3] = await db.query(insertQuery, formData);
        console.log('Data submitted successfully');
        res.status(200).send('Data submitted successfully');
    } catch (err) {
        console.error('MySQL query error:', err);
        res.status(500).send('Error submitting data');
    }
});
app.delete('/deleteManufacturer/:manufacturerId', async (req, res) => {
    const manufacturerId = req.params.manufacturerId;
    const deleteQuery = 'DELETE FROM manufacturers WHERE manufacturer_id = ?';

    try {
        const [result] = await db.query(deleteQuery, [manufacturerId]);
        console.log('Manufacturer deleted successfully');
        res.status(200).send('Manufacturer deleted successfully');
    } catch (err) {
        console.error('MySQL query error:', err);
        res.status(500).send('Error deleting manufacturer');
    }
});

// DELETE request for drugs
app.delete('/deleteDrug/:drugId', async (req, res) => {
    const drugId = req.params.drugId;
    const deleteQuery = 'DELETE FROM drugs WHERE drug_id = ?';

    try {
        const [result] = await db.query(deleteQuery, [drugId]);
        console.log('Drug deleted successfully');
        res.status(200).send('Drug deleted successfully');
    } catch (err) {
        console.error('MySQL query error:', err);
        res.status(500).send('Error deleting drug');
    }
});

// DELETE request for orders
app.delete('/deleteOrder/:orderId', async (req, res) => {
    const orderId = req.params.orderId;
    const deleteQuery = 'DELETE FROM orders WHERE order_id = ?';

    try {
        const [result] = await db.query(deleteQuery, [orderId]);
        console.log('Order deleted successfully');
        res.status(200).send('Order deleted successfully');
    } catch (err) {
        console.error('MySQL query error:', err);
        res.status(500).send('Error deleting order');
    }
});

// PUT request for manufacturers
app.put('/updateManufacturer/:manufacturerId', async (req, res) => {
    const manufacturerId = req.params.manufacturerId;
    const formData = req.body;
    const updateQuery = 'UPDATE manufacturers SET ? WHERE manufacturer_id = ?';

    try {
        const [result] = await db.query(updateQuery, [formData, manufacturerId]);
        console.log('Manufacturer updated successfully');
        res.status(200).send('Manufacturer updated successfully');
    } catch (err) {
        console.error('MySQL query error:', err);
        res.status(500).send('Error updating manufacturer');
    }
});

// PUT request for drugs
app.put('/updateDrug/:drugId', async (req, res) => {
    const drugId = req.params.drugId;
    const formData = req.body;
    const updateQuery = 'UPDATE drugs SET ? WHERE drug_id = ?';

    try {
        const [result] = await db.query(updateQuery, [formData, drugId]);
        console.log('Drug updated successfully');
        res.status(200).send('Drug updated successfully');
    } catch (err) {
        console.error('MySQL query error:', err);
        res.status(500).send('Error updating drug');
    }
});

// PUT request for orders
app.put('/updateOrder/:orderId', async (req, res) => {
    const orderId = req.params.orderId;
    const formData = req.body;
    const updateQuery = 'UPDATE orders SET ? WHERE order_id = ?';

    try {
        const [result] = await db.query(updateQuery, [formData, orderId]);
        console.log('Order updated successfully');
        res.status(200).send('Order updated successfully');
    } catch (err) {
        console.error('MySQL query error:', err);
        res.status(500).send('Error updating order');
    }
});

app.listen(port, async () => {
    console.log(`Server is running on http://localhost:${port}`);
    await createTable();
});
