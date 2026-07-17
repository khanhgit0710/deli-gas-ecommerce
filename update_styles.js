const fs = require('fs');

// 1. Update JS
let jsContent = fs.readFileSync('js/main.js', 'utf8');
const dropdownScript = `

    // CUSTOM DROPDOWN (Sort By)
    const sortDropdowns = document.querySelectorAll('.custom-dropdown');
    sortDropdowns.forEach(dropdown => {
        const selected = dropdown.querySelector('.dropdown-selected');
        const options = dropdown.querySelectorAll('.dropdown-options li');
        
        if (selected) {
            selected.addEventListener('click', (e) => {
                e.stopPropagation();
                // Close others
                sortDropdowns.forEach(d => {
                    if (d !== dropdown) d.classList.remove('open');
                });
                dropdown.classList.toggle('open');
            });
        }
        
        if (options) {
            options.forEach(opt => {
                opt.addEventListener('click', () => {
                    options.forEach(o => o.classList.remove('active'));
                    opt.classList.add('active');
                    selected.innerHTML = opt.innerText + ' <i class="fa-solid fa-chevron-down"></i>';
                    dropdown.classList.remove('open');
                });
            });
        }
    });

    document.addEventListener('click', () => {
        sortDropdowns.forEach(dropdown => {
            dropdown.classList.remove('open');
        });
    });
});`;

// Remove the last "});" and append new script + "});"
if (jsContent.endsWith('});\n')) {
    jsContent = jsContent.slice(0, -4) + dropdownScript;
} else if (jsContent.endsWith('});')) {
    jsContent = jsContent.slice(0, -3) + dropdownScript;
} else if (jsContent.endsWith('});\r\n')) {
    jsContent = jsContent.slice(0, -5) + dropdownScript;
} else {
    // If we can't find it easily, just replace it using regex
    jsContent = jsContent.replace(/\}\);\s*$/, dropdownScript);
}

fs.writeFileSync('js/main.js', jsContent, 'utf8');


// 2. Update CSS
let cssContent = fs.readFileSync('css/main.css', 'utf8');

// Replace .header-search-only and .search-flex with new layout
cssContent = cssContent.replace(
`.header-search-only {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
}`,
`.header-search-only {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 15px 30px;
}`);

cssContent = cssContent.replace(
`.search-flex {
  margin: 0;
  width: 100%;
  max-width: 500px;
}`,
`.search-flex {
  margin: 0 auto;
  grid-column: 2;
  width: 100%;
  min-width: 400px;
}
.sort-by {
  justify-self: end;
  grid-column: 3;
}`);

// Add z-index to .custom-dropdown
cssContent = cssContent.replace(
`.custom-dropdown {
  position: relative;
  width: 200px;
  z-index: 99;
}`,
`.custom-dropdown {
  position: relative;
  width: 200px;
  z-index: 1000;
}`);

cssContent = cssContent.replace(
`  z-index: 100;
  opacity: 0;`,
`  z-index: 1001;
  opacity: 0;`);

fs.writeFileSync('css/main.css', cssContent, 'utf8');

console.log("Updated main.js and main.css");
