class SiteHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
    <!-- TOP BAR -->
    <div class="top-bar">
        <div class="container">
            <div class="top-bar-inner">
                <div class="top-bar-left">
                    <span class="top-bar-welcome">Chào mừng đến với Gas Việt! Hân hạnh phục vụ quý khách</span>
                </div>
                <div class="top-bar-right">
                    <a href="#" class="top-bar-link"><i class="fa-solid fa-location-dot text-accent"></i> 123 Thủ Đức,
                        Hồ Chí Minh</a>
                    <span class="top-bar-divider"></span>
                    <a href="#" class="top-bar-link"><i class="fa-solid fa-phone text-accent icon-ring"></i>
                        1900.123.123</a>
                    <span class="top-bar-divider"></span>
                </div>
            </div>
        </div>
    </div>

    <!-- HEADER -->
    <header class="header">
        <div class="container header-inner">
            <!-- Logo -->
            <a href="/trang-chu.html" class="logo">
                <img src="/assets/logo/logo.png" alt="Deli-Gas Logo" class="logo-img" onerror="this.src='/assets/logo/logo_gas.png'">
            </a>

            <!-- Main Links -->
            <nav class="main-nav">
                <ul class="nav-links">
                    <li><a href="/trang-chu.html" data-path="trang-chu.html">Trang Chủ</a></li>
                    <li><a href="/ve-chung-toi.html" data-path="ve-chung-toi.html">Về Chúng Tôi</a></li>
                    <li><a href="/san-pham.html" data-path="san-pham.html,chi-tiet-san-pham.html">Sản Phẩm</a></li>
                    <li><a href="/tin-tuc.html" data-path="tin-tuc.html,danh-sach-tin-tuc.html,chi-tiet-tin-tuc.html,chuyen-muc-an-toan-gas.html">Tin Tức</a></li>
                    <li><a href="/lien-he.html" data-path="lien-he.html">Liên Hệ</a></li>
                </ul>
            </nav>

            <!-- Actions -->
            <div class="header-actions">
                <button class="cart-btn-primary" onclick="window.location.href='/gio-hang.html'">
                    <i class="fa-solid fa-bag-shopping"></i> Giỏ hàng
                    <span class="cart-badge">0</span>
                </button>
            </div>
        </div>
    </header>
        `;

        // Highlight active link based on current URL
        const currentPath = window.location.pathname.split('/').pop() || 'trang-chu.html';
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
