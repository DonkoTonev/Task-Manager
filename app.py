from TaskboardManager import TaskboardManager
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from openpyxl import load_workbook
from io import BytesIO
from fastapi.responses import FileResponse, HTMLResponse
from typing import Optional, Annotated
import base64
import sqlite3
import json
from datetime import datetime

app = FastAPI(title="Taskboard")
app.mount("/static", StaticFiles(directory="static", html=True), name="static")

# Enable CORS (Cross-Origin Resource Sharing) for multi-user interfaces (automated handling of syncronous clients.)
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Create an instance of TaskboardManager to manage Taskboards
db = TaskboardManager()


@app.get("/")
async def home():
    return FileResponse("static/index.html")


@app.get("/settings")
async def home():
    return FileResponse("static/settings.html")

@app.get("/edit")
async def home():
    return FileResponse("static/edit.html")


@app.get("/menu")
async def home():
    return FileResponse("static/menu.html")


# Endpoint to create a new Taskboard
# @app.post("/create")
# async def create_taskboard(name: Annotated[str, Form()], file: UploadFile = File()):
#     db.createTaskboard(name)

#     data = await file.read()
#     if not data == b"":
#         db.uploadFile(name, data)
#         return {"msg": "file uploaded"}
#     return {"msg": "file not uploaded"}


@app.post("/create")
async def create_taskboard(name: Annotated[str, Form()], file: UploadFile = File()):
    db.createTaskboard(name)

    contents = await file.read()
    if contents != b"":
        # Process the file into the required format
        workbook = load_workbook(filename=BytesIO(contents))
        sheet = workbook.active
        rows = list(sheet.iter_rows(values_only=True))
        headers = rows[0]

        data = [dict(zip(headers, row)) for row in rows[1:]]  # Convert rows to list of dicts
        
        db.uploadFile(name, data)
        return {"msg": "file uploaded and data processed"}
    return {"msg": "file not uploaded"}







@app.post("/duplicate")
async def duplicate_taskboard(currentName: str, newName: str):
    try:
        # Check if the new taskboard name already exists
        if newName in db.listAvailable():
            return {"message": "Taskboard with the new name already exists."}

        # Retrieve data from the current taskboard
        currentData = db.getAsDict(currentName)

        # Convert the data into a list of dictionaries if it's not already
        if isinstance(currentData, dict):
            currentData = list(currentData.values())

        # Ensure the data is in the correct format: a list of dictionaries
        if not isinstance(currentData, list) or not all(isinstance(item, dict) for item in currentData):
            raise ValueError("Invalid data format: Data must be a list of dictionaries.")

        # Create a new taskboard and upload the data
        db.createTaskboard(newName)
        db.uploadFile(newName, currentData)
        return {"message": "Taskboard duplicated successfully."}
    except Exception as e:
        print(f"Error during duplication: {e}")
        raise HTTPException(status_code=500, detail=str(e))







# Endpoint to upload a file to a Taskboard
# @app.post("/upload/")
# async def upload_file(name: str, file: Annotated[bytes, File()]):
#     db.uploadFile(name, file)
#     return

# @app.post("/upload/")
# async def upload_file(name: str = Form(...), file: UploadFile = File(...)):
#     file_content = await file.read()
#     db.uploadFile(name, file_content)
#     return {"message": f"File '{file.filename}' uploaded for taskboard '{name}'."}









# @app.post("/upload/")
# async def upload_file(name: str = Form(...), file: UploadFile = File(...)):
#     contents = await file.read()
#     workbook = load_workbook(filename=BytesIO(contents))
#     sheet = workbook.active
#     rows = list(sheet.iter_rows(values_only=True))
#     headers = rows[0]

#     def convert_to_json_serializable(row):
#         json_row = {}
#         for key, value in zip(headers, row):
#             if isinstance(value, datetime):
#                 json_row[key] = value.isoformat()
#             else:
#                 json_row[key] = value
#         return json_row

#     data = [convert_to_json_serializable(row) for row in rows[1:]]  # Convert rows to list of dicts

#     # Call TaskboardManager's uploadFile method with processed data
#     db.uploadFile(name, data)
#     return {"message": "Data uploaded successfully to Taskboard"}


@app.post("/upload/")
async def upload_file(name: str = Form(...), file: UploadFile = File(...)):
    contents = await file.read()
    workbook = load_workbook(filename=BytesIO(contents))
    sheet = workbook.active
    rows = list(sheet.iter_rows(values_only=True))
    headers = rows[0]

    data = [dict(zip(headers, row)) for row in rows[1:]]  # Convert rows to list of dicts
    db.uploadFile(name, data)  # Call the updated uploadFile method
    return {"message": f"Data uploaded successfully to taskboard '{name}'."}














# @app.post("/upload_xlsx/")
# async def upload_xlsx(name: str, file: UploadFile = File(...)):
#     if not file.filename.endswith('.xlsx'):
#         raise HTTPException(status_code=400, detail="Invalid file type. Only '.xlsx' files are accepted.")
#     contents = await file.read()
#     try:
#         # Process the .XLSX file and update the Taskboard
#         db.uploadFile(name, contents)
#         return {"status": "success", "message": f"Taskboard '{name}' updated successfully."}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# Endpoint to delete a Taskboard
@app.delete("/delete/")
async def delete_taskboard(name: str):
    db.destroy(name)
    return


# Endpoint to rollback data for a Taskboard
@app.put("/rollback/")
async def rollback_taskboard(name: str, rollback: Optional[int] = 1):
    db.rollback(name, rollback)
    return


# Endpoint to list all existing Taskboards
@app.get("/list/")
async def list_taskboards():
    return db.defAvailable()


# Endpoint to get Taskboard data as a JSON object
@app.get("/get/")
async def get_taskboard(name: str):
    return db.getAsDict(name)


if __name__ == "__main__":
    import uvicorn

    print(db.listAvailable())

    if "My New Taskboard" not in db.listAvailable():
        # opening for reading as binary
        in_file = open("resources/Book2.xlsx", "rb")
        db.createTaskboard("My New Taskboard")
        db.uploadFile("My New Taskboard", in_file.read())
        in_file.close()

    uvicorn.run(app, host="localhost", port=8000)
