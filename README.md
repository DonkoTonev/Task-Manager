Welcome to the Task Manager Application! This application is designed to help users manage their tasks efficiently. Whether you're organizing personal chores, managing projects, or planning your day-to-day activities, this application offers a convenient platform to streamline your tasks.

![Screenshot 2024-02-28 082954](https://github.com/DonkoTonev/Task-Manager/assets/116662870/c6b21dd3-5338-4ffc-bcc1-b97a90e1c3ad)


## Features

- **Excel File Upload**: After opening the application, if you don't have any uploaded `.xlsx` files (taskboards), you can upload any `.xlsx` file by clicking the `New` button from the navbar:

![Untitled design](https://github.com/DonkoTonev/Task-Manager/assets/116662870/6f11d8b8-7e27-4c9c-98d1-85a2d07504df)

After clicking on the `New` button, a form that prompts you to enter the name of your taskboard and upload the `.xlsx` file will pop up.

![Untitled design (1)](https://github.com/DonkoTonev/Task-Manager/assets/116662870/aecdf2b3-0637-4950-892f-edc667081aad)

After giving a name of your new taskboard and uploading the `.xlsx` file which contains your tasks, the newly created taskboard will be shown on the homepage (Each row from your `.xlsx` file will be shown as different task):

![Screenshot 2024-02-28 084832](https://github.com/DonkoTonev/Task-Manager/assets/116662870/ad8f091f-6860-4fee-8ce3-51007b6cefb4)

After the `.xlsx` file is uploaded and the newly created task is showed on the application, you have the opportunity to edit the data directly from the UI by clicking on the value that you want to edit:

![Untitled design (2)](https://github.com/DonkoTonev/Task-Manager/assets/116662870/b2ae577c-aaaa-4f3b-a215-0a86789b22c8)

All of the modifications made are automatically saved to the database.

- **Updating an Existing Taskboard**: After you uploaded and saved a taskboard, you have the opportunity to update it by clicking the `Update` button from the navbar:

![Untitled design (3)](https://github.com/DonkoTonev/Task-Manager/assets/116662870/fc7f7b84-6e70-4797-b2dc-95d95dd3bbc2)

After clicking the `Update` button, you should upload `.xlsx` file with which you want to update your taskboard. 

After selecting the `.xlsx` file, its data will be uploaded to the taskboard that you are updating, and will be saved.

- **The Edit Page**: When you click on the `Edit` button in the navbar, you will be routed to the Edit page from which you can edit the currently opened taskboard:

![Untitled design (4)](https://github.com/DonkoTonev/Task-Manager/assets/116662870/51008284-66c4-43df-803e-7c39816514b4)

![Screenshot 2024-02-28 095550](https://github.com/DonkoTonev/Task-Manager/assets/116662870/2a32d0f5-5796-41c3-8eb1-a5771433b3d9)

From the navbar of the Edit page, you have a `Save`, `Duplicate`, `Delete`, `New` and `Close` buttons.

- The `Duplicate` button
  When you click on the `Duplicate` button, you can duplicate your currently opened taskboard, a pop up will appear that will prompt you to enter a name of the new taskboard (the duplicate taskboard):

  ![Screenshot 2024-02-28 100559](https://github.com/DonkoTonev/Task-Manager/assets/116662870/61d04729-7115-4230-9717-0190298dfc34)

  After giving a name of the taskboard and clicking `OK`, the currently opened taskboard will be duplicated.

- **Add New Tasks**: Users can add new tasks directly from the frontend interface. These tasks are stored in the database for future reference.
  
- **Task Content Editing**: Users can edit the content of existing tasks directly from the frontend. Any modifications made are automatically saved to the database.
  
- **Drag & Drop Functionality** (In Progress): The next step in development involves implementing drag & drop functionality. Users will be able to rearrange tasks by dragging and dropping them across the taskboard. The new structure will be automatically saved in the database.

## Technologies Used

- **Backend**: FastAPI is utilized to handle the backend logic of the application. FastAPI provides a modern, fast (high-performance), web framework for building APIs with Python 3.7+.

- **Frontend**: The frontend interface is developed using JavaScript, HTML, and CSS. These technologies provide the necessary tools for creating a dynamic and interactive user experience.

- **Database**: SQLite is used as the database management system for storing task data. SQLite is a lightweight, serverless, self-contained database engine that is perfect for small to medium-sized applications.


