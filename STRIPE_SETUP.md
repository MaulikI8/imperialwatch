# Stripe Payment Integration Setup Guide

## Overview
This guide will help you set up Stripe payment processing for your Imperial Watches e-commerce website.

## Prerequisites
- Stripe account (free to create at https://stripe.com)
- Node.js project with the Imperial Watches codebase

## Step 1: Create Stripe Account

1. Go to https://stripe.com and create a free account
2. Complete the account verification process
3. Access your Stripe Dashboard

## Step 2: Get API Keys

1. In your Stripe Dashboard, go to **Developers > API Keys**
2. Copy your **Publishable Key** (starts with `pk_test_...`)
3. Copy your **Secret Key** (starts with `sk_test_...`)

## Step 3: Update Configuration

### Update Server Configuration
Edit `server.js` and replace the Stripe secret key:

```javascript
const stripe = require('stripe')('sk_test_YOUR_ACTUAL_SECRET_KEY_HERE');
```

### Update Frontend Configuration
Edit `JS/checkout-page.js` and replace the publishable key:

```javascript
const stripe = Stripe('pk_test_YOUR_ACTUAL_PUBLISHABLE_KEY_HERE');
```

## Step 4: Install Dependencies

Run the following command to install Stripe and other dependencies:

```bash
npm install
```

## Step 5: Test the Integration

### Test Cards (Use these for testing)
- **Successful Payment**: 4242 4242 4242 4242
- **Declined Payment**: 4000 0000 0000 0002
- **Requires Authentication**: 4000 0025 0000 3155

### Test Process
1. Start your server: `npm start`
2. Go to `http://localhost:3000`
3. Add items to cart
4. Proceed to checkout
5. Use test card numbers above

## Step 6: Webhook Configuration (Optional)

For production, you'll want to set up webhooks:

1. In Stripe Dashboard, go to **Developers > Webhooks**
2. Add endpoint: `https://yourdomain.com/api/webhook`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy the webhook secret

## API Endpoints

The following Stripe API endpoints are available:

- `POST /api/create-payment-intent` - Create a payment intent
- `POST /api/confirm-payment` - Confirm payment and create order
- `GET /api/payment-methods/:customer_id` - Get saved payment methods
- `POST /api/create-setup-intent` - Create setup intent for saving cards

## Security Notes

⚠️ **Important Security Reminders:**
- Never commit your actual API keys to version control
- Use environment variables in production
- Always use HTTPS in production
- Validate all payment data on the server side

## Production Deployment

Before going live:

1. Switch to live API keys (replace `test` with `live`)
2. Set up proper webhook endpoints
3. Enable SSL/HTTPS
4. Test with real payment methods
5. Set up proper error handling and logging

## Support

For Stripe-specific issues:
- Stripe Documentation: https://stripe.com/docs
- Stripe Support: https://support.stripe.com

For implementation issues:
- Check the browser console for errors
- Verify API keys are correct
- Ensure server is running and accessible

## Test Data

Use these test card numbers for different scenarios:

| Card Number | Description |
|-------------|-------------|
| 4242 4242 4242 4242 | Visa - Success |
| 4000 0000 0000 0002 | Declined |
| 4000 0025 0000 3155 | Requires Authentication |
| 5555 5555 5555 4444 | Mastercard - Success |

Use any future expiration date and any 3-digit CVC.
