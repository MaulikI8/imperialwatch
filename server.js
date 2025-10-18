/* 
 * Imperial Watches - Node.js Backend Server with SQLite3
 * College project by Maulik Joshi and team
 * Features: SQLite3 database, REST API, watch product management
 */

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files

// Database setup
const db = new sqlite3.Database('./database/watches.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
        initializeDatabase();
    }
});

// Initialize database with tables and sample data
function initializeDatabase() {
    // Create watches table
    db.run(`CREATE TABLE IF NOT EXISTS watches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        brand TEXT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        description TEXT,
        image_url TEXT,
        category TEXT,
        in_stock BOOLEAN DEFAULT 1,
        rating DECIMAL(2,1) DEFAULT 4.5,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Create customers table
    db.run(`CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        address TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Create orders table
    db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER,
        total_amount DECIMAL(10,2),
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers (id)
    )`);

    // Create order_items table
    db.run(`CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER,
        watch_id INTEGER,
        quantity INTEGER,
        price DECIMAL(10,2),
        FOREIGN KEY (order_id) REFERENCES orders (id),
        FOREIGN KEY (watch_id) REFERENCES watches (id)
    )`);

    // Insert sample watch data
    insertSampleWatches();
}

// Insert sample watches data
function insertSampleWatches() {
    const watches = [
        {
            name: 'Rolex Submariner',
            brand: 'Rolex',
            price: 1700000.00,
            description: 'The iconic diving watch that has become a symbol of luxury and precision. Water-resistant to 300 meters.',
            image_url: './images/rolex.jpg',
            category: 'Diving',
            rating: 4.9
        },
        {
            name: 'Rolex Daytona',
            brand: 'Rolex',
            price: 2500000.00,
            description: 'The ultimate racing chronograph. Precision timing meets luxury craftsmanship.',
            image_url: './images/Daytona.jpg',
            category: 'Chronograph',
            rating: 4.8
        },
        {
            name: 'Seiko Marinemaster',
            brand: 'Seiko',
            price: 65000.00,
            description: 'Professional 300M diving watch with exceptional build quality and reliability.',
            image_url: './images/Seiko.jpg',
            category: 'Diving',
            rating: 4.7
        },
        {
            name: 'Apple SmartWatch Series 9',
            brand: 'Apple',
            price: 76500.00,
            description: 'Latest smartwatch for fitness and health tracking with premium materials.',
            image_url: './images/apple.jpg',
            category: 'Smart Watch',
            rating: 4.6
        },
        {
            name: 'Patek Philippe Nautilus',
            brand: 'Patek Philippe',
            price: 4500000.00,
            description: 'The legendary sports watch that redefined luxury timepieces. A true masterpiece.',
            image_url: './images/patek.jpg',
            category: 'Sports',
            rating: 4.9
        },
        {
            name: 'Omega Speedmaster Moonwatch',
            brand: 'Omega',
            price: 850000.00,
            description: 'The first watch worn on the moon. A piece of history on your wrist.',
            image_url: './images/omega-speedmaster-moonwatch-professional-co-axial-master-chronometer-chronograph-42-mm-31030425001002-198df2.jpg',
            category: 'Chronograph',
            rating: 4.8
        },
        {
            name: 'Cartier Santos',
            brand: 'Cartier',
            price: 1200000.00,
            description: 'Aviation-inspired luxury watch with distinctive square case design.',
            image_url: './images/watch3.jpg',
            category: 'Luxury',
            rating: 4.7
        },
        {
            name: 'Samsung Galaxy Watch 6',
            brand: 'Samsung',
            price: 36000.00,
            description: 'Smart fitness tracking with advanced health monitoring capabilities.',
            image_url: './images/galaxy.jpg',
            category: 'Smart Watch',
            rating: 4.5
        },
        {
            name: 'Audemars Piguet Royal Oak',
            brand: 'Audemars Piguet',
            price: 3800000.00,
            description: 'The revolutionary octagonal design that changed luxury watchmaking forever.',
            image_url: './images/audemars.jpg',
            category: 'Sports',
            rating: 4.9
        },
        {
            name: 'Breitling Navitimer',
            brand: 'Breitling',
            price: 950000.00,
            description: 'The ultimate pilot\'s watch with slide rule bezel for aviation calculations.',
            image_url: './images/breitling.jpg',
            category: 'Aviation',
            rating: 4.6
        },
        {
            name: 'Tag Heuer Monaco',
            brand: 'Tag Heuer',
            price: 750000.00,
            description: 'The square racing chronograph made famous by Steve McQueen.',
            image_url: './images/breitling-watch-store.jpg',
            category: 'Racing',
            rating: 4.5
        },
        {
            name: 'Fitbit Versa 4',
            brand: 'Fitbit',
            price: 25000.00,
            description: 'Advanced fitness tracking with heart rate monitoring and GPS.',
            image_url: './images/fitbit.jpg',
            category: 'Fitness',
            rating: 4.3
        }
    ];

    // Check if data already exists
    db.get('SELECT COUNT(*) as count FROM watches', (err, row) => {
        if (err) {
            console.error('Error checking existing data:', err.message);
            return;
        }

        if (row.count === 0) {
            const stmt = db.prepare(`INSERT INTO watches (name, brand, price, description, image_url, category, rating) VALUES (?, ?, ?, ?, ?, ?, ?)`);
            
            watches.forEach(watch => {
                stmt.run([watch.name, watch.brand, watch.price, watch.description, watch.image_url, watch.category, watch.rating], function(err) {
                    if (err) {
                        console.error('Error inserting watch:', err.message);
                    } else {
                        console.log(`Inserted watch: ${watch.name}`);
                    }
                });
            });
            
            stmt.finalize();
            console.log('Sample watch data inserted successfully');
        } else {
            console.log('Sample data already exists');
        }
    });
}

// API Routes

// Get all watches
app.get('/api/products', (req, res) => {
    const { category, brand, min_price, max_price, limit = 50 } = req.query;
    
    let query = 'SELECT * FROM watches WHERE in_stock = 1';
    const params = [];
    
    if (category) {
        query += ' AND category = ?';
        params.push(category);
    }
    
    if (brand) {
        query += ' AND brand = ?';
        params.push(brand);
    }
    
    if (min_price) {
        query += ' AND price >= ?';
        params.push(parseFloat(min_price));
    }
    
    if (max_price) {
        query += ' AND price <= ?';
        params.push(parseFloat(max_price));
    }
    
    query += ' ORDER BY rating DESC, created_at DESC LIMIT ?';
    params.push(parseInt(limit));
    
    db.all(query, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Get watch by ID
app.get('/api/products/:id', (req, res) => {
    const { id } = req.params;
    
    db.get('SELECT * FROM watches WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'Watch not found' });
            return;
        }
        res.json(row);
    });
});

// Get watch categories
app.get('/api/categories', (req, res) => {
    db.all('SELECT DISTINCT category FROM watches ORDER BY category', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows.map(row => row.category));
    });
});

// Get watch brands
app.get('/api/brands', (req, res) => {
    db.all('SELECT DISTINCT brand FROM watches ORDER BY brand', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows.map(row => row.brand));
    });
});

// Search watches
app.get('/api/search', (req, res) => {
    const { q } = req.query;
    
    if (!q) {
        res.status(400).json({ error: 'Search query required' });
        return;
    }
    
    const query = `
        SELECT * FROM watches 
        WHERE in_stock = 1 AND (
            name LIKE ? OR 
            brand LIKE ? OR 
            description LIKE ? OR 
            category LIKE ?
        )
        ORDER BY rating DESC
    `;
    
    const searchTerm = `%${q}%`;
    
    db.all(query, [searchTerm, searchTerm, searchTerm, searchTerm], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Create new customer
app.post('/api/customers', (req, res) => {
    const { name, email, phone, address } = req.body;
    
    if (!name || !email) {
        res.status(400).json({ error: 'Name and email are required' });
        return;
    }
    
    const query = 'INSERT INTO customers (name, email, phone, address) VALUES (?, ?, ?, ?)';
    
    db.run(query, [name, email, phone, address], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID, name, email, phone, address });
    });
});

// Create new order
app.post('/api/orders', (req, res) => {
    const { customer_id, items } = req.body;
    
    if (!customer_id || !items || items.length === 0) {
        res.status(400).json({ error: 'Customer ID and items are required' });
        return;
    }
    
    // Calculate total amount
    let totalAmount = 0;
    items.forEach(item => {
        totalAmount += item.price * item.quantity;
    });
    
    // Create order
    const orderQuery = 'INSERT INTO orders (customer_id, total_amount) VALUES (?, ?)';
    
    db.run(orderQuery, [customer_id, totalAmount], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        const orderId = this.lastID;
        
        // Create order items
        const itemQuery = 'INSERT INTO order_items (order_id, watch_id, quantity, price) VALUES (?, ?, ?, ?)';
        const stmt = db.prepare(itemQuery);
        
        items.forEach(item => {
            stmt.run([orderId, item.watch_id, item.quantity, item.price]);
        });
        
        stmt.finalize();
        
        res.json({ 
            order_id: orderId, 
            customer_id, 
            total_amount: totalAmount,
            status: 'pending'
        });
    });
});

// Get order by ID
app.get('/api/orders/:id', (req, res) => {
    const { id } = req.params;
    
    const query = `
        SELECT o.*, c.name as customer_name, c.email as customer_email
        FROM orders o
        JOIN customers c ON o.customer_id = c.id
        WHERE o.id = ?
    `;
    
    db.get(query, [id], (err, order) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!order) {
            res.status(404).json({ error: 'Order not found' });
            return;
        }
        
        // Get order items
        const itemsQuery = `
            SELECT oi.*, w.name as watch_name, w.brand, w.image_url
            FROM order_items oi
            JOIN watches w ON oi.watch_id = w.id
            WHERE oi.order_id = ?
        `;
        
        db.all(itemsQuery, [id], (err, items) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            
            order.items = items;
            res.json(order);
        });
    });
});

// Get statistics
app.get('/api/stats', (req, res) => {
    const queries = [
        'SELECT COUNT(*) as total_watches FROM watches',
        'SELECT COUNT(*) as total_customers FROM customers',
        'SELECT COUNT(*) as total_orders FROM orders',
        'SELECT SUM(total_amount) as total_revenue FROM orders WHERE status = "completed"'
    ];
    
    Promise.all(queries.map(query => 
        new Promise((resolve, reject) => {
            db.get(query, (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        })
    )).then(results => {
        const stats = {
            total_watches: results[0].total_watches,
            total_customers: results[1].total_customers,
            total_orders: results[2].total_orders,
            total_revenue: results[3].total_revenue || 0
        };
        res.json(stats);
    }).catch(err => {
        res.status(500).json({ error: err.message });
    });
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'WATCHthis.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Imperial Watches server running on port ${PORT}`);
    console.log(`Visit: http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down server...');
    db.close((err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Database connection closed.');
        }
        process.exit(0);
    });
});
