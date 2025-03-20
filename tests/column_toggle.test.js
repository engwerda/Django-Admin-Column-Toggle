const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const script = fs.readFileSync(path.resolve(__dirname, '../column_toggle/static/column_toggle/column_toggle.js'), 'utf8');

let window;
let document;

function setupDom(html) {
    const dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable' });
    window = dom.window;
    document = window.document;

    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
        value: {
            getItem: jest.fn(),
            setItem: jest.fn(),
            removeItem: jest.fn(),
            clear: jest.fn(),
        },
        writable: true,
    });

    window.eval(script);
}

function runCommonTests() {
    test('should create column toggle checkboxes', () => {
        const defaultSelectedColumns = ['field1', 'field2'];
        const storageKey = 'column-toggle-test';
        window.createColumnToggle(defaultSelectedColumns, storageKey);

        const checkboxes = document.querySelectorAll('.column-toggle-container input[type="checkbox"]');
        expect(checkboxes.length).toBeGreaterThan(0);
    });

    test('should toggle column visibility', () => {
        const defaultSelectedColumns = ['field1', 'field2'];
        const storageKey = 'column-toggle-test';
        window.createColumnToggle(defaultSelectedColumns, storageKey);

        const checkbox = document.querySelector('.column-toggle-container input[type="checkbox"]');
        const columnIndex = parseInt(checkbox.id.replace('column-toggle-', ''), 10);
        const cells = document.querySelectorAll(`.results tr > :nth-child(${columnIndex + 1}), .grp-table tr > :nth-child(${columnIndex + 1})`);

        // Initially, the column should be visible
        cells.forEach(cell => {
            expect(cell.style.display).toBe('');
        });

        // Toggle the checkbox to hide the column
        checkbox.checked = false;
        checkbox.dispatchEvent(new window.Event('change'));

        // The column should be hidden
        cells.forEach(cell => {
            expect(cell.style.display).toBe('none');
        });

        // Toggle the checkbox to show the column again
        checkbox.checked = true;
        checkbox.dispatchEvent(new window.Event('change'));

        // The column should be visible again
        cells.forEach(cell => {
            expect(cell.style.display).toBe('');
        });
    });
}

describe('Column Toggle', () => {
    describe('Default Django Admin', () => {
        beforeEach(() => {
            setupDom(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <title>Column Toggle Test</title>
            </head>
            <body>
              <div class="results">
                <table class="results">
                  <thead>
                    <tr>
                      <th class="column-field1">Field 1</th>
                      <th class="column-field2">Field 2</th>
                      <th class="column-field3">Field 3</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Value 1</td>
                      <td>Value 2</td>
                      <td>Value 3</td>
                    </tr>
                    <tr>
                      <td>Value 4</td>
                      <td>Value 5</td>
                      <td>Value 6</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </body>
            </html>
          `);
        });

        runCommonTests();
    });

    describe('Grappelli Admin', () => {
        beforeEach(() => {
            setupDom(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <title>Column Toggle Test</title>
            </head>
            <body>
              <div class="grp-results">
                <table id="result_list" class="grp-table grp-sortable">
                  <thead>
                    <tr>
                      <th class="column-field1">Field 1</th>
                      <th class="column-field2">Field 2</th>
                      <th class="column-field3">Field 3</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Value 1</td>
                      <td>Value 2</td>
                      <td>Value 3</td>
                    </tr>
                    <tr>
                      <td>Value 4</td>
                      <td>Value 5</td>
                      <td>Value 6</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </body>
            </html>
          `);
        });

        runCommonTests();
    });
});
