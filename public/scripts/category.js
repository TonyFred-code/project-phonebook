let categoryToDelete = null;

function showDeleteDialog(event) {
  const categoryId = event.currentTarget.dataset.categoryId;
  categoryToDelete = categoryId;
  const dialog = document.getElementById("deleteDialog");
  const input = document.getElementById("deleteCodeInput");
  const errorMsg = document.getElementById("errorMessage");

  input.value = "";
  errorMsg.style.display = "none";
  dialog.showModal();
  input.focus();
}

function closeDeleteDialog() {
  document.getElementById("deleteDialog").close();
  categoryToDelete = null;
}

async function confirmDelete() {
  const code = document.getElementById("deleteCodeInput").value;
  const errorMsg = document.getElementById("errorMessage");

  if (!code) {
    errorMsg.textContent = "Please enter the deletion code";
    errorMsg.style.display = "block";
    return;
  }

  try {
    const response = await fetch(`/categories/${categoryToDelete}/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ delete_code: code }),
    });

    const result = await response.json();

    if (result.success) {
      window.location.href = "/categories";
    } else {
      errorMsg.textContent =
        result.message || "Invalid code. Please try again.";
      errorMsg.style.display = "block";
      document.getElementById("deleteCodeInput").value = "";
      document.getElementById("deleteCodeInput").focus();
    }
  } catch (error) {
    console.error("Error:", error);
    errorMsg.textContent = "Failed to delete category. Please try again.";
    errorMsg.style.display = "block";
  }
}

// Allow Enter key to submit
document
  .getElementById("deleteCodeInput")
  ?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      confirmDelete();
    }
  });

// Close dialog on Escape
document.getElementById("deleteDialog")?.addEventListener("cancel", (e) => {
  closeDeleteDialog();
});
