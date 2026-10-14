class SiteHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
    <!-- TOP BAR -->
    <div class="top-bar">
        <div class="container">
            <div class="top-bar-inner">
                <div class="top-bar-left">
                    <span class="top-bar-welcome">Chào mừng đến với Gas Lê Mạnh! Hân hạnh phục vụ quý khách</span>
                </div>
                <div class="top-bar-right">
                    <a href="/lien-he" class="top-bar-link"><i class="fa-solid fa-location-dot text-accent"></i> 266 Bùi Hữu Nghĩa, P. Gia Định, TP.HCM</a>
                    <span class="top-bar-divider"></span>
                    <a href="tel:0932008179" class="top-bar-link"><i class="fa-solid fa-phone text-accent icon-ring"></i>
                        0932.008.179</a>
                    <span class="top-bar-divider"></span>
                </div>
            </div>
        </div>
    </div>

    <!-- HEADER -->
    <header class="header">
        <div class="container header-inner">
            <a href="/" class="logo">
                <img src="/assets/logo/logo_gaslemanh.png" alt="Gas Lê Mạnh Logo" class="logo-img">
            </a>

            <!-- Main Links -->
            <nav class="main-nav">
                <ul class="nav-links">
                    <li><a href="/" data-path="trang-chu">Trang Chủ</a></li>
                    <li><a href="/ve-chung-toi" data-path="ve-chung-toi">Về Chúng Tôi</a></li>
                    <li><a href="/san-pham" data-path="san-pham,chi-tiet-san-pham">Sản Phẩm</a></li>
                    <li><a href="/tin-tuc" data-path="tin-tuc,tat-ca-bai-viet,chuyen-muc-an-toan-gas">Tin Tức</a></li>
                    <li><a href="/lien-he" data-path="lien-he">Liên Hệ</a></li>
                </ul>
            </nav>

            <!-- Actions -->
            <div class="header-actions">
                <button class="cart-btn-primary" onclick="window.location.href='/gio-hang'">
                    <i class="fa-solid fa-bag-shopping"></i> Giỏ hàng
                    <span class="cart-badge">0</span>
                </button>
            </div>
        </div>
    </header>
        `;

        // Highlight active link based on current URL
        let currentPath = window.location.pathname.split('/').pop() || 'trang-chu';
        currentPath = currentPath.replace('.html', '');
        const navLinks = this.querySelectorAll('.nav-links a');
        
        navLinks.forEach(link => {
            const paths = link.getAttribute('data-path').split(',');
            if (paths.includes(currentPath)) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
}
customElements.define('site-header', SiteHeader);
