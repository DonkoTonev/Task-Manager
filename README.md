Welcome to the Task Manager Application! This application is designed to help users manage their tasks efficiently. Whether you're organizing personal chores, managing projects, or planning your day-to-day activities, this application offers a convenient platform to streamline your tasks.

![Screenshot 2024-02-28 082954](https://github.com/DonkoTonev/Task-Manager/assets/116662870/c6b21dd3-5338-4ffc-bcc1-b97a90e1c3ad)


## Features

- **Excel File Upload**: After opening the application, if you don't have any uploaded `.xlsx` files (taskboards), you can upload any `.xlsx` file by clicking the `New` button from the navbar:

![Untitled design](https://github.com/DonkoTonev/Task-Manager/assets/116662870/6f11d8b8-7e27-4c9c-98d1-85a2d07504df)

After clicking on the `New` button, a form that prompts you to enter the name of your taskboard and upload the `.xlsx` file will pop up.

![Untitled design (1)](https://github.com/DonkoTonev/Task-Manager/assets/116662870/aecdf2b3-0637-4950-892f-edc667081aad)

After giving a name of your new taskboard and uploading the `.xlsx` file which contains your tasks, the newly created taskboard will be shown on the homepage (Each row from your `.xlsx` file will be shown as different task):

![Screenshot 2024-02-28 084832](https://github.com/DonkoTonev/Task-Manager/assets/116662870/ad8f091f-6860-4fee-8ce3-51007b6cefb4)

  
- **Creation Of New Taskboard**: Upon uploading an Excel file for the first time, you will be asked to give a name for the new taskboard, and then the application automatically generates a taskboard based on the data provided. Users can then update this taskboard by just uploading additional Excel files to it.

- **Updating the Existing Taskboard**: Users can then update this taskboard by just uploading additional Excel files to it. The newly uploaded Excel rows are just added to the database and shown on the page.

- **Edit Functionality**: Users have the ability to modify their taskboards through the edit page. This includes options to delete, duplicate, or modify existing tasks.
  
- **Add New Tasks**: Users can add new tasks directly from the frontend interface. These tasks are stored in the database for future reference.
  
- **Task Content Editing**: Users can edit the content of existing tasks directly from the frontend. Any modifications made are automatically saved to the database.
  
- **Drag & Drop Functionality** (In Progress): The next step in development involves implementing drag & drop functionality. Users will be able to rearrange tasks by dragging and dropping them across the taskboard. The new structure will be automatically saved in the database.

## Technologies Used

- **Backend**: FastAPI is utilized to handle the backend logic of the application. FastAPI provides a modern, fast (high-performance), web framework for building APIs with Python 3.7+.

- **Frontend**: The frontend interface is developed using JavaScript, HTML, and CSS. These technologies provide the necessary tools for creating a dynamic and interactive user experience.

- **Database**: SQLite is used as the database management system for storing task data. SQLite is a lightweight, serverless, self-contained database engine that is perfect for small to medium-sized applications.


