<div align="center">

# Django Playground

[![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/joacod/django-playground/blob/main/LICENSE)

[![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)](https://www.python.org)
[![Django](https://img.shields.io/badge/django-%23092E20.svg?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://react.dev/)
[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

</div>

## 👋 Introduction

Full-stack Django project with React frontend, containerized with Docker for seamless development.

### Tech Stack

- 🐍 **Backend**: Django + Django REST Framework + PostgreSQL
- ⚛️ **Frontend**: React + Vite + Tailwind CSS
- 🐳 **Development**: Docker + Docker Compose

### Development Features

- ✅ **Django**: Python code changes restart the server automatically
- ✅ **React**: Frontend changes update instantly in the browser
- ✅ **Database**: PostgreSQL with persistent data across restarts

## 🚀 Quick Start (2 minutes)

### Prerequisites

Docker & Docker Compose installed

### Get Started

1. Create environment file **".env"** from **".env.example"**

2. Start everything with one command

```bash
docker-compose up --build
```

3. Access your applications

- 🐍 Django: http://localhost:8000
- ⚛️ React Frontend: http://localhost:5173

That's it! Both applications are running with live reloading. 🎉

## 💻 Development Commands

Apply Django database migrations

```bash
docker-compose exec web python manage.py migrate
```

View logs

```bash
docker-compose logs web -f        # Django logs
docker-compose logs frontend -f   # React logs
```

Fresh start (removes database data)

```bash
docker-compose down -v && docker-compose up --build
```

## 🛠️ Admin Panel

Create a superuser for Django admin

```bash
docker-compose exec web python manage.py createsuperuser
```

Access admin at: http://localhost:8000/admin

## 📝 Choosing Your Development Approach

This project supports **both** Django development approaches:

### 🐍 **Django Templates Approach**

- **What**: Traditional server-side rendered HTML pages
- **Access**: http://localhost:8000
- **Use case**: Classic Django web applications with server-side rendering

### ⚛️ **API + React Frontend Approach**

- **What**: Django REST Framework APIs + React SPA
- **Access**:
  - API: http://localhost:8000/api/
  - Frontend: http://localhost:5173
- **Use case**: Modern decoupled architecture with React consuming DRF APIs

## 🧪 Testing

Run Django REST framework tests for the pizza app API

```bash
docker-compose exec web python manage.py test -v 2
```

## ☕️ Did you like the project?

You can collaborate with me giving a star ⭐️ to the project or

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/joacod)

Thanks! 😃
