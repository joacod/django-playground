<div align="center">

# Django Playground 

[![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/joacod/django-playground/blob/main/LICENSE)

[![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)](https://www.python.org)
[![Django](https://img.shields.io/badge/django-%23092E20.svg?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com)

</div>

## 👋 Introduction

Project created using [Django](https://www.djangoproject.com/)

## 📋 Prerequisites

Install **Python**, follow the [official documentation](https://www.python.org/about/gettingstarted/)

## 📦 Setup Instructions

Follow these steps to set up the project.

### 1. Create a Virtual Environment

```bash
python3 -m venv venv
```

**Expected output**: Creates an isolated Python environment in `/venv`

### 2. Activate the Virtual Environment

Activates the virtual environment, updating your shell to use the isolated Python.

```bash
source venv/bin/activate
```

**Expected output**: Prompt changes to `(venv) user@machine:~/django-playground$`

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

**What it does**: Installs project dependencies listed in `requirements.txt`

## 💻 Development

Run the project locally.

```bash
python manage.py runserver
```

**What it does**: Starts a local server on `http://127.0.0.1:8000`

### Create a Superuser

To access the Django admin interface, you need a superuser account. Run:

```bash
python manage.py createsuperuser
```

Follow the prompts to set up your admin credentials.

Once the server is running, access the admin panel at:

[http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/)

## ☕️ Did you like the project?

You can colaborate with me giving a star ⭐️ to the project or

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/joacod)

Thanks! 😃
