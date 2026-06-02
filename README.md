# Inventory Management System

## Overview

This project was developed to simplify inventory operations by managing products, customers, and orders through a React-based dashboard and FastAPI backend. The application provides efficient inventory tracking and data management using a React frontend, FastAPI backend, and PostgreSQL database hosted on Supabase.

## Tech Stack

### Frontend

* React.js
* Vite

### Backend

* FastAPI
* Python

### Database

* PostgreSQL
* Supabase

### DevOps & Containerization

* Docker
* Docker Compose

## Features

* Product Management
* Customer Management
* Order Management
* RESTful API Architecture
* PostgreSQL Database Integration
* Responsive User Interface
* Dockerized Application Setup

## Containerization

The application has been fully containerized using Docker and Docker Compose. Separate containers are configured for the frontend and backend services, enabling consistent development and deployment environments.

All Docker configurations were implemented and tested locally. The repository includes the required Docker artifacts and is deployment-ready for environments with adequate infrastructure resources.

## Project Structure

```text
frontend/
├── src/
├── package.json
└── vite.config.js

backend/
├── app/
├── requirements.txt
└── Dockerfile

docker-compose.yml
```

## Getting Started

### Run with Docker Compose

```bash
docker-compose up --build
```

### Local Development

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Backend:

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Author

Aditya Bhadoriya
