document.addEventListener("DOMContentLoaded", function () {
  window.createColumnToggle = createColumnToggle;
  function createColumnToggle(defaultSelectedColumns, storageKey) {
    const table = document.querySelector(".results");
    if (!table) return;

    const headerRow = table.querySelector("thead tr");
    if (!headerRow) return;

    const actionToggleExists = !!document.getElementById("action-toggle");
    const columns = Array.from(headerRow.cells)
      .slice(actionToggleExists ? 1 : 0) // Use 1 if action-toggle exists, otherwise use 0
      .map((cell, index) => {
        const fieldClass = Array.from(cell.classList).find((cls) =>
          cls.startsWith("column-")
        );
        const field = fieldClass ? fieldClass.replace("column-", "") : "";
        return {
          index: index + (actionToggleExists ? 1 : 0), // Adjust index based on the existence of action-toggle
          text: cell.textContent.trim(),
          field: field,
        };
      });
    const container = document.createElement("div");
    container.classList.add("column-toggle-container");

    const shouldShowAllColumns =
      !defaultSelectedColumns || defaultSelectedColumns.length === 0;

    columns.forEach((column) => {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = `column-toggle-${column.index}`;
      checkbox.checked =
        shouldShowAllColumns || defaultSelectedColumns.includes(column.field);
      toggleColumn(column, checkbox.checked);

      checkbox.addEventListener("change", () => {
        toggleColumn(column, checkbox.checked);
      });
      const label = document.createElement("label");
      label.htmlFor = `column-toggle-${column.index}`;
      label.textContent = column.text;

      container.appendChild(checkbox);
      container.appendChild(label);
    });

    const actionsContainer = document.querySelector("div.actions");
    if (actionsContainer) {
      actionsContainer.parentNode.insertBefore(
        container,
        actionsContainer.nextElementSibling
      );
    } else {
      const tableContainer = document.querySelector(".results");
      if (tableContainer) {
        tableContainer.parentNode.insertBefore(container, tableContainer);
      }
    }
  }

  function toggleColumn(column, isVisible) {
    const table = document.querySelector(".results");
    if (!table) return;

    table
      .querySelectorAll(`tr > :nth-child(${column.index + 1})`)
      .forEach((cell) => {
        cell.style.display = isVisible ? "" : "none";
      });

    const storedSelectedColumns = JSON.parse(
      localStorage.getItem(storageKey) || "[]"
    );
    if (isVisible && !storedSelectedColumns.includes(column.field)) {
      storedSelectedColumns.push(column.field);
    } else if (!isVisible) {
      const index = storedSelectedColumns.indexOf(column.field);
      if (index > -1) {
        storedSelectedColumns.splice(index, 1);
      }
    }
    localStorage.setItem(storageKey, JSON.stringify(storedSelectedColumns));
  }
});
