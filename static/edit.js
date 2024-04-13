// Function to fetch current settings and set placeholders
async function fetchCurrentSettings(taskboardName) {
  try {
    const response = await fetch(`/get-settings/?name=${taskboardName}`);
    if (response.ok) {
      const settings = await response.json();
      // Set placeholders in HTML form
      document.getElementById("bgColor").placeholder = settings.bg_color;
      document.getElementById("View_Header").placeholder = settings.view_header;
      document.getElementById("fontColor").placeholder = settings.font_color;
      document.getElementById("Font_Size1").placeholder = settings.font_size;

      document.getElementById("Title_Header").placeholder = settings.title_header;
      document.getElementById("TextWrapping").placeholder = settings.text_wrapping;
      document.getElementById("Sorting_Header").placeholder = settings.sorting_header;
      document.getElementById("Sort_By").placeholder = settings.sort_by;

      // Add placeholders for other settings similarly
    } else {
      console.error("Failed to fetch current settings.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const taskboardName = urlParams.get("name");

  // Fetch current settings and set placeholders
  fetchCurrentSettings(taskboardName);

  // Other initialization code...
});

document
  .getElementById("save-button")
  .addEventListener("click", function (event) {
    event.preventDefault();

    var taskboardName = getTaskboardNameFromURL();
    var formData = new FormData();

    var fontSize = document.getElementById("Font_Size1").value;
    if (fontSize.trim() !== "") {
      formData.append("font_size", fontSize);
    }

    var bgColor = document.getElementById("bgColor").value;
    if (bgColor.trim() !== "") {
      formData.append("bg_color", bgColor);
    }

    var fontColor = document.getElementById("fontColor").value;
    if (fontColor.trim() !== "") {
      formData.append("font_color", fontColor);
    }

    var viewHeader = document.getElementById("View_Header").value;
    if (viewHeader.trim() !== "") {
      formData.append("view_header", viewHeader);
    }

    var titleHeader = document.getElementById("Title_Header").value;
    if (titleHeader.trim() !== "") {
      formData.append("title_header", titleHeader);
    }

    var Text_Wrapping = document.getElementById("TextWrapping").value;
    if (Text_Wrapping.trim() !== "") {
      formData.append("Text_Wrapping", Text_Wrapping);
    }

    var sortingHeader = document.getElementById("Sorting_Header").value;
    if (sortingHeader.trim() !== "") {
      formData.append("sorting_header", sortingHeader);
    }

    var sortBy = document.getElementById("Sort_By").value;
    if (sortBy.trim() !== "") {
      formData.append("sort_by", sortBy);
    }

    // Check if any setting is provided
    if (formData.has("font_size")) {
      fetch(
        `/save-font-size?name=${taskboardName}&font_size=${formData.get(
          "font_size"
        )}`,
        {
          method: "POST",
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        })
        .catch((error) =>
          console.error("Error saving font size:", error)
        );
    }

    if (formData.has("bg_color")) {
      fetch(
        `/save-bg-color?name=${taskboardName}&bg_color=${formData.get(
          "bg_color"
        )}`,
        {
          method: "POST",
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        })
        .catch((error) =>
          console.error("Error saving background color:", error)
        );
    }


    if (formData.has("font_color")) {
      fetch(
        `/save-font-color?name=${taskboardName}&font_color=${formData.get(
          "font_color"
        )}`,
        {
          method: "POST",
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        })
        .catch((error) =>
          console.error("Error saving background color:", error)
        );
    }



    if (formData.has("view_header")) {
      fetch(
        `/save-view-headers?name=${taskboardName}&view_header=${formData.get(
          "view_header"
        )}`,
        {
          method: "POST",
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          alert("Background color saved successfully!");
        })
        .catch((error) =>
          console.error("Error saving background color:", error)
        );
    }

    if (formData.has("title_header")) {
      fetch(
        `/save-title-header?name=${taskboardName}&title_header=${formData.get(
          "title_header"
        )}`,
        {
          method: "POST",
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        })
        .catch((error) =>
          console.error("Error saving background color:", error)
        );
    }

    if (formData.has("Text_Wrapping")) {
      fetch(
        `/save-text-wrapping?name=${taskboardName}&text_wrapping=${formData.get(
          "Text_Wrapping"
        )}`,
        {
          method: "POST",
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        })
        .catch((error) =>
          console.error("Error saving background color:", error)
        );
    }

    if (formData.has("sorting_header")) {
      fetch(
        `/save-sorting-header?name=${taskboardName}&sorting_header=${formData.get(
          "sorting_header"
        )}`,
        {
          method: "POST",
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        })
        .catch((error) =>
          console.error("Error saving background color:", error)
        );
    }




    if (formData.has("sort_by")) {
      fetch(
        `/save-sort-by?name=${taskboardName}&sort_by=${formData.get(
          "sort_by"
        )}`,
        {
          method: "POST",
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        })
        .catch((error) =>
          console.error("Error saving background color:", error)
        );
    }

  });

// Function to extract the taskboard name from the URL
function getTaskboardNameFromURL() {
  var urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("name");
}

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

  // Check if a taskboard name is present
  if (taskboardName) {
    // Decode the taskboard name to handle spaces and special characters correctly
    const decodedTaskboardName = decodeURIComponent(taskboardName);

    // Set the taskboard name to the title in the navigation bar
    const titleElement = document.querySelector(".new_task");
    if (titleElement) {
      titleElement.textContent = decodedTaskboardName;
    }
  } else {
    // Optional: Handle the case where no taskboard name is present, or set a default title
    console.log("No taskboard specified. Default title is used.");
  }

  var menuLinks = document.getElementById("myLinks");
  menuLinks.style.display = "block";

  // Event listener for Delete button
  const deleteButton = document.getElementById("delete-button");
  if (deleteButton) {
    deleteButton.addEventListener("click", confirmDeletion);
  }

  // Event listener for Duplicate button
  const duplicateButton = document.getElementById("duplicate-button");
  if (duplicateButton) {
    duplicateButton.addEventListener("click", duplicateTaskboard);
  }

  // Event listener for Close button
  const closeButton = document.getElementById("close-button");
  if (closeButton) {
    closeButton.addEventListener("click", function () {
      window.location.href = window.location.href = `/?name=${encodeURIComponent(
        taskboardName
      )}`;
    });
  }

  // Event listener for Save button
  const saveButton = document.getElementById("save-button");
  if (saveButton) {
    saveButton.addEventListener("click", function () {
      console.log("Save button clicked");
      // Implement save functionality here
    });
  }

  // Event listener for New Task button
  const newTaskButton = document.getElementById("new-task-button");
  if (newTaskButton) {
    newTaskButton.addEventListener("click", function () {
      console.log("New Task button clicked");
      // Implement new task functionality here
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
  .getElementById("settings-button")
  .addEventListener("click", function () {
    // To open in the same tab:
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
        // Redirect to home or refresh
      } else {
        console.error("Failed to delete taskboard.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
}

async function duplicateTaskboard() {
  const newTaskboardName = prompt(
    "Please enter a name for the new taskboard:"
  );
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
  // Get the taskboard name from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const currentTaskboardName = urlParams.get("name");

  // Check if a taskboard name is present
  if (currentTaskboardName) {
    // Redirect to the taskboard view page
    window.location.href = `/get/?name=${encodeURIComponent(
      currentTaskboardName
    )}`;
  } else {
    // Handle the case where no taskboard name is present
    alert("No taskboard specified.");
  }
}