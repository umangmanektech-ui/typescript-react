# Product Management Dashboard (React + TypeScript)

A modern, high-performance Product Catalog & Inventory Management web application integrated with the Node.js / Express / MongoDB REST API (`/api/v1`).

---

## 🚀 API Integration Overview

Base API URL: `http://localhost:5000/api/v1`

| Method | Endpoint | Description | Frontend Integration |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/health` | Health & uptime check | `useApiHealth()` hook with real-time status pill |
| `GET` | `/api/v1/products` | Read all products (search, filters, pagination, sorting) | `useProducts(params)` hook & `ProductTable`/`ProductCard` |
| `GET` | `/api/v1/products/:id` | Read single product by MongoDB ObjectId | `useProduct(id)` hook & `ProductDetailModal` |
| `POST` | `/api/v1/products` | Create a new product (validated via Yup & Joi) | `useCreateProduct()` hook & `ProductFormModal` |
| `PUT` | `/api/v1/products/:id` | Update product by ID | `useUpdateProduct()` hook & `ProductFormModal` |
| `DELETE` | `/api/v1/products/:id` | Delete product by ID | `useDeleteProduct()` hook & `DeleteConfirmModal` |
| `GET` | `/api/v1/products/analytics/stats` | Aggregated analytics & category breakdown | `useProductStats()` hook & `ProductStats` metric cards |

---

## 🛠️ Architecture & Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + Glassmorphism UI + Dark Theme
- **Data Fetching & Cache**: TanStack React Query v5
- **HTTP Client**: Axios with centralized error normalization and interceptors
- **Global State**: Zustand (`useProductStore`)
- **Form & Validation**: React Hook Form + Yup (synced with backend Joi schema)
- **Icons**: Lucide React

---

## ⚙️ Running Locally

### 1. Start the Backend API (port 5000)
```bash
cd ../typescript-node
npm run dev
```

### 2. Start the Frontend Application (port 5173)
```bash
npm run dev
```

The frontend includes a Vite dev server proxy routing `/api` directly to `http://localhost:5000`. You can also configure a custom API base URL via the `.env` file:
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```
