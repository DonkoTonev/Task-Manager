from TaskboardManager import TaskboardManager
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Body
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from openpyxl import load_workbook
from pydantic import BaseModel
from io import BytesIO
from fastapi.responses import FileResponse
from typing import Optional, Annotated
import traceback


app = FastAPI(title="Taskboard")
app.mount("/static", StaticFiles(directory="static",
          html=True), name="static")

# Enable CORS (Cross-Origin Resource Sharing) for multi-user interfaces (automated handling of synchronous clients.)
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
async def settings():
    return FileResponse("static/settings.html")


@app.get("/edit")
async def edit():
    return FileResponse("static/edit.html")


@app.get("/menu")
async def menu():
    return FileResponse("static/menu.html")


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

        data = [dict(zip(headers, row))
                for row in rows[1:]]  # Convert rows to list of dicts

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
            raise ValueError(
                "Invalid data format: Data must be a list of dictionaries.")

        # Create a new taskboard and upload the data
        db.createTaskboard(newName)
        db.uploadFile(newName, currentData)
        return {"message": "Taskboard duplicated successfully."}
    except Exception as e:
        print(f"Error during duplication: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/upload/")
async def upload_file(name: str = Form(...), file: UploadFile = File(...)):
    contents = await file.read()
    workbook = load_workbook(filename=BytesIO(contents))
    sheet = workbook.active
    rows = list(sheet.iter_rows(values_only=True))
    headers = rows[0]

    data = [dict(zip(headers, row))
            for row in rows[1:]]  # Convert rows to list of dicts
    db.uploadFile(name, data)  # Call the updated uploadFile method
    return {"message": f"Data uploaded successfully to taskboard '{name}'."}


@app.delete("/delete/")
async def delete_taskboard(name: str):
    db.destroy(name)
    return


@app.put("/rollback/")
async def rollback_taskboard(name: str, rollback: Optional[int] = 1):
    db.rollback(name, rollback)
    return


@app.get("/list/")
async def list_taskboards():
    return db.defAvailable()


@app.get("/get/")
async def get_taskboard(name: str):
    return db.getAsDict(name)


@app.post("/update-task")
async def update_task(update_details: dict = Body(...)):
    taskboardName = update_details['taskboardName']
    taskId = update_details['taskId']
    key = update_details['key']
    value = update_details['value']
    try:
        db.updateTask(taskboardName, taskId, key, value)
        return {"message": "Task updated successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class TaskContent(BaseModel):
    content: str


@app.post("/taskboard/{taskboard_name}/task")
async def create_task(taskboard_name: str, task_content: TaskContent):
    print(f"Adding task to {taskboard_name}: {task_content.content}")
    try:
        db.addTask(taskboard_name, task_content)
        return {"message": "Task created successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/update-order")
async def update_order(data: dict):
    try:
        order = data.get('order')
        taskBoardName = data.get('taskBoardName')
        print(order, taskBoardName)
        # Assuming db is an instance of YourDatabaseClass
        db.updateTaskOrder(taskBoardName, order)
        return {"message": "Order updated successfully."}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


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
