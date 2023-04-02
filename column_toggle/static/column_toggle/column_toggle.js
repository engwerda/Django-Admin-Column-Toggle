document.addEventListener("DOMContentLoaded", function () {
  window.createColumnToggle = createColumnToggle;
  function createColumnToggle(defaultSelectedColumns, storageKey) {
    const table = document.querySelector(".results");
    if (!table) return;

    const headerRow = table.querySelector("thead tr");
    if (!headerRow) return;

    const columns = Array.from(headerRow.cells)
      .slice(1)
      .map((cell, index) => {
        const fieldClass = Array.from(cell.classList).find((cls) =>
          cls.startsWith("column-")
        );
        const field = fieldClass ? fieldClass.replace("column-", "") : "";
        return {
          index: index + 1,
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

      // Set the checked state based on defaultSelectedColumns
      checkbox.checked =
        shouldShowAllColumns || defaultSelectedColumns.includes(column.field);

      // Set the initial state of the column
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
    actionsContainer.parentNode.insertBefore(
      container,
      actionsContainer.nextElementSibling
    );
  }
  function toggleColumn(column, isVisible) {
    const table = document.querySelector(".results");
    if (!table) return;

    table
      .querySelectorAll(`tr > :nth-child(${column.index + 1})`)
      .forEach((cell) => {
        cell.style.display = isVisible ? "" : "none";
      });

    // Update local storage with the current state
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
