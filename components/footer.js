class SiteFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
    <footer class="site-footer">
        <!-- Consultation Section with Wave -->
        <div class="footer-consultation">
            <!-- SVG Wave shape Top -->
            <div class="custom-shape-divider-top">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120"
                    preserveAspectRatio="none">
                    <path d="M0,120 C400,0 800,120 1200,40 V120 H0 Z" class="shape-fill"></path>
                </svg>
            </div>

            <div class="container consultation-container">
                <div class="consultation-content">
                    <h2>Tư vấn khách hàng</h2>
                    <p>Để lại số điện thoại, chuyên viên của chúng tôi sẽ liên hệ với bạn trong vòng 5 phút!</p>
                </div>

                <div class="consultation-form-wrap">
                    <form class="consultation-form">
                        <input type="tel" placeholder="Nhập số điện thoại của bạn..." required>
                        <button type="submit" class="consult-submit-btn">Gửi thông tin</button>
                    </form>
                </div>

                <div class="footer-contact-actions">
                    <a href="tel:0901234567" class="footer-hotline">
                        <div class="icon-ring">
                            <i class="fa-solid fa-phone"></i>
                        </div>
                        <div class="hotline-text">
                            <span>Hỗ trợ tận tâm</span>
                            <strong>090 123 4567</strong>
                        </div>
                    </a>

                    <a href="https://zalo.me/0901234567" target="_blank" class="footer-zalo">
                        <img src="https://stc-zaloprofile.zdn.vn/pc/v1/images/zalo_sharelogo.png" alt="Zalo Chat"
                            onerror="this.src='https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-Zalo-Arc.png'">
                        <span>Chat Zalo</span>
                    </a>
                </div>
            </div>

            <!-- SVG Wave shape -->
            <div class="custom-shape-divider-bottom">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120"
                    preserveAspectRatio="none">
                    <path d="M0,120 C300,0 900,120 1200,30 V120 H0 Z" class="shape-fill"></path>
                </svg>
            </div>
        </div>

        <!-- Main Footer -->
        <div class="footer-main">
            <div class="container">
                <div class="footer-grid">
                    <!-- Column 1: About -->
                    <div class="footer-col footer-col-about">
                        <div class="footer-logo">
                            <img src="/assets/logo/logo_primary_gas.png" alt="Deli-Gas Logo">
                        </div>
                        <p class="footer-desc">
                            Hệ thống phân phối Gas và thiết bị bếp chính hãng, an toàn, uy tín. Phục vụ nhanh chóng tận
                            nhà với đội ngũ chuyên nghiệp.
                        </p>
                        <div class="footer-socials">
                            <a href="#"><i class="fa-brands fa-facebook-f"></i></a>
                            <a href="#"><i class="fa-brands fa-instagram"></i></a>
                            <a href="#"><i class="fa-brands fa-youtube"></i></a>
                        </div>
                    </div>

                    <!-- Column 2: Nav Links -->
                    <div class="footer-col">
                        <div class="footer-col-title">Dịch vụ</div>
                        <ul>
                            <li><a href="/ve-chung-toi.html">Về chúng tôi</a></li>
                            <li><a href="/san-pham.html">Sản phẩm</a></li>
                            <li><a href="/tin-tuc.html">Tin tức & Blog</a></li>
                            <li><a href="/lien-he.html">Liên hệ</a></li>
                        </ul>
                    </div>

                    <!-- Column 3: Contact Info -->
                    <div class="footer-col">
                        <div class="footer-col-title">Liên Hệ</div>
                        <ul class="contact-info-list">
                            <li><i class="fa-solid fa-location-dot"></i> 475A Điện Biên Phủ, Phường 25, Quận Bình Thạnh, TP.HCM</li>
                            <li><i class="fa-solid fa-phone"></i> 090 123 4567</li>
                            <li><i class="fa-solid fa-envelope"></i> hotro@giaogas.vn</li>
                        </ul>
                    </div>

                    <!-- Column 4: Map & Certification -->
                    <div class="footer-col">
                        <img src="/assets/logo/bocongthuong_logo.png" alt="Bộ Công Thương" style="max-width: 180px; margin-bottom: 15px; display: block;">
                        <div class="footer-map" style="border-radius: 8px; overflow: hidden; height: 200px; width: 100%;">
                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.1256743939634!2d106.7118949!3d10.8016869!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528a459cb43ab%3A0x6c3d29d370b52a7e!2zNDc1YSDEkGnhu4duIEJpw6puIFBo4bunLCBQaMaw4budbmcgMjUsIELDrG5oIFRo4bqhbmgsIEjhu5MgQ2jDrSBNaW5oLCBWaWV0bmFt!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                        </div>
                    </div>
                </div>

                <div class="footer-bottom">
                    <p>&copy; 2026 Gas Việt. Hân hạnh phục vụ quý khách.</p>
                </div>
            </div>
        </div>
    </footer>
        `;
    }
}
customElements.define('site-footer', SiteFooter);
