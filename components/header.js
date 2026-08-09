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
            <a href="/" class="logo">
                <img src="/assets/logo/logo_primary_gas.png" alt="Deli-Gas Logo" class="logo-img">
            </a>

            <!-- Main Links -->
            <nav class="main-nav">
                <ul class="nav-links">
                    <li><a href="/" data-path="trang-chu">Trang Chủ</a></li>
                    <li><a href="/ve-chung-toi" data-path="ve-chung-toi">Về Chúng Tôi</a></li>
                    <li><a href="/san-pham" data-path="san-pham,chi-tiet-san-pham">Sản Phẩm</a></li>
                    <li><a href="/tin-tuc" data-path="tin-tuc,danh-sach-tin-tuc,chuyen-muc-an-toan-gas">Tin Tức</a></li>
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
