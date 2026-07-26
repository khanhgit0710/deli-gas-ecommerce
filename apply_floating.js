
const fs = require("fs");
const path = require("path");

const htmlSnippet = `
    <!-- Floating Contact Widgets -->
    <div class="floating-contact-wrapper">
        <a href="tel:0901234567" class="float-btn float-hotline" title="G?i Ngay">
            <i class="fa-solid fa-phone"></i>
        </a>
        <a href="https://zalo.me/0901234567" target="_blank" class="float-btn float-zalo" title="Chat Zalo">
            <img src="https://stc-zaloprofile.zdn.vn/pc/v1/images/zalo_sharelogo.png" alt="Zalo" onerror="this.src='https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-Zalo-Arc.png'">
        </a>
    </div>
</body>`;

const files = fs.readdirSync(".").filter(f => f.endsWith(".html"));

for (let file of files) {
    if (file === "chi-tiet-san-pham.html") continue;
    let content = fs.readFileSync(file, "utf8");
    if (!content.includes("floating-contact-wrapper")) {
        content = content.replace("</body>", htmlSnippet);
        fs.writeFileSync(file, content);
        console.log(`Updated ${file}`);
    } else {
        console.log(`Skipped ${file}`);
    }
}

