# Imperial Watches Database

This directory contains the SQLite3 database files for the Imperial Watches e-commerce website.

## Database Structure

### Tables

1. **watches** - Product catalog
   - id (PRIMARY KEY)
   - name (TEXT)
   - brand (TEXT)
   - price (DECIMAL)
   - description (TEXT)
   - image_url (TEXT)
   - category (TEXT)
   - in_stock (BOOLEAN)
   - rating (DECIMAL)
   - created_at (DATETIME)

2. **customers** - Customer information
   - id (PRIMARY KEY)
   - name (TEXT)
   - email (TEXT, UNIQUE)
   - phone (TEXT)
   - address (TEXT)
   - created_at (DATETIME)

3. **orders** - Order records
   - id (PRIMARY KEY)
   - customer_id (FOREIGN KEY)
   - total_amount (DECIMAL)
   - status (TEXT)
   - created_at (DATETIME)

4. **order_items** - Individual items in orders
   - id (PRIMARY KEY)
   - order_id (FOREIGN KEY)
   - watch_id (FOREIGN KEY)
   - quantity (INTEGER)
   - price (DECIMAL)

## Sample Data

The database is automatically populated with luxury watch data including:
- Rolex Submariner & Daytona
- Patek Philippe Nautilus
- Omega Speedmaster Moonwatch
- Audemars Piguet Royal Oak
- Cartier Santos
- Breitling Navitimer
- Tag Heuer Monaco
- Smart watches from Apple, Samsung, Fitbit

## Setup

The database is automatically created and populated when you start the server:

```bash
npm install
npm start
```

The database file `watches.db` will be created in this directory.
