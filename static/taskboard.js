function myFunction() {
    var x = document.getElementById("myLinks");
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
  }
  
  function closeForm() {
    var formContainer = document.getElementById("new-taskboard-form");
    formContainer.style.display = "none";
  }
  
  // Global variable to keep track of the currently selected taskboard
  let currentTaskboard = null;
  
  // Update taskboard functionality
  document
    .getElementById("update-button")
    .addEventListener("click", function () {
      if (!currentTaskboard) {
        alert("Please select a taskboard first.");
        return;
      }
  
      var fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = ".xlsx";
  
      fileInput.addEventListener("change", function (event) {
        var file = event.target.files[0];
        var formData = new FormData();
        formData.append("file", file);
        formData.append("name", currentTaskboard);
  
        fetch("/upload/", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            fetchTaskboardData(currentTaskboard);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      });
  
      fileInput.click();
    });
  
  // Open taskboard selection modal
  document
    .getElementById("open-button")
    .addEventListener("click", function () {
      fetch("/list/")
        .then((response) => response.json())
        .then((taskboards) => {
          populateTaskboardSelector(Object.values(taskboards));
          showModal();
        })
        .catch((error) => {
          console.error("Error fetching taskboards:", error);
        });
    });
  
  // Populate taskboard selector in modal
  function populateTaskboardSelector(taskboards) {
    var selector = document.getElementById("taskboard-selector");
    selector.innerHTML = "";
    taskboards.forEach((taskboard) => {
      var option = document.createElement("option");
      option.value = taskboard;
      option.textContent = taskboard;
      selector.appendChild(option);
    });
  }
  
  // Show modal
  function showModal() {
    var modal = document.getElementById("taskboard-selection-modal");
    modal.style.display = "block";
  }
  
  // Close modal functionality
  document
    .querySelector(".close-button")
    .addEventListener("click", function () {
      var modal = document.getElementById("taskboard-selection-modal");
      modal.style.display = "none";
    });
  
  window.onclick = function (event) {
    var modal = document.getElementById("taskboard-selection-modal");
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
  
  // Handle taskboard selection from modal
  document
    .getElementById("select-taskboard-button")
    .addEventListener("click", function () {
      var selectedTaskboard =
        document.getElementById("taskboard-selector").value;
      if (selectedTaskboard) {
        openTaskboard(selectedTaskboard);
        var modal = document.getElementById("taskboard-selection-modal");
        modal.style.display = "none";
      } else {
        alert("Please select a taskboard.");
      }
    });
  
  // Edit taskboard functionality
  document
    .getElementById("edit-button")
    .addEventListener("click", function () {
      if (!currentTaskboard) {
        alert("Please select a taskboard first.");
        return;
      }
      window.location.href = `/edit?name=${encodeURIComponent(
        currentTaskboard
      )}`;
    });
  
  // New taskboard functionality
  document
    .getElementById("new-button")
    .addEventListener("click", function () {
      document.getElementById("new-taskboard-form").style.display = "block";
    });
  
  // Submit new taskboard
  document
    .getElementById("submit-new-taskboard")
    .addEventListener("click", function (event) {
      event.preventDefault(); // Prevent the form from submitting in the traditional way
  
      var taskboardName =
        document.getElementById("new-taskboard-name").value;
      var fileInput = document.getElementById("new-taskboard-file");
      var file = fileInput.files[0];
  
      if (!taskboardName || !file) {
        alert("Please enter a taskboard name and select a file.");
        return;
      }
  
      var formData = new FormData();
      formData.append("name", taskboardName);
      formData.append("file", file);
  
      fetch("/create", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          document.getElementById("new-taskboard-form").style.display =
            "none";
          document.getElementById("new-taskboard-name").value = "";
          fileInput.value = "";
          window.location.href = `/?name=${encodeURIComponent(
            taskboardName
          )}`;
        })
        .catch((error) => {
          console.error("Error:", error);
          alert(
            "A taskboard with this name already exists. Please choose another name!"
          );
        });
    });
  
  function fetchTaskboardData(taskboardName) {
    console.log("Fetching data for:", taskboardName);
    // Fetch taskboard data implementation here...
  }
  
  // DOMContentLoaded event listener
  document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const taskboardName = urlParams.get("name");
    if (taskboardName) {
      openTaskboard(taskboardName);
    }
  });
  
  // Additional JavaScript functionalities can be added below...
  