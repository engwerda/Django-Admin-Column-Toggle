document.addEventListener("DOMContentLoaded", function () {
    function createColumnToggle() {
        const table = document.querySelector(".results");
        if (!table) return;

        const headerRow = table.querySelector("thead tr");
        if (!headerRow) return;

        const columns = Array.from(headerRow.cells)
            .slice(1)
            .map((cell, index) => {
                return {
                    index: index + 1, // Add 1 to the index to account for the excluded column
                    text: cell.textContent.trim(),
                };
            });

        const container = document.createElement("div");
        container.classList.add("column-toggle-container");

        columns.forEach((column) => {
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = `column-toggle-${column.index}`;
            checkbox.checked = true;
            checkbox.addEventListener("change", () => {
                toggleColumn(column.index, checkbox.checked);
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

    function toggleColumn(columnIndex, isVisible) {
        const table = document.querySelector(".results");
        if (!table) return;

        table
            .querySelectorAll(`tr > :nth-child(${columnIndex + 1})`)
            .forEach((cell) => {
                cell.style.display = isVisible ? "" : "none";
            });
    }

    createColumnToggle();
});
