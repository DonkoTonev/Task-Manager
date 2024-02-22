Welcome to the Task Manager Application! This application is designed to help users manage their tasks efficiently. Whether you're organizing personal chores, managing projects, or planning your day-to-day activities, this application offers a convenient platform to streamline your tasks.

## Features

- **Excel File Upload**: Users can upload Excel files containing task data. Each row in the Excel file represents a separate task, which is then displayed as a card on the application.
  
- **Taskboard Creation**: Upon uploading an Excel file for the first time, the application automatically generates a taskboard based on the data provided. Users can then update this taskboard by uploading additional Excel files.
  
- **Edit Functionality**: Users have the ability to modify their taskboards through the edit page. This includes options to delete, duplicate, or modify existing tasks.
  
- **Add New Tasks**: Users can add new tasks directly from the frontend interface. These tasks are stored in the database for future reference.
  
- **Task Content Editing**: Users can edit the content of existing tasks directly from the frontend. Any modifications made are automatically saved to the database.
  
- **Drag & Drop Functionality** (In Progress): The next step in development involves implementing drag & drop functionality. Users will be able to rearrange tasks by dragging and dropping them across the taskboard. The new structure will be automatically saved in the database.

## Technologies Used

- **Backend**: FastAPI is utilized to handle the backend logic of the application. FastAPI provides a modern, fast (high-performance), web framework for building APIs with Python 3.7+.

- **Frontend**: The frontend interface is developed using JavaScript, HTML, and CSS. These technologies provide the necessary tools for creating a dynamic and interactive user experience.

- **Database**: SQLite is used as the database management system for storing task data. SQLite is a lightweight, serverless, self-contained database engine that is perfect for small to medium-sized applications.


