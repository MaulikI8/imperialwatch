/*
 * Imperial Watches - Admin Dashboard JavaScript
 * Features: Order management, customer management, analytics
 */

// Global variables
let authToken = null;
let currentUser = null;

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    checkAuth();
    
    // Initialize event listeners
    initEventListeners();
    
    // Load dashboard data
    loadDashboardData();
});

// Check authentication
function checkAuth() {
    authToken = localStorage.getItem('adminToken');
    currentUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
    
    if (!authToken || !currentUser.role || currentUser.role !== 'admin') {
        alert('Admin access required');
        window.location.href = 'login.html';
        return;
    }
    
    // Update admin name in header
    document.getElementById('adminName').textContent = currentUser.name;
}

// Initialize event listeners
function initEventListeners() {
    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', logout);
    
    // Refresh buttons
    document.getElementById('refreshOrders').addEventListener('click', loadOrders);
    document.getElementById('refreshCustomers').addEventListener('click', loadCustomers);
    
    // Status filter
    document.getElementById('statusFilter').addEventListener('change', loadOrders);
    
    // Modal controls
    document.querySelector('.modal-close').addEventListener('click', closeModal);
    document.getElementById('cancelStatus').addEventListener('click', closeModal);
    document.getElementById('statusForm').addEventListener('submit', updateOrderStatus);
    
    // Close modal on outside click
    document.getElementById('statusModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
}

// Load dashboard data
async function loadDashboardData() {
    showLoading();
    
    try {
        // Load stats
        const statsResponse = await fetch('/api/admin/dashboard', {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!statsResponse.ok) {
            throw new Error('Failed to load dashboard stats');
        }
        
        const stats = await statsResponse.json();
        updateStats(stats);
        
        // Load orders and customers
        await Promise.all([
            loadOrders(),
            loadCustomers()
        ]);
        
    } catch (error) {
        console.error('Error loading dashboard:', error);
        showMessage('Failed to load dashboard data', 'error');
    } finally {
        hideLoading();
    }
}

// Update stats display
function updateStats(stats) {
    document.getElementById('totalOrders').textContent = stats.total_orders || 0;
    document.getElementById('totalCustomers').textContent = stats.total_customers || 0;
    document.getElementById('totalRevenue').textContent = `$${(stats.total_revenue || 0).toFixed(2)}`;
    document.getElementById('pendingOrders').textContent = stats.pending_orders || 0;
}

// Load orders
async function loadOrders() {
    try {
        const statusFilter = document.getElementById('statusFilter').value;
        let url = '/api/admin/orders?limit=50';
        
        if (statusFilter) {
            url += `&status=${statusFilter}`;
        }
        
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to load orders');
        }
        
        const orders = await response.json();
        displayOrders(orders);
        
    } catch (error) {
        console.error('Error loading orders:', error);
        showMessage('Failed to load orders', 'error');
    }
}

// Display orders in table
function displayOrders(orders) {
    const tbody = document.getElementById('ordersTableBody');
    tbody.innerHTML = '';
    
    if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="no-data">No orders found</td></tr>';
        return;
    }
    
    orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${order.id}</td>
            <td>
                <div class="customer-info">
                    <strong>${order.customer_name}</strong>
                    <small>${order.customer_email}</small>
                </div>
            </td>
            <td>$${order.total_amount}</td>
            <td>
                <span class="status-badge status-${order.status}">${order.status}</span>
            </td>
            <td>${new Date(order.created_at).toLocaleDateString()}</td>
            <td>
                <button class="btn-small btn-primary" onclick="openStatusModal(${order.id}, '${order.status}')">
                    Update Status
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Load customers
async function loadCustomers() {
    try {
        const response = await fetch('/api/customers', {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to load customers');
        }
        
        const customers = await response.json();
        displayCustomers(customers);
        
    } catch (error) {
        console.error('Error loading customers:', error);
        showMessage('Failed to load customers', 'error');
    }
}

// Display customers in table
function displayCustomers(customers) {
    const tbody = document.getElementById('customersTableBody');
    tbody.innerHTML = '';
    
    if (customers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="no-data">No customers found</td></tr>';
        return;
    }
    
    customers.forEach(customer => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${customer.id}</td>
            <td>${customer.name}</td>
            <td>${customer.email}</td>
            <td>${customer.phone || 'N/A'}</td>
            <td>
                <span class="role-badge role-${customer.role}">${customer.role}</span>
            </td>
            <td>
                <span class="status-badge status-${customer.is_active ? 'active' : 'inactive'}">
                    ${customer.is_active ? 'Active' : 'Inactive'}
                </span>
            </td>
            <td>${customer.last_login ? new Date(customer.last_login).toLocaleDateString() : 'Never'}</td>
        `;
        tbody.appendChild(row);
    });
}

// Open status update modal
function openStatusModal(orderId, currentStatus) {
    document.getElementById('orderId').value = orderId;
    document.getElementById('newStatus').value = currentStatus;
    document.getElementById('statusModal').style.display = 'flex';
}

// Close modal
function closeModal() {
    document.getElementById('statusModal').style.display = 'none';
}

// Update order status
async function updateOrderStatus(e) {
    e.preventDefault();
    
    const orderId = document.getElementById('orderId').value;
    const newStatus = document.getElementById('newStatus').value;
    
    try {
        const response = await fetch(`/api/admin/orders/${orderId}/status`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });
        
        if (!response.ok) {
            throw new Error('Failed to update order status');
        }
        
        showMessage('Order status updated successfully', 'success');
        closeModal();
        loadOrders(); // Refresh orders table
        
    } catch (error) {
        console.error('Error updating order status:', error);
        showMessage('Failed to update order status', 'error');
    }
}

// Logout function
function logout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = 'login.html';
}

// Show loading overlay
function showLoading() {
    document.getElementById('loadingOverlay').style.display = 'flex';
}

// Hide loading overlay
function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

// Show message
function showMessage(message, type) {
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.textContent = message;
    
    // Add to page
    document.body.appendChild(messageEl);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (messageEl.parentNode) {
            messageEl.parentNode.removeChild(messageEl);
        }
    }, 3000);
}
