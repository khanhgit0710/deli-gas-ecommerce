const fs = require('fs');
const path = require('path');

const images = [
  'https://gasleminh.com/wp-content/uploads/2022/10/screenshot_1677840360.png',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_BSCB0RlaM-2dmmWS1_nf8DCFzNet3deIGB5wFdF_6w&s',
  'https://gassaigonvina.com/upload/product/binh-gas-12kg-mau-xam-gas-saigonpetro-tp-hcm-902.png',
  'https://iwater.vn/Image/Picture/Sai-gon-petro/Gas-Saigon-Petro-12kg-binh-xanh.jpg'
];

const files = fs.readdirSync(process.cwd()).filter(f => f.endsWith('.html'));
let imgIdx = 0;

files.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace all placeholder images and our 4 images in all HTML files
  content = content.replace(/<img src="([^"]*)"([^>]*)>/g, (match, src, rest) => {
    if (src.includes('placehold.co') || images.includes(src)) {
        const replacement = images[imgIdx % images.length];
        imgIdx++;
        return '<img src="' + replacement + '"' + rest + '>';
    }
    return match;
  });

  // Change phone number color to accent
  const phonePattern = /<a href="#" class="top-bar-link"><i class="fa-solid fa-phone text-accent icon-ring"><\/i> 1900\.123\.123<\/a>/g;
  const newPhoneLink = '<a href="#" class="top-bar-link" style="color: var(--color-accent);"><i class="fa-solid fa-phone text-accent icon-ring"></i> 1900.123.123</a>';
  content = content.replace(phonePattern, newPhoneLink);
  
  fs.writeFileSync(filePath, content);
  console.log('Updated ' + file);
});
