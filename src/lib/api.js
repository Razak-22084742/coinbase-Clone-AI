// lib/api.js — Axios instance configured to talk to our backend API
//
// In development (pnpm dev):   uses http://localhost:5001/api
// In production (Netlify):     uses VITE_API_URL environment variable
//                              Set this in Netlify → Site settings → Environment variables

import axios from "axios";

// Vite exposes env vars with the VITE_ prefix via import.meta.env
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // 15 seconds — accounts for Render cold start on free tier
  withCredentials: true, // Required: sends HTTP-only cookies cross-origin
  headers: {
    "Content-Type": "application/json",
  },
});

// --- Request interceptor ---
// Attaches the JWT token from localStorage as a fallback Authorization header.
// The HTTP-only cookie is sent automatically via withCredentials: true.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Response interceptor ---
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      "API Error:",
      error.response?.data?.message || error.message
    );
    return Promise.reject(error);
  }
);
