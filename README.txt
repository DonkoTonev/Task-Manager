Welcome to the Task Manager web application! This application is designed to help users manage tasks efficiently by providing a user-friendly interface for task management.

## Features

### TaskboardManager.py
- **Rollback Method**: The `rollback` method is implemented to delete unused columns, ensuring database integrity and efficiency.
- **Handling for Upload_id and ID Columns**: Special handling is in place for the `upload_id` and `id` columns of taskboard tables to address conflicts that may arise from uploaded data with conflicting column names.
- **Table Configuration**: The `configure_` table for taskboards is removed and moved to `table_metadata` for better organization and management.
- **Robust Exceptions**: More robust exceptions are created to facilitate debugging and improve error handling within the application.

### app.py
- **Input Scrubbing and Error Handling**: Enhanced input scrubbing and error handling mechanisms are implemented to ensure data integrity and enhance security.
- **Endpoint Development**: Endpoints are built out for data submission and optional file uploads via forms, facilitating seamless interaction with the application.
- **Web Interface Development**: Development of the web interface is underway to provide users with a visually appealing and intuitive user experience.

### index.html
- **Core Functionality Implementation**: The core functionality of the application is implemented in the HTML file, allowing users to interact with task management features seamlessly.
- **UI Design Implementation**: User interface design elements are integrated to enhance the visual appeal and usability of the application.

## Development Notes
- **File Upload Integration**: Optional file uploads now work seamlessly with form data submissions on the index page, enhancing the application's flexibility and usability.
- **Next Steps**: The next phase of development involves implementing Jinja templates and creating interface/menu components to further enhance user interaction and experience.

## About the ASDA Squad
This role sits within our Assessment, Scoring, Analytics, and Data (ASDA) squad, with primary responsibility for collaborating with the Senior Python Developer to develop new scoring functions. The role also involves close collaboration with the psychometrics team to ensure the effectiveness and accuracy of the scoring algorithms.

Thank you for using our Task Manager web application. For any questions, feedback, or issues, please don't hesitate to contact our development team.

Happy Task Managing! 🚀
