function myFunction() {
    var x = document.getElementById("myLinks");
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
  }
  document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const taskboardName = urlParams.get("name");
  
    if (taskboardName) {
      const decodedTaskboardName = decodeURIComponent(taskboardName);
      const titleElement = document.querySelector(".new_task");
      if (titleElement) {
        titleElement.textContent = decodedTaskboardName;
      }
    } else {
      console.log("No taskboard specified. Default title is used.");
    }
  
    var menuLinks = document.getElementById("myLinks");
    menuLinks.style.display = "block";
  
    const deleteButton = document.getElementById("delete-button");
    if (deleteButton) {
      deleteButton.addEventListener("click", confirmDeletion);
    }
  
    const duplicateButton = document.getElementById("duplicate-button");
    if (duplicateButton) {
      duplicateButton.addEventListener("click", duplicateTaskboard);
    }
  
    const closeButton = document.getElementById("close-button");
    if (closeButton) {
      closeButton.addEventListener("click", function () {
        window.location.href = "/";
      });
    }
  
    const saveButton = document.getElementById("save-button");
    if (saveButton) {
      saveButton.addEventListener("click", function () {
        console.log("Save button clicked");
      });
    }
  
    const newTaskButton = document.getElementById("new-task-button");
    if (newTaskButton) {
      newTaskButton.addEventListener("click", function () {
        console.log("New Task button clicked");
      });
    }
  });
  
  document
    .getElementById("taskboard-name-button")
    .addEventListener("click", function () {
      const urlParams = new URLSearchParams(window.location.search);
      const taskboardName = urlParams.get("name");
      if (taskboardName) {
        window.location.href = `/?name=${encodeURIComponent(
          taskboardName
        )}`;
      } else {
        alert("No taskboard specified.");
      }
    });
  
  document
    .getElementById("close-button")
    .addEventListener("click", function () {
      window.location.href = "/";
    });
  
  document
    .getElementById("settings-button")
    .addEventListener("click", function () {
      window.location.href = "settings";
    });
  
  document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const taskboardName = urlParams.get("name");
    console.log("URL Parameters:", urlParams.toString());
    console.log("Taskboard Name:", taskboardName);
  
    if (!taskboardName) {
      alert("No taskboard specified for editing.");
    }
  });
  
  async function confirmDeletion() {
    if (confirm("Are you sure you want to delete this taskboard?")) {
      const urlParams = new URLSearchParams(window.location.search);
      const taskboardName = urlParams.get("name");
      console.log("Taskboard Name:", taskboardName);
  
      try {
        const response = await fetch(`/delete/?name=${taskboardName}`, {
          method: "DELETE",
        });
        if (response.ok) {
          console.log("Taskboard deleted successfully.");
        } else {
          console.error("Failed to delete taskboard.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  }
  
  async function duplicateTaskboard() {
    const newTaskboardName = prompt("Please enter a name for the new taskboard:");
    if (!newTaskboardName) {
      alert("Taskboard duplication cancelled.");
      return;
    }
  
    const urlParams = new URLSearchParams(window.location.search);
    const currentTaskboardName = urlParams.get("name");
  
    try {
      const response = await fetch(
        `/duplicate?currentName=${encodeURIComponent(
          currentTaskboardName
        )}&newName=${encodeURIComponent(newTaskboardName)}`,
        { method: "POST" }
      );
      if (response.ok) {
        alert("Taskboard duplicated successfully.");
      } else {
        alert("Failed to duplicate taskboard.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
  
  async function fetchTaskboardData() {
    const urlParams = new URLSearchParams(window.location.search);
    const currentTaskboardName = urlParams.get("name");
  
    if (currentTaskboardName) {
      window.location.href = `/get/?name=${encodeURIComponent(
        currentTaskboardName
      )}`;
    } else {
      alert("No taskboard specified.");
    }
  }
  