# TaskFlow

TaskFlow is a full-stack task management application that helps users organize their work, set priorities, and track progress. Users can sign up, verify their email, create and prioritize tasks, mark them as complete, and securely reset their password through an email verification code.

---

## ✨ Features

- **User Registration** – Create a new account with email and password.
- **Email Verification** – New accounts must be verified through a link/code sent to the user's email before they can use the app.
- **Secure Authentication** – Log in and access protected endpoints securely.
- **Task Management** – Create, view, update, and delete tasks.
- **Task Priorities** – Assign a priority level (e.g. Low, Medium, High) to each task.
- **Task Completion** – Mark tasks as done with a simple checkbox once they are finished.
- **Password Reset** – Forgot your password? Request a reset code by email, enter the code, and set a new password.

---

## 🛠️ Tech Stack

### Backend
- **Django** & **Django REST Framework** – RESTful API
- **PostgreSQL** – Relational database

### Frontend
- **React** – User interface
- **Tailwind CSS** – Styling

---

## 🤖 Development Note

- The **Backend** (Django REST Framework + PostgreSQL) was designed and written entirely by hand.
- The **Frontend** (React + Tailwind CSS) was generated with the help of **Claude Opus 4.6** (by Anthropic). I then reviewed the generated code to make sure it works correctly with the backend API and meets the project requirements.

---

## 🔄 How It Works

1. **Sign up** – The user creates an account.
2. **Verify email** – A verification email is sent; the user confirms their email address.
3. **Log in** – The verified user logs in to the app.
4. **Create tasks** – The user adds tasks and sets a priority for each one.
5. **Complete tasks** – When a task is finished, the user checks it off.
6. **Reset password (if needed)** – The user requests a reset code, receives it by email, enters it, and chooses a new password.
