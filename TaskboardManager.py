import sqlite3
import openpyxl
import csv
from io import BytesIO

# Method Naming Convention - class functions only


class TaskboardManager:
    """A manager class to interact with Taskboards stored in a SQLite database"""

    def __init__(self, global_db_filename="taskboard_global.sqlite"):
        self.global_db_filename = global_db_filename
        self.global_db = self._connect_to_global_db()

    def _connect_to_global_db(self):
        # Connect to the global database or create it if it doesn't exist
        global_db = sqlite3.connect(self.global_db_filename)

        # Create necessary tables if they don't exist
        with global_db:
            cursor = global_db.cursor()
            cursor.execute(
                """CREATE TABLE IF NOT EXISTS table_metadata (
                        table_name TEXT PRIMARY KEY
                    )"""
            )

        return global_db

    def createTaskboard(self, name):
        # Create a new Taskboard table with a single column 'id'
        with self.global_db:
            cursor = self.global_db.cursor()
            cursor.execute(
                """CREATE TABLE IF NOT EXISTS '{}' (
                        id INTEGER PRIMARY KEY,
                        task_order INTEGER DEFAULT 0
                    )""".format(
                    name
                )
            )
            cursor.execute(
                """CREATE TABLE IF NOT EXISTS '{}' (
                        id INTEGER PRIMARY KEY
                    )""".format(
                    ("configuration_" + name)
                )
            )

            # Add the Taskboard name to table_metadata
            cursor.execute(
                "INSERT INTO table_metadata (table_name) VALUES ('{}')".format(
                    name)
            )


    def uploadFile(self, name, data):
        # Check if the Taskboard exists
        if not self._taskboard_exists(name):
            raise Exception(f"Taskboard '{name}' does not exist.")

        if not all(isinstance(row, dict) for row in data):
            raise Exception("Data must be a list of dictionaries.")

        headers = data[0].keys()  # Extract headers from the first row
        self._ensure_columns_exist(name, headers)

        with self.global_db:
            cursor = self.global_db.cursor()

            # Check and handle 'upload_id' column
            cursor.execute("PRAGMA table_info('{}')".format(name))
            columns_info = cursor.fetchall()
            upload_id_exists = any(
                column[1] == "upload_id" for column in columns_info)

            if not upload_id_exists:
                cursor.execute(
                    "ALTER TABLE '{}' ADD COLUMN 'upload_id' INTEGER DEFAULT 0".format(name))
                upload_id = 0
            else:
                upload_id = cursor.execute(
                    "SELECT MAX(upload_id) FROM '{}'".format(name)).fetchone()[0]
                upload_id = 0 if upload_id is None else (upload_id + 1)

            for row in data:
                row_values = [upload_id] + \
                    [row.get(header, None) for header in headers]
                cursor.execute(
                    "INSERT INTO '{}' ({}) VALUES ({})".format(
                        name,
                        ",".join(["'upload_id'"] +
                                 [f"'{header}'" for header in headers]),
                        ",".join(["?"] * (len(headers) + 1)),
                    ),
                    row_values,
                )

    def _ensure_columns_exist(self, name, columns):
        with self.global_db:
            cursor = self.global_db.cursor()

            # Fetch the current columns in the table and sanitize them
            cursor.execute("PRAGMA table_info('{}')".format(name))
            existing_columns_info = cursor.fetchall()
            existing_columns = [col_info[1].strip().lower(
            ) for col_info in existing_columns_info]  # Sanitize column names

            for column in columns:
                sanitized_column = column.strip().lower()  # Sanitize input column names
                if sanitized_column not in existing_columns:
                    cursor.execute("ALTER TABLE '{}' ADD COLUMN '{}' TEXT".format(
                        name, sanitized_column))

    def destroy(self, name):
        # Check if the Taskboard exists
        if not self._taskboard_exists(name):
            raise Exception(f"Taskboard '{name}' does not exist.")

        # Drop the Taskboard table and remove its entry from table_metadata
        with self.global_db:
            cursor = self.global_db.cursor()
            cursor.execute("DROP TABLE IF EXISTS '{}'".format(name))
            cursor.execute("DROP TABLE IF EXISTS '{}'".format(
                "configuration_" + name))
            cursor.execute(
                "DELETE FROM table_metadata WHERE table_name = '{}'".format(
                    name)
            )

    def _taskboard_exists(self, name):
        # Check if the Taskboard exists in table_metadata
        with self.global_db:
            cursor = self.global_db.cursor()
            cursor.execute(
                "SELECT COUNT(*) FROM table_metadata WHERE table_name = '{}'".format(
                    name
                )
            )
            return cursor.fetchone()[0] > 0

    def listAvailable(self):
        with self.global_db:
            cursor = self.global_db.cursor()
            cursor.execute("SELECT table_name FROM table_metadata")

            # Fetch all taskboard names
            taskboard_names = [row[0] for row in cursor.fetchall()]

            return taskboard_names

    def defAvailable(self):
        with self.global_db:
            cursor = self.global_db.cursor()
            cursor.execute("SELECT table_name FROM table_metadata")

            # Fetch all taskboard names
            taskboard_names = [row[0] for row in cursor.fetchall()]

            # Create a dictionary with arbitrarily numbered keys
            taskboards_dict = {}
            for i, name in enumerate(taskboard_names):
                taskboards_dict[i] = name

            return taskboards_dict

    def rollback(self, name, rollback=1):
        # Check if the Taskboard exists
        if not self._taskboard_exists(name):
            raise Exception(f"Taskboard '{name}' does not exist.")

        # Ensure rollback value is valid
        if rollback < 1:
            raise ValueError(
                "Rollback value must be greater than or equal to 1.")

        # Get the max upload_id
        with self.global_db:
            cursor = self.global_db.cursor()
            cursor.execute("SELECT MAX(upload_id) FROM '{}'".format(name))
            max_upload_id = cursor.fetchone()[0]

            # Calculate the starting upload_id to remove data from
            start_upload_id = max_upload_id - (rollback - 1)

            # Remove data with upload_id greater than or equal to start_upload_id
            cursor.execute(
                "DELETE FROM '{}' WHERE upload_id >= {}".format(
                    name, start_upload_id)
            )

    # def getAsDict(self, name):
    #     # Check if the Taskboard exists
    #     if not self._taskboard_exists(name):
    #         raise Exception(f"Taskboard '{name}' does not exist.")

    #     with self.global_db:
    #         cursor = self.global_db.cursor()
    #         cursor.execute(f"SELECT * FROM '{name}'")

    #         # Get column names
    #         columns = [desc[0] for desc in cursor.description]

    #         # Fetch all rows except the first one (header row)
    #         rows = cursor.fetchall()[1:]

    #         # Create a nested dictionary
    #         table_dict = {}
    #         for row in rows:
    #             row_dict = {}
    #             for i, column in enumerate(columns):
    #                 # Skip 'id' and 'upload_id' columns
    #                 if column not in ("id", "upload_id"):
    #                     row_dict[column] = row[i]
    #             table_dict[row[0]] = row_dict

    #         return table_dict
    
    def getAsDict(self, name):
        # Check if the Taskboard exists
        if not self._taskboard_exists(name):
            raise Exception(f"Taskboard '{name}' does not exist.")

        with self.global_db:
            cursor = self.global_db.cursor()
            cursor.execute(f"SELECT * FROM '{name}' ORDER BY task_order ASC")

            # Get column names
            columns = [desc[0] for desc in cursor.description]

            # Fetch all rows except the first one (header row)
            rows = cursor.fetchall()[0:]

            # Create a nested dictionary
            table_dict = {}
            for row in rows:
                row_dict = {}
                for i, column in enumerate(columns):
                    # Skip 'id' and 'upload_id' columns
                    if column not in ("id", "upload_id"):
                        row_dict[column] = row[i]
                table_dict[row[0]] = row_dict

            return table_dict

    
    
    
    



    def updateTask(self, taskboardName, taskId, key, value):
        with self.global_db:
            cursor = self.global_db.cursor()
            # Ensure proper sanitization to prevent SQL injection
            update_query = f"UPDATE '{taskboardName}' SET '{key}' = ? WHERE id = ?"
            cursor.execute(update_query, (value, taskId))
            self.global_db.commit()
        
    
    
    
    
    
    def updateTaskOrder(self, table_name, order):
        print(table_name, order)
        with self.global_db:
            cursor = self.global_db.cursor()
            
            # Check if the 'task_order' column exists in the table
            cursor.execute(f"PRAGMA table_info({table_name})")
            columns = cursor.fetchall()
            has_task_order_column = any(column[1] == 'task_order' for column in columns)
            
            # If the 'task_order' column doesn't exist, add it to the table
            if not has_task_order_column:
                cursor.execute(f"ALTER TABLE {table_name} ADD COLUMN task_order INTEGER")
            
            # Update the task order
            for idx, task_id in enumerate(order, start=1):
                print(idx, task_id)
                cursor.execute(f"UPDATE {table_name} SET task_order = ? WHERE id = ?", (idx, task_id))
            
            self.global_db.commit()

    
    
    
    
    
    
    
    def addTask(self, taskboardName, taskContent):
        # Validate taskboardName
        if not self._taskboard_exists(taskboardName):
            raise ValueError(f"Taskboard '{taskboardName}' does not exist.")

        with self.global_db:
            cursor = self.global_db.cursor()

            # Assume taskContent has a property 'content' that holds the string content
            contentString = taskContent.content if hasattr(taskContent, 'content') else str(taskContent)

            # Check if the 'content' column exists
            cursor.execute(f"PRAGMA table_info('{taskboardName}')")
            columns = [row[1] for row in cursor.fetchall()]
            if 'content' not in columns:
                # If the 'content' column does not exist, add it
                cursor.execute(f"ALTER TABLE '{taskboardName}' ADD COLUMN content TEXT")

            # Since parameters can't be used for table names, ensure taskboardName is safe
            sql = f"INSERT INTO '{taskboardName}' (content) VALUES (?)"

            try:
                cursor.execute(sql, (contentString,))
                self.global_db.commit()
            except Exception as e:
                print(f"Error inserting task into {taskboardName}: {e}")
                # Depending on your error handling, you might want to re-raise the exception
                raise



    

# Test code
# db = TaskboardManager()
# db.createTaskboard("My New Taskboard")
# db.uploadFile("My New Taskboard", "uploads/Book2.xlsx")

# in_file = open("uploads/Book2.xlsx", "rb")  # opening for reading as binary
# data = in_file.read()  # if you only wanted to read 512 bytes, do .read(512)
# in_file.close()

# db.uploadFile("My New Taskboard", data)

# db.destroy("My New Taskboard")

# Get a list of all existing Taskboards
# print(db.listAvailable())

# print(db.getAsDict("My New Taskboard"))
# db.rollback("My New Taskboard", 2)
