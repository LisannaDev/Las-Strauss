require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const db = require('./db');
const { Pool } = require('pg');
  

// Connexion à la base de données PostgreSQL avec les informations de l'environnement
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false, // Ce paramètre peut être nécessaire pour Render
    },
});


// Configurer le serveur
const app = express();
app.use(cors({
    origin: '*', // Permet les requêtes depuis n'importe quelle origine, en développement
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type'],
  }));
  
app.use(bodyParser.json());

// Créer dynamiquement le dossier "uploads" s'il n'existe pas
const uploadPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

// Configuration de multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath); // Dossier d'enregistrement
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage });

// Port du serveur
const PORT = process.env.PORT || 5000;

// Routes de test
app.get('/', (req, res) => {
    res.send('API opérationnelle !');
});

// Servir les fichiers statiques du dossier 'uploads'
app.use('/uploads', express.static(uploadPath));

// Obtenir tous les produits
app.get('/api/products', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM products');
        res.json(result.rows); // Renvoie tous les produits
    } catch (error) {
        console.error('Erreur lors de la récupération des produits :', error);
        res.status(500).send({ error: 'Erreur serveur' });
    }
});

// Ajouter un produit
app.post('/api/products', upload.single('image'), async (req, res) => {
    const { name, price, description, category } = req.body;
    const image_url = `/uploads/${req.file.filename}`; // Construire l'URL de l'image

    try {
        await db.query(
            'INSERT INTO products (name, price, description, category, image_url) VALUES ($1, $2, $3, $4, $5)',
            [name, price, description, category, image_url]
        );
        res.status(201).json({ message: 'Produit ajouté avec succès' });
    } catch (error) {
        console.error('Erreur lors de l\'ajout du produit :', error);
        res.status(500).json({ error: 'Erreur lors de l\'ajout du produit' });
    }
});

app.patch('/api/products/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { name, price, description, category } = req.body;

    let image_url = null;
    if (req.file) {
        image_url = `/uploads/${req.file.filename}`;  // Si une nouvelle image est téléchargée
    }

    try {
        const updates = [];
        const values = [];
        let query = 'UPDATE products SET ';

        if (name) {
            updates.push('name = $' + (updates.length + 1));
            values.push(name);
        }
        if (price) {
            updates.push('price = $' + (updates.length + 1));
            values.push(price);
        }
        if (description) {
            updates.push('description = $' + (updates.length + 1));
            values.push(description);
        }
        if (category) {
            updates.push('category = $' + (updates.length + 1));
            values.push(category);
        }
        if (image_url) {
            updates.push('image_url = $' + (updates.length + 1)); // Mettre à jour l'URL de l'image si nouvelle image
            values.push(image_url);
        }

        // Construire la requête d'update
        query += updates.join(', ') + ' WHERE id = $' + (updates.length + 1);
        values.push(id); // Ajout de l'ID à la requête

        await db.query(query, values);
        res.status(200).json({ message: 'Produit mis à jour avec succès' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du produit :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});



// Créer une commande
app.post('/api/orders', async (req, res) => {
    const { customer_name, deliveryOption, cart, recaptchaToken } = req.body;

    // Conversion pour correspondre à votre schéma de base de données
    const delivery_option = deliveryOption;

    // Vérification des données nécessaires
    if (!customer_name || !delivery_option || !Array.isArray(cart) || cart.length === 0) {
        console.error('Validation échouée : données manquantes ou invalides.');
        return res.status(400).send({ error: 'Données manquantes ou invalides.' });
    }

    // Vérification du reCAPTCHA
    try {
        const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify`,
            null,
            {
                params: {
                    secret: process.env.RECAPTCHA_SECRET, // Clé secrète du serveur
                    response: recaptchaToken,
                },
            }
        );

        if (!response.data.success) {
            console.error('Échec de la vérification reCAPTCHA.');
            return res.status(400).send({ error: 'Échec de la vérification reCAPTCHA.' });
        }
    } catch (error) {
        console.error('Erreur lors de la validation reCAPTCHA :', error);
        return res.status(500).send({ error: 'Erreur lors de la validation reCAPTCHA.' });
    }

    // Transformation des produits
    const products = cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: parseFloat(item.price), // Conversion en nombre
        quantity: item.quantity,
    }));

    // Calcul du prix total
    const total_price = products.reduce((sum, item) => sum + item.price * item.quantity, 0);

    console.log('Données transformées :', { customer_name, delivery_option, products, total_price });

    try {
        // Insertion dans la base de données
        const result = await db.query(
            'INSERT INTO orders (customer_name, delivery_option, products, total_price) VALUES ($1, $2, $3, $4) RETURNING *',
            [customer_name, delivery_option, JSON.stringify(products), total_price]
        );

        console.log('Commande insérée :', result.rows[0]);
        res.status(201).send(result.rows[0]);
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement de la commande :', error);
        res.status(500).send({ error: 'Erreur serveur lors de la création de la commande.' });
    }
});


    // Ajouter la commande dans la base et envoyer l'email
    // try {
    //     await db.query(
    //         'INSERT INTO orders (customer_name, delivery_option, products, total_price) VALUES ($1, $2, $3, $4)',
    //         [customer_name, delivery_option, JSON.stringify(products), total_price]
    //     );

        // const transporter = nodemailer.createTransport({
        //     service: 'gmail',
        //     auth: {
        //         user: process.env.EMAIL,
        //         pass: process.env.EMAIL_PASSWORD,
        //     },
        // });

        // await transporter.sendMail({
        //     from: process.env.EMAIL,
        //     to: 'admin_email@gmail.com',
        //     subject: 'Nouvelle commande',
        //     text: `Une commande a été passée par ${customer_name}.`,
        // });

//         res.status(201).send({ message: 'Commande créée et email envoyé' });
//     } catch (error) {
//         console.error('Erreur lors de la création de la commande :', error);
//         res.status(500).send({ error: 'Erreur serveur.' });
//     }
// });

// Mettre à jour le statut d'une commande
app.patch('/api/orders/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['En cours', 'Terminé', 'Annulé'];
    if (!validStatuses.includes(status)) {
        return res.status(400).send({ error: 'Statut non valide.' });
    }

    try {
        // Récupérer la commande
        const orderResult = await db.query('SELECT * FROM orders WHERE id = $1', [id]);
        const order = orderResult.rows[0];

        if (!order) {
            return res.status(404).send({ error: 'Commande non trouvée.' });
        }

        // Mettre à jour le statut de la commande
        const updateResult = await db.query(
            'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );

        const updatedOrder = updateResult.rows[0];

        // Si le statut est "En cours", générer une facture
        if (status === 'En cours') {
            const invoicePath = path.join(__dirname, 'invoices', `invoice-${id}.pdf`);
            const doc = new PDFDocument();

            // Assurez-vous que le répertoire 'invoices' existe
            if (!fs.existsSync(path.join(__dirname, 'invoices'))) {
                fs.mkdirSync(path.join(__dirname, 'invoices'));
            }

            // Générer le PDF
            doc.pipe(fs.createWriteStream(invoicePath));

            // Contenu du PDF
            // Ajouter le logo
            const logoPath = path.join(__dirname, 'assets', 'Logo.png'); // Chemin vers le logo
            if (fs.existsSync(logoPath)) {
                doc.image(logoPath, 50, 50, { width: 100 }); // Position et taille du logo
            }
            doc.fontSize(20).text('Facture', { align: 'center' });
            doc.moveDown();
            doc.fontSize(14).text(`Commande #${order.id}`);
            doc.text(`Client: ${order.customer_name}`);
            doc.text(`Option de livraison: ${order.delivery_option}`);
            doc.moveDown();
            doc.text(`Produits :`);
            const products = JSON.parse(order.products);
            products.forEach((product) => {
                doc.text(
                    `${product.name} - Quantité: ${product.quantity} x Prix: ${product.price}₡`
                );
            });
            doc.moveDown();
            doc.text(`Total: ${order.total_price} ₡`);
            doc.text(`Statut: ${status}`);

            doc.end();

            // Ajouter le chemin de la facture dans la réponse
            updatedOrder.invoice_url = `/invoices/invoice-${id}.pdf`;
        }

        res.send(updatedOrder);
    } catch (error) {
        console.error('Erreur lors de la mise à jour du statut :', error);
        res.status(500).send({ error: 'Erreur serveur.' });
    }
});

// Servir les factures
app.use('/invoices', express.static(path.join(__dirname, 'invoices')));


// Récupérer toutes les commandes
app.get('/api/orders', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM orders');
        res.json(result.rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des commandes :', error);
        res.status(500).send({ error: 'Erreur serveur' });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});

// Générer un bon de commande
app.get('/api/orders/:id/invoice', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.query('SELECT * FROM orders WHERE id = $1', [id]);
        const order = result.rows[0];

        if (!order) {
            return res.status(404).send({ error: 'Commande non trouvée.' });
        }

        // Créer le PDF
        const doc = new PDFDocument();
        const filePath = `invoices/order-${id}.pdf`;

        doc.pipe(fs.createWriteStream(filePath));

        // Contenu du PDF
        doc.fontSize(20).text('Bon de Commande', { align: 'center' });
        doc.moveDown();
        doc.fontSize(14).text(`Commande #${order.id}`);
        doc.text(`Client: ${order.customer_name}`);
        doc.text(`Option de livraison: ${order.delivery_option}`);
        doc.moveDown();
        doc.text(`Produits: ${order.products}`);
        doc.text(`Total: ${order.total_price} €`);
        doc.text(`Statut: ${order.status}`);

        doc.end();

        // Retourner le fichier PDF
        doc.on('finish', () => {
            res.download(filePath);
        });
    } catch (error) {
        console.error('Erreur lors de la génération du bon de commande :', error);
        res.status(500).send({ error: 'Erreur lors de la génération du bon de commande.' });
    }
});

// Liste des factures
app.get('/api/invoices', (req, res) => {
    const directoryPath = path.join(__dirname, 'invoices');
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            return res.status(500).send({ error: 'Erreur lors de la récupération des factures.' });
        }
        const invoiceFiles = files.map((file) => `/invoices/${file}`);
        res.json(invoiceFiles);
    });
});

// Servir les factures
app.use('/invoices', express.static(path.join(__dirname, 'invoices')));



// Gestion de la page d'accueil 

// Route pour obtenir les 3 derniers produits ajoutés
app.get('/api/products/latest', async (req, res) => {
    try {
        const result = await db.query(
            'SELECT * FROM products ORDER BY id DESC LIMIT 3' // Trier par ID décroissant et limiter à 3
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des derniers produits :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Admin Login Route
app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;

    if (password === process.env.ADMIN_PASSWORD) {
        res.status(200).send({ message: 'Connexion réussie.' });
    } else {
        res.status(401).send({ error: 'Mot de passe incorrect.' });
    }
});

