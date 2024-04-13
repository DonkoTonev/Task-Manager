function myFunction() {
  var x = document.getElementById("myLinks");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
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
        // console.log('Taskboard created:', data);
        document.getElementById("new-taskboard-form").style.display =
          "none";
        document.getElementById("new-taskboard-name").value = "";
        fileInput.value = "";
        // Redirect to the homepage with the new taskboard name as a query parameter
        window.location.href = `/?name=${encodeURIComponent(
          taskboardName
        )}`;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });


function fetchTaskboardData(taskboardName) {
  console.log("Fetching data for:", taskboardName);
  fetch(`/get/?name=${encodeURIComponent(taskboardName)}`)
    .then((response) => response.json())
    .then((data) => {
      // console.log(data)

      var taskboardGrid = document.getElementById("taskboard-grid");
      taskboardGrid.innerHTML = "";

      // Sort data based on sorting_header and sort_by
      const { sorting_header, sort_by } = data;

      const sortedKeys = Object.keys(data)
        .filter((key) => key !== "sorting_header" && key !== "sort_by") // Exclude sorting properties
        .sort((a, b) => {
            const taskA = data[a];
            const taskB = data[b];

            // Access sorting header properties from task objects
            const itemA = taskA.sorting_header;
            const itemB = taskB.sorting_header;

            // Check if taskA[itemA] or taskB[itemB] is null or undefined
            const isTaskANull = taskA[itemA] === null || taskA[itemA] === undefined;
            const isTaskBNull = taskB[itemB] === null || taskB[itemB] === undefined;

            // Move null or undefined items to the end of the list
            if (isTaskANull && !isTaskBNull) {
                return 1;
            } else if (!isTaskANull && isTaskBNull) {
                return -1;
            } else if (isTaskANull && isTaskBNull) {
                return 0; // If both are null or undefined, maintain their relative order
            }

            // Compare based on sort_by
            if (taskA.sort_by === "Alphabetical Ascending") {
                return taskA[itemA].localeCompare(taskB[itemB]);
            } else if (taskA.sort_by === "Alphabetical Descending") {
                return taskB[itemB].localeCompare(taskA[itemA]);
            }
            // Default to no sorting
            return 0;
        });

      // console.log(sortedKeys)

      // Create cards in sorted order
      sortedKeys.forEach((taskId) => {
        createCard(taskId, data[taskId]);
        applyFontSize(taskId, data[taskId].font_size); // Apply font size to each card
        applyFontColor(taskId, data[taskId].font_color); // Apply font color to each card
      });
    })
    .catch((error) => {
      console.error("Error fetching taskboard data:", error);
    });
}

function applyFontColor(taskId, fontColor) {
  var card = document.querySelector(
    `.task-card[data-task-id="${taskId}"]`
  );
  if (card) {
    card.style.color = fontColor;
  } else {
    console.error(`Card with taskId ${taskId} not found`);
  }
}

function applyFontSize(taskId, fontSize) {
  // console.log(taskId, fontSize)
  var card = document.querySelector(
    `.task-card[data-task-id="${taskId}"]`
  );
  if (card) {
    card.style.fontSize = fontSize + "px";
  } else {
    console.error(`Card with taskId ${taskId} not found`);
  }
}

function createCard(taskId, row) {
  var card = document.createElement("div");
  card.className = "task-card";
  card.setAttribute("data-task-id", taskId);
  card.style.overflow = "hidden"; // Set overflow to hidden to cut off overflowing text

  // Apply background color if available
  if (row.bg_color) {
      card.style.backgroundColor = row.bg_color;
  }

  var titleHeader = row.title_header; // Get the column specified in the title_header

  Object.keys(row).forEach((key) => {
      if (
          key !== "text_wrapping" &&
          key !== "task_order" &&
          key !== "title_header" &&
          key !== "font_color" &&
          key !== "font_size" &&
          key !== "view_header" &&
          key !== "sorting_header" &&
          key !== "sort_by" &&
          key !== "bg_color" &&
          row[key] !== null &&
          row[key] !== undefined
      ) {
          // Exclude bg_color from being displayed on the card

          // Check if the key is "view_header" and its value is "No"
          if (key === "view_header" && row[key] === "No") {
              return; // Skip adding column names if view_header is "No"
          }

          var p = document.createElement("p");
          p.classList.add("editable-text");

          // If view_header is set to "No", don't display column names
          if (row.view_header !== "No") {
              p.textContent = `${key}: `;
          }

          var span = document.createElement("span");
          span.contentEditable = "true";
          
          // Handle text wrapping based on the text_wrapping column
          if (row.text_wrapping === "Disabled") {
              span.style.whiteSpace = "nowrap"; // Set to nowrap to prevent text wrapping
          }

          span.textContent = row[key];

          span.addEventListener("blur", function (event) {
              var newText = this.textContent;
              fetch("/update-task", {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                      taskboardName: currentTaskboard,
                      taskId: taskId,
                      key: key,
                      value: newText,
                  }),
              })
                  .then((response) => response.json())
                  .then((data) => console.log(data))
                  .catch((error) => console.error("Error updating task:", error));
          });

          p.appendChild(span);
          card.appendChild(p);

          // Check if the key matches the title_header
          if (key === titleHeader) {
              // If the key matches the title_header, move it to the beginning of the card
              card.insertBefore(p, card.firstChild);
          }
      }
  });

  document.getElementById("taskboard-grid").appendChild(card);
}


// Open taskboard function
function openTaskboard(taskboardName) {
  currentTaskboard = taskboardName;
  fetchTaskboardData(taskboardName);
}

// DOMContentLoaded event listener
document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const taskboardName = urlParams.get("name");
  if (taskboardName) {
    openTaskboard(taskboardName);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const taskboards = document.getElementById("taskboard-grid");
  let selectedCard = null; // To store the currently selected card

  taskboards.addEventListener("dblclick", function (e) {
    if (e.target.classList.contains("task-card")) {
      if (selectedCard) {
        // If there's already a selected card, deselect it
        selectedCard.classList.remove("selected");
      }
      selectedCard = e.target;
      selectedCard.classList.add("selected"); // Add a class to style the selected card
      e.stopPropagation(); // Stop the event from propagating further
    }
  });

  document.addEventListener("click", function (e) {
    if (selectedCard) {
      // Check if the click is on another task card
      if (e.target.classList.contains("task-card")) {
        // If the clicked card is not the selected card, insert before the clicked card
        if (selectedCard !== e.target) {
          taskboards.insertBefore(selectedCard, e.target);
        }
      } else if (e.target === taskboards) {
        // If the click is directly on the taskboard (not on a card), append to the end
        taskboards.appendChild(selectedCard);
      } else {
        // Check for clicks on elements inside the taskboard but not directly on a card
        let closestTaskCard = e.target.closest(".task-card");
        if (closestTaskCard) {
          // If the click is near another card, insert before that card
          taskboards.insertBefore(selectedCard, closestTaskCard);
        } else if (taskboards.contains(e.target)) {
          // If the click is within the taskboards but not on or near a card, append to the end
          taskboards.appendChild(selectedCard);
        }
      }
      selectedCard.classList.remove("selected");
      selectedCard = null; // Reset selected card after dropping
    }
  });

  // Optional: Style for the selected card
  const style = document.createElement("style");
  style.innerHTML = `
      .task-card.selected {
          border: 2px solid blue; /* Example style */
          opacity: 0.7;
      }
  `;
  document.head.appendChild(style);
});

// Update this function to set the taskboard name in the navigation bar
function openTaskboard(taskboardName) {
  currentTaskboard = taskboardName;
  fetchTaskboardData(taskboardName);
  document.getElementById("taskboardName").textContent = taskboardName; // Update the navigation bar text
}

// DOMContentLoaded event listener with updated logic
document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const taskboardName = urlParams.get("name");
  if (taskboardName) {
    openTaskboard(taskboardName);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const taskboards = document.getElementById("taskboard-grid");
  let selectedCard = null; // Variable to store the selected card

  // Event listener for double-click to select a card
  taskboards.addEventListener("dblclick", function (e) {
    if (e.target.classList.contains("task-card")) {
      if (selectedCard) {
        // Deselect previously selected card
        selectedCard.classList.remove("selected");
        console.log("Deselected card:", selectedCard); // Debugging log
      }
      // Mark new selected card and add any visual indication if needed
      selectedCard = e.target;
      selectedCard.classList.add("selected");
      console.log("Selected card:", selectedCard); // Debugging log
    }
  });

  // Event listener for click to place the selected card before clicked card
  taskboards.addEventListener("click", function (e) {
    if (
      selectedCard &&
      e.target.classList.contains("task-card") &&
      selectedCard !== e.target
    ) {
      // Move selected card before the clicked card
      e.target.parentNode.insertBefore(selectedCard, e.target);
      selectedCard.classList.remove("selected"); // Remove selection from moved card
      console.log("Moved selected card before:", e.target); // Debugging log
      selectedCard = null; // Reset selected card variable
      updateTaskOrder(); // Call function to update order in the backend
    }
  });

  function updateTaskOrder() {
    const tasks = document.querySelectorAll(".task-card");
    const taskOrder = Array.from(tasks).map((task, index) => ({
      id: task.dataset.taskId, // Or use index if no taskId is available
      order: index,
    }));

    fetch("/update-task-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        taskboardName: currentTaskboard, // Ensure you have a way to identify the current taskboard
        newOrder: taskOrder.map((task) => task.order), // Send just the order if taskId is not available
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) =>
        console.error("Error updating task order:", error)
      );
  }
});


document.addEventListener("DOMContentLoaded", function() {
  const modal = document.getElementById("task-detail-modal");
  const modalContent = document.querySelector(".modal-content");
  const modalBody = document.getElementById("modal-body");
  const closeModal = document.getElementsByClassName("close")[0];

  document.addEventListener("click", function(event) {
      if (event.target.classList.contains("task-card")) {
          // Clone the card content
          const content = event.target.cloneNode(true);
          modalBody.innerHTML = content.innerHTML; // Use innerHTML of cloned content

          // Apply styles from the card to the modal
          const computedStyle = window.getComputedStyle(event.target);
          modalContent.style.backgroundColor = computedStyle.backgroundColor;
          modalContent.style.color = computedStyle.color; // Ensure text color is also copied if specified
          modalContent.style.fontSize = computedStyle.fontSize; // Copy font size if needed

          // More styles can be copied similarly
          // Example for border (if your cards have specific borders you want to replicate)
          modalContent.style.border = computedStyle.border;

          // Display the modal
          modal.style.display = "block";
      }
  });

  closeModal.onclick = function() {
      modal.style.display = "none";
  }

  window.onclick = function(event) {
      if (event.target === modal) {
          modal.style.display = "none";
      }
  }
});