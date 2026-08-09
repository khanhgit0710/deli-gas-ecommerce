/**
 * ProductDB — localStorage Database Layer for Gas Việt
 * Manages products, categories with full CRUD operations
 */
const ProductDB = (() => {
    const PRODUCTS_KEY = 'gasviet_products';
    const CATEGORIES_KEY = 'gasviet_categories';
    const SETTINGS_KEY = 'gasviet_settings';
    const NEWS_KEY = 'gasviet_news';
    const NEWS_CATEGORIES_KEY = 'gasviet_news_categories';
    const INIT_KEY = 'gasviet_db_initialized_v9';

    // ========== SEED DATA ==========
    const seedCategories = [
        { id: 1, name: 'Gas Saigon Petro', slug: 'gas-saigon-petro', seoDesc: 'Đại lý phân phối Gas Saigon Petro chính hãng. Các loại bình gas xám, đỏ, xanh 12kg an toàn, chất lượng cao, giá tốt nhất thị trường.' },
        { id: 2, name: 'Gas Petrolimex', slug: 'gas-petrolimex', seoDesc: 'Đổi bình Gas Petrolimex chính hãng 12kg, 48kg, van chụp, van ngang an toàn tuyệt đối. Giá gas Petrolimex cập nhật mới nhất.' },
        { id: 3, name: 'Gas Gia Đình', slug: 'gas-gia-dinh', seoDesc: 'Phân phối Gas Gia Đình chính hãng, ngọn lửa xanh mượt tiết kiệm gas. Giao gas nhanh chóng, an toàn, có bảo hiểm cháy nổ.' },
        { id: 4, name: 'Gas Thủ Đức', slug: 'gas-thu-duc', seoDesc: 'Cung cấp bình Gas Thủ Đức 12kg, 45kg chính hãng, van an toàn. Dịch vụ đổi gas Thủ Đức tận nhà nhanh chóng, uy tín.' },
        { id: 5, name: 'Gas Elf', slug: 'gas-elf', seoDesc: 'Bình Gas Elf Pháp đỏ 12kg, 6kg, 45kg an toàn, chất lượng Châu Âu. Giao gas Elf chính hãng tận nhà với nhiều ưu đãi.' },
        { id: 6, name: 'Bếp Hồng Ngoại', slug: 'bep-hong-ngoai', seoDesc: 'Mua bếp điện hồng ngoại đơn, đôi chính hãng Sunhouse, Kangaroo, Bosch. Bếp hồng ngoại cao cấp, đun nấu nhanh, không kén nồi.' },
        { id: 7, name: 'Bếp Gas Âm', slug: 'bep-gas-am', seoDesc: 'Các dòng bếp gas âm cao cấp Rinnai, Paloma, Electrolux, Sunhouse. Thiết kế sang trọng, tiết kiệm gas, an toàn tuyệt đối.' },
        { id: 8, name: 'Phụ Kiện (Van, Dây)', slug: 'phu-kien-van-day', seoDesc: 'Phụ kiện gas chính hãng: van ngắt gas tự động, dây dẫn gas bọc inox chống chuột, van Namilux, Katsura cao cấp.' },
        { id: 9, name: 'Combo Khuyến Mãi', slug: 'combo-khuyen-mai', seoDesc: 'Tổng hợp các bộ combo bình gas, bếp gas, van dây giá siêu tiết kiệm. Mua trọn bộ để nhận ưu đãi lớn và quà tặng hấp dẫn.' }
    ];

    const seedNewsCategories = [
        { id: 1, name: 'An toàn Gas', slug: 'an-toan-gas', seoDesc: 'Tin tức và cẩm nang về an toàn sử dụng gas' },
        { id: 2, name: 'Mẹo vặt nhà bếp', slug: 'meo-vat-nha-bep', seoDesc: 'Các mẹo vặt hữu ích cho không gian bếp của bạn' },
        { id: 3, name: 'Khuyến mãi', slug: 'khuyen-mai', seoDesc: 'Cập nhật các chương trình ưu đãi và giảm giá mới nhất' },
        { id: 4, name: 'Sản phẩm mới', slug: 'san-pham-moi', seoDesc: 'Giới thiệu các dòng sản phẩm gas và bếp gas mới' },
        { id: 5, name: 'Ẩm thực', slug: 'am-thuc', seoDesc: 'Khám phá ẩm thực và các món ngon mỗi ngày' },
        { id: 6, name: 'Kỹ thuật', slug: 'ky-thuat', seoDesc: 'Chia sẻ kiến thức kỹ thuật về gas và thiết bị bếp' }
    ];

    const seedNews = [
        {
            id: 1,
            title: 'Cẩm Nang Toàn Tập Về Ngành Gas (LPG) & Hướng Dẫn Sử Dụng Bếp Gas An Toàn',
            slug: 'cam-nang-toan-tap-ve-nganh-gas-lpg',
            image: 'https://i.pinimg.com/control1/1200x/36/db/be/36dbbe7534d0fb076fa0e8e9f425340b.jpg',
            content: '<h2>Tổng quan về ngành công nghiệp Gas (LPG) tại Việt Nam</h2><p>Ngành công nghiệp khí hóa lỏng (LPG - Liquefied Petroleum Gas) đóng vai trò sống còn trong sự phát triển kinh tế và đời sống sinh hoạt của hàng triệu gia đình Việt Nam. Từ những năm đầu phát triển cho đến nay, LPG đã trở thành nguồn nhiên liệu không thể thiếu.</p><h3>Khí Gas (LPG) thực chất là gì?</h3><p>Khí LPG là hỗn hợp hydrocarbon nhẹ, chủ yếu bao gồm <strong>Propane (C3H8)</strong> và <strong>Butane (C4H10)</strong>. Trong điều kiện nhiệt độ và áp suất bình thường, LPG tồn tại ở thể khí. Tuy nhiên, để thuận tiện cho việc lưu trữ và vận chuyển, chúng được nén dưới áp suất cao để chuyển sang thể lỏng.</p><h4>Đặc điểm vật lý và hóa học của LPG</h4><ul><li><strong>Không màu, không mùi:</strong> Nguyên bản LPG không có mùi. Mùi đặc trưng mà chúng ta thường ngửi thấy (mùi bắp cải thối) là do nhà sản xuất pha thêm chất tạo mùi Mercaptan (Ethyl Mercaptan) để dễ dàng phát hiện rò rỉ.</li><li><strong>Nặng hơn không khí:</strong> Khi bị rò rỉ, khí gas sẽ chìm xuống sát mặt đất và tích tụ ở những vùng trũng, tạo nên nguy cơ cháy nổ tiềm ẩn nếu có tia lửa điện.</li><li><strong>Nhiệt năng cực cao:</strong> Khi cháy, LPG tỏa ra nhiệt lượng rất lớn (ngọn lửa có thể đạt tới 1900°C), giúp nấu chín thức ăn nhanh chóng.</li></ul><h2>Các tiêu chuẩn an toàn trong thiết kế Bếp Gas hiện đại</h2><p>Bếp gas ngày nay được trang bị rất nhiều công nghệ tối tân để đảm bảo an toàn tuyệt đối cho người sử dụng.</p><h3>Mâm chia lửa và hệ thống cảm biến tự ngắt</h3><p>Mâm chia lửa (Burner) là bộ phận quan trọng nhất quyết định đến hiệu suất đốt cháy và độ bền của bếp. Các loại mâm chia lửa bằng đồng thau nguyên khối (Brass) hoặc hợp kim Sabaf (Ý) luôn được đánh giá cao nhờ khả năng chịu nhiệt tốt và không cong vênh.</p><h4>Công nghệ ngắt gas tự động (Thermocouple)</h4><p>Đây là tính năng an toàn cao cấp nhất trên các bếp gas hiện đại. Cảm biến Thermocouple được đặt ngay cạnh mâm chia lửa. Khi ngọn lửa đột ngột tắt do gió thổi hoặc nước trào, cảm biến sẽ nguội đi và ngay lập tức kích hoạt hệ thống van từ (Solenoid Valve) đóng luồng gas lại, ngăn chặn tuyệt đối tình trạng rò rỉ khí gas ra ngoài môi trường.</p><h2>Hướng dẫn chi tiết sử dụng Bếp Gas an toàn tại gia đình</h2><h3>Quy tắc "Vàng" khi lắp đặt bình gas</h3><p>Vị trí đặt bình gas phải thông thoáng, cách xa nguồn nhiệt và các thiết bị phát sinh tia lửa điện (ổ cắm, công tắc) ít nhất 1.5 mét. Tuyệt đối không đặt bình gas trong tủ bếp kín mít không có lỗ thông hơi.</p><h3>Cách xử lý khẩn cấp khi ngửi thấy mùi gas rò rỉ</h3><p>Nếu bạn bước vào bếp và ngửi thấy mùi gas nồng nặc, hãy giữ bình tĩnh và thực hiện ngay các bước sau:</p><h4>1. Tuyệt đối không phát sinh tia lửa điện</h4><p>Không bật/tắt công tắc điện, không dùng điện thoại di động, không bật quạt máy, không dùng bật lửa. Bất kỳ tia lửa nhỏ nào cũng có thể kích nổ khối khí gas đang tích tụ.</p><h4>2. Khóa van bình gas ngay lập tức</h4><p>Tiến đến bình gas và vặn núm van theo chiều kim đồng hồ (chiều đóng) để cắt đứt nguồn cung cấp gas.</p><h4>3. Mở toang mọi cửa sổ và cửa ra vào</h4><p>Việc này giúp không khí lưu thông, pha loãng nồng độ khí gas trong phòng. Lưu ý dùng bìa carton hoặc quạt nan để quạt đuổi khí gas ra ngoài (chìm sát mặt đất).</p><h2>Kết luận</h2><p>Hiểu rõ về đặc tính của LPG và tuân thủ nghiêm ngặt các quy tắc sử dụng bếp gas an toàn là cách tốt nhất để bảo vệ tổ ấm của bạn. Hãy luôn lựa chọn những đại lý gas uy tín, cung cấp hàng chính hãng, có tem niêm phong và bảo hiểm cháy nổ rõ ràng như <strong>Gas Việt</strong>.</p>',
            seoTitle: 'Cẩm Nang Ngành Gas (LPG) & Hướng Dẫn Dùng Bếp Gas Chuẩn H1, H2, H3 | Gas Việt',
            seoDesc: 'Tìm hiểu sâu về LPG (Propane, Butane). Hướng dẫn cấu tạo mâm chia lửa, công nghệ tự ngắt Thermocouple, và quy trình chuẩn xử lý rò rỉ gas an toàn.',
            categoryId: 1,
            position: 'hero_main',
            active: true,
            createdAt: '2026-07-20T10:00:00'
        },
        {
            id: 2,
            title: 'Nấu ăn với bếp gas mang lại hương vị tuyệt vời',
            slug: 'nau-an-voi-bep-gas',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThcCEN_u0qNOSj1q24gJ3k76Afm3QJfGNW78nzrKPNPA&s=10',
            content: '<h2>Lợi ích khi dùng bếp gas</h2><p>Lửa từ bếp gas cung cấp nhiệt lượng tức thì và dễ dàng điều chỉnh. Điều này giúp các món chiên, xào đạt được độ chín hoàn hảo và hương vị đặc trưng, còn gọi là "hương vị của lửa".</p><ul><li>Nhiệt độ ổn định</li><li>Dễ dàng tùy chỉnh mức lửa</li><li>Thích hợp với mọi loại nồi chảo</li></ul>',
            seoTitle: 'Nấu ăn với bếp gas mang lại hương vị tuyệt vời - Ẩm thực',
            seoDesc: 'Bếp gas là lựa chọn hoàn hảo để chế biến món ăn ngon. Khám phá cách ngọn lửa gas tạo nên "hương vị của lửa" cho các món chiên xào.',
            categoryId: 5,
            position: 'hero_sub',
            active: true,
            createdAt: '2026-07-19T10:00:00'
        },
        {
            id: 3,
            title: 'Làm thế nào để chọn bình gas an toàn',
            slug: 'binh-gas-an-toan',
            image: 'https://kenh14cdn.com/zoom/700_438/203336854389633024/2024/8/20/anh-cat-dan-nghe-thuat-lich-ghi-nho-hinh-nen-may-tinh-22543283-1724149878897-17241498802971855222386-0-46-405-694-crop-1724149982222287470039.png',
            content: '<h2>Các tiêu chí chọn bình gas</h2><p>Bình gas an toàn phải có nguồn gốc xuất xứ rõ ràng, vỏ bình không bị móp méo hay rỉ sét nhiều. Đặc biệt, tem chống hàng giả và niêm phong màng co phải còn nguyên vẹn.</p><p>Luôn ưu tiên đổi gas tại các đại lý chính hãng, uy tín như Gas Việt để đảm bảo chất lượng.</p>',
            seoTitle: 'Làm thế nào để chọn bình gas an toàn cho gia đình bạn',
            seoDesc: 'Bí quyết chọn bình gas chính hãng, chất lượng. Tránh xa các loại gas giả, kém chất lượng để bảo vệ an toàn cháy nổ cho ngôi nhà bạn.',
            categoryId: 1,
            position: 'hero_sub',
            active: true,
            createdAt: '2026-07-18T10:00:00'
        },
        {
            id: 4,
            title: 'Bình Gas Composite chống cháy nổ',
            slug: 'binh-gas-composite-chong-chay-no',
            image: 'https://vangas.com.vn/assets/binh-gas-composite-chong-chay-no-2-Sao.jpg',
            content: '<h2>Đột phá công nghệ an toàn</h2><p>Bình gas composite được làm từ sợi thủy tinh siêu bền, chịu áp lực cao và hoàn toàn không bị ăn mòn. Đặc biệt, chất liệu này không sinh ra tia lửa điện khi va đập, giúp loại bỏ nguy cơ cháy nổ.</p><img src="https://vangas.com.vn/assets/binh-gas-composite-chong-chay-no-2-Sao.jpg"><p>Sản phẩm này nhẹ hơn bình thép thông thường đến 50%, giúp việc vận chuyển dễ dàng hơn.</p>',
            seoTitle: 'Bình Gas Composite chống cháy nổ thế hệ mới',
            seoDesc: 'Tìm hiểu về bình gas composite bọc sợi thủy tinh siêu nhẹ, không rỉ sét, an toàn tuyệt đối chống cháy nổ cho gia đình.',
            categoryId: 1,
            position: 'default',
            active: true,
            createdAt: '2026-07-17T10:00:00'
        },
        {
            id: 5,
            title: 'Mẹo vệ sinh bếp gas sạch bong như mới',
            slug: 'meo-ve-sinh-bep-gas-sach-bong',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREDfbpJN9BQsZcMUaDaz3hl4DxMfYHjrLkFJ10o4ugcCRPcoF6BtM-ZDA&s=10',
            content: '<h2>Các bước vệ sinh bếp gas</h2><p>Dầu mỡ bám lâu ngày không chỉ làm mất thẩm mỹ mà còn gây tắc nghẽn khe thoát lửa. Bạn có thể sử dụng hỗn hợp baking soda và giấm để đánh bay vết bẩn.</p><ul><li>Ngâm kiềng bếp trong nước nóng hòa baking soda.</li><li>Dùng khăn ẩm lau bề mặt kính.</li><li>Dùng bàn chải nhỏ làm sạch mâm chia lửa.</li></ul>',
            seoTitle: 'Mẹo vệ sinh bếp gas sạch bong như mới trong 5 phút',
            seoDesc: 'Hướng dẫn cách làm sạch bếp gas bị bám dầu mỡ bằng nguyên liệu tự nhiên như giấm, baking soda siêu nhanh, siêu tiết kiệm.',
            categoryId: 2,
            position: 'default',
            active: true,
            createdAt: '2026-07-16T10:00:00'
        },
        {
            id: 6,
            title: 'Nấu ăn ngon với ngọn lửa xanh',
            slug: 'nau-an-ngon-voi-lua-xanh',
            image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=2070&auto=format&fit=crop',
            content: '<h2>Ngọn lửa xanh - Dấu hiệu của bếp gas tốt</h2><p>Lửa xanh cho thấy khí gas được đốt cháy hoàn toàn, sinh ra nhiệt lượng tối đa và không tạo muội đen dưới đáy nồi. Nếu bếp nhà bạn xuất hiện ngọn lửa đỏ, đó có thể là dấu hiệu cần vệ sinh mâm chia lửa hoặc điều chỉnh lại hệ thống gió.</p>',
            seoTitle: 'Nấu ăn ngon với ngọn lửa xanh | Bí quyết nhà bếp',
            seoDesc: 'Tại sao bếp gas nên có ngọn lửa xanh? Cách khắc phục tình trạng bếp gas bị lửa đỏ làm đen đáy nồi dễ dàng nhất.',
            categoryId: 5,
            position: 'default',
            active: true,
            createdAt: '2026-07-15T10:00:00'
        },
        {
            id: 7,
            title: 'Quy trình lắp đặt gas an toàn tại nhà',
            slug: 'lap-dat-gas-an-toan-tai-nha',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdCLr1Drw3Zmm8R1xEIAdpHoAQb7b_9AZ0kbFWNdKrrg&s=10',
            content: '<h2>Đảm bảo an toàn từ khâu lắp đặt</h2><p>Quá trình lắp bình gas cần sự cẩn trọng tuyệt đối. Phải đảm bảo van gas được vặn chặt, không có tiếng xì và không có mùi lạ. Tốt nhất, hãy để các kỹ thuật viên được đào tạo bài bản thực hiện việc này.</p><p>Gas Việt cam kết kiểm tra an toàn 100% bằng bọt xà phòng mỗi khi giao gas.</p>',
            seoTitle: 'Quy trình lắp đặt gas an toàn tại nhà đúng chuẩn',
            seoDesc: 'Cách kỹ thuật viên chuyên nghiệp lắp đặt và kiểm tra rò rỉ bình gas tại nhà. Những lưu ý bạn cần quan tâm khi đổi gas.',
            categoryId: 6,
            position: 'default',
            active: true,
            createdAt: '2026-07-14T10:00:00'
        },
        {
            id: 8,
            title: 'Giá gas tháng 8 dự kiến giảm nhẹ, người tiêu dùng hưởng lợi',
            slug: 'gia-gas-thang-8-du-kien-giam-nhe',
            image: 'https://media-cdn-v2.laodong.vn/storage/newsportal/2026/7/16/1736102/Cover-Gia-Gas-2.jpg',
            content: '<h2>Tin tức thị trường gas mới nhất</h2><p>Theo báo cáo từ các hiệp hội năng lượng, xu hướng giá dầu thô trên thế giới đang hạ nhiệt kéo theo sự bình ổn của giá gas LPG. Dự kiến trong kỳ điều chỉnh ngày 1 tháng 8, giá gas sẽ giảm từ 5.000 đến 10.000 VNĐ cho bình 12kg.</p><p>Đây là một tin vui đối với các hộ gia đình và nhà hàng, giúp giảm thiểu đáng kể chi phí nhiên liệu hàng tháng.</p>',
            seoTitle: 'Giá gas tháng 8/2026 dự kiến giảm nhẹ | Tin thị trường',
            seoDesc: 'Cập nhật diễn biến giá gas tháng 8 mới nhất. Giá gas LPG dự kiến giảm, giúp người tiêu dùng tiết kiệm chi phí sinh hoạt.',
            categoryId: 3,
            position: 'trending_main',
            active: true,
            createdAt: '2026-07-14T10:00:00'
        },
        {
            id: 9,
            title: 'Cảnh giác với các chiêu trò lừa đảo đổi gas giả mạo',
            slug: 'canh-giac-voi-cac-chieu-tro-lua-dao',
            image: 'https://motthegioi.vn/wp-content/uploads/2026/04/bep-gas-chay-bang-nuoc.jpg.webp',
            content: '<h2>Nhận diện kẻ gian giả danh nhân viên gas</h2><p>Thời gian gần đây, xuất hiện nhiều đối tượng tự xưng là nhân viên công ty gas tới nhà kiểm tra bếp miễn phí. Thực chất, chúng lợi dụng sơ hở để phá hỏng linh kiện hoặc bán van, dây với giá "cắt cổ".</p><p>Hãy cảnh giác và từ chối các dịch vụ "từ trên trời rơi xuống". Chỉ gọi gas tại đại lý uy tín có thông tin rõ ràng.</p>',
            seoTitle: 'Cảnh giác chiêu trò lừa đảo đổi gas, bảo dưỡng bếp gas mạo danh',
            seoDesc: 'Cảnh báo thủ đoạn lừa đảo giả danh nhân viên kiểm tra gas để trục lợi. Hướng dẫn cách phòng tránh và chọn đại lý gas uy tín.',
            categoryId: 1,
            position: 'default',
            active: true,
            createdAt: '2026-07-12T10:00:00'
        },
        {
            id: 10,
            title: 'Cách nhận biết van gas tự ngắt chính hãng',
            slug: 'cach-nhan-biet-van-gas-tu-ngat',
            image: 'https://kingshop.vn/data/images/Van-gas-cao-ap-tu-ngat-an-toan-Namilux-NA-538SH-1.jpg',
            content: '<h2>Phân biệt van chính hãng và hàng nhái</h2><p>Van gas tự ngắt đóng vai trò như một vệ sĩ, tự động khóa gas khi có sự cố đứt dây hay rò rỉ lớn. Tuy nhiên, hàng nhái tràn lan trên thị trường không có chức năng này.</p><ul><li>Logo được dập nổi sắc nét.</li><li>Có tem chống giả của nhà sản xuất (như Namilux, Katsura).</li><li>Cầm nặng tay và gia công tỉ mỉ.</li></ul>',
            seoTitle: 'Cách nhận biết van gas tự ngắt chính hãng và hàng giả',
            seoDesc: 'Van gas tự ngắt bảo vệ gia đình bạn khỏi rủi ro cháy nổ. Học cách phân biệt van gas chính hãng Namilux, Katsura với hàng nhái.',
            categoryId: 6,
            position: 'default',
            active: true,
            createdAt: '2026-07-10T10:00:00'
        },
        {
            id: 11,
            title: 'Khi nào cần thay dây dẫn gas? Dấu hiệu cần biết ngay',
            slug: 'khi-nao-can-thay-day-dan-gas',
            image: 'https://cdn.tgdd.vn//News/542986//nhan-biet-may-dieu-hoa-thieu-gas-het-gas-2-730x487.jpg',
            content: '<h2>Bảo vệ an toàn đường ống dẫn gas</h2><p>Dây dẫn gas được làm bằng cao su, có tuổi thọ khoảng 2-3 năm. Tuy nhiên, nếu bạn phát hiện dây có dấu hiệu chai cứng, nứt nẻ hoặc bị chuột cắn, cần thay ngay lập tức.</p><p>Nên sử dụng loại dây có bọc kẽm chống chuột để tăng cường độ bền và an toàn.</p>',
            seoTitle: 'Khi nào cần thay dây dẫn gas? Dấu hiệu cần thay mới',
            seoDesc: 'Dây dẫn gas cũ, rạn nứt là nguyên nhân số 1 gây rò rỉ gas. Dấu hiệu nhận biết và thời gian thay thế dây dẫn gas an toàn bạn cần biết.',
            categoryId: 6,
            position: 'default',
            active: true,
            createdAt: '2026-07-08T10:00:00'
        },
        {
            id: 12,
            title: 'Sự thật về bình gas vỏ nhựa',
            slug: 'su-that-ve-binh-gas-vo-nhua',
            image: 'https://gassaigonvina.com/upload/product/7-8062.png',
            content: '<h2>Ưu điểm của bình gas bọc nhựa</h2><p>Nhiều người e ngại "vỏ nhựa" dễ cháy, nhưng thực chất đây là lớp nhựa cao cấp bọc ngoài lớp sợi thủy tinh siêu bền. Thiết kế này giúp bình không bị ăn mòn trong môi trường ẩm ướt và dễ dàng quan sát lượng gas còn lại bên trong nhờ lớp nhựa bán trong suốt.</p>',
            seoTitle: 'Sự thật về bình gas vỏ nhựa (Composite) bạn chưa biết',
            seoDesc: 'Giải đáp thắc mắc về độ an toàn của bình gas vỏ nhựa composite. Ưu nhược điểm so với bình gas thép truyền thống.',
            categoryId: 4,
            position: 'default',
            active: true,
            createdAt: '2026-07-05T10:00:00'
        }
    ];

    const seedProducts = [
        // ===== 1. Gas Saigon Petro (3 SP) =====
        {
            id: 1,
            name: 'Gas Saigon Petro Xám 12kg',
            categoryId: 1,
            image: 'https://giaogasnhanh.vn/upload/product/images-(24)-9485_480x480.jpg',
            price: 510000,
            discount: 10,
            description: 'Bình Gas Saigon Petro xám 12kg sở hữu vỏ bình thép chịu lực cao, sơn tĩnh điện chống gỉ sét. Khí gas hóa lỏng tinh khiết cho ngọn lửa xanh đều, không tạo muội làm đen đáy nồi, giúp tiết kiệm nhiên liệu tối đa.',
            specs: 'Trọng lượng ruột: 12kg ± 100g\nLoại van: Van Ngang (POL) / Van Chụp\nThành phần: Khí LPG tinh khiết (30% Propane - 70% Butane)\nÁp suất thử vỏ: 34kg/cm²',
            featured: true,
            onSale: true,
            isSaleOff50: true,
            isFlashDeal: true,
            flashDealDesc: 'Giảm cực mạnh dịp cuối tuần',
            createdAt: '2026-07-01T00:00:00',
            recommendedProducts: [42, 45]
        },
        {
            id: 2,
            name: 'Gas Saigon Petro Xanh 12kg',
            categoryId: 1,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNdoeB28ouCyXGjPABtIWE_FWaiFCooDDDoJcVbGgD4w&s=10',
            price: 510000,
            discount: 0,
            description: 'Bình Gas Saigon Petro xanh 12kg đạt tiêu chuẩn kiểm định nghiêm ngặt. Gas cháy êm, ngọn lửa xanh nhiệt lượng cao, tích hợp màng co niêm phong và tem chống hàng giả 3D an toàn tuyệt đối.',
            specs: 'Trọng lượng ruột: 12kg ± 100g\nLoại van: Van Ngang (vặn ren)\nMàu vỏ: Xanh lá / Xanh dương\nTiêu chuẩn: TCVN 6223:2017',
            featured: false,
            onSale: false,
            isSaleOff50: true,
            createdAt: '2026-07-01T00:01:00'
        },
        {
            id: 3,
            name: 'Gas Saigon Petro Đỏ 12kg',
            categoryId: 1,
            image: 'https://giaogasnhanh.vn/upload/product/gas-sp-saigon-petro-mau-do-12kg-600x584-2575_493.15068493151x480.jpg',
            price: 510000,
            discount: 5,
            description: 'Gas Saigon Petro đỏ 12kg thiết kế vỏ bình dày dặn chịu áp suất cao. Sản phẩm mang đến nguồn nhiệt ổn định, an toàn cho căn bếp gia đình và dễ dàng nhận diện thương hiệu chính hãng.',
            specs: 'Trọng lượng ruột: 12kg ± 100g\nLoại van: Van Ngang POL\nMàu vỏ: Đỏ\nBảo hiểm: Có bảo hiểm cháy nổ chính hãng',
            featured: false,
            onSale: true,
            createdAt: '2026-07-01T00:02:00'
        },

        // ===== 2. Gas Petrolimex (11 SP) =====
        {
            id: 4,
            name: 'Bình Gas Petro Vietnam Xanh Biển',
            categoryId: 2,
            image: 'https://gassaigonvina.com/upload/product/binh-gas-13kg-mau-xanh-gas-petrolimex-4524.png',
            price: 490000,
            discount: 0,
            description: 'Bình màu xanh biển mang thương hiệu uy tín. Chất lượng khí gas tinh khiết, cháy sạch không độc hại, vỏ bình được kiểm định áp suất định kỳ đảm bảo an toàn cháy nổ cao.',
            specs: 'Trọng lượng ruột: 12kg ± 100g\nLoại van: Van Ngang\nÁp suất thiết kế: 17kg/cm²',
            featured: true,
            onSale: false,
            createdAt: '2026-07-02T00:00:00'
        },
        {
            id: 5,
            name: 'Gas Petrovietnam Đỏ 12kg',
            categoryId: 2,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkZ5DlTI-_oLYEKEq9BF9_NGr9dHGeBEqw0bZSGwxQ5g&s=10',
            price: 495000,
            discount: 0,
            description: 'Dòng Gas Petrovietnam đỏ 12kg chuẩn chính hãng, ngọn lửa xanh mượt giúp đun nấu nhanh chóng. Vỏ bình được dán tem niêm phong Bộ Công An, chống rò rỉ khí gas hiệu quả.',
            specs: 'Trọng lượng ruột: 12kg ± 100g\nLoại van: Van Ngang\nXuất xứ: Việt Nam',
            featured: false,
            onSale: false,
            createdAt: '2026-07-02T00:01:00'
        },
        {
            id: 6,
            name: 'Gas Petrovietnam Xám 12kg',
            categoryId: 2,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcC_Us_CIhkYN5WBmijxNfrYdcA0FThSWes6YdQfE2Fg&s=10',
            price: 495000,
            discount: 0,
            description: 'Gas Petrovietnam vỏ xám 12kg phổ thông, phù hợp với mọi không gian bếp. Khí gas cháy kiệt không dư thừa, tiết kiệm chi phí sinh hoạt cho gia đình hàng tháng.',
            specs: 'Trọng lượng ruột: 12kg ± 100g\nLoại van: Van Ngang\nMàu vỏ: Xám tiêu chuẩn',
            featured: false,
            onSale: false,
            createdAt: '2026-07-02T00:02:00'
        },
        {
            id: 7,
            name: 'Petrolimex 12kg Van Đứng',
            categoryId: 2,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4IyrDhwtsUICtZpn4sW6xNKTZ-Td9iYycdHsHtTndhQ&s=10',
            price: 580000,
            discount: 8,
            description: 'Bình Petrolimex 12kg trang bị van đứng (Compact) bấm chụp tiện lợi. Thao tác tháo lắp cực kỳ dễ dàng và an toàn, phù hợp cho các căn hộ chung cư và gia đình hiện đại.',
            specs: 'Trọng lượng ruột: 12kg ± 100g\nLoại van: Van Chụp 20mm (Van đứng)\nMàu vỏ: Xanh dương Petrolimex',
            featured: true,
            onSale: true,
            createdAt: '2026-07-02T00:03:00'
        },
        {
            id: 8,
            name: 'Petrolimex 12kg Van Shell',
            categoryId: 2,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTz4Pm91Yvv_WR48xccfmHJzVW51g0CgsGoKFxFkWMGMw&s=10',
            price: 580000,
            discount: 0,
            description: 'Dòng bình Petrolimex 12kg van Shell (van xoay POL) truyền thống, ren vặn chắc chắn chống xì gas. Vỏ bình màu xanh dương biểu trưng cho chất lượng và độ bền vượt trội.',
            specs: 'Trọng lượng ruột: 12kg ± 100g\nLoại van: Van Shell (POL vặn ren)\nMàu vỏ: Xanh dương Petrolimex',
            featured: false,
            onSale: false,
            createdAt: '2026-07-02T00:04:00'
        },
        {
            id: 9,
            name: 'Bình Petrolimex 12kg (Van ngang)',
            categoryId: 2,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRC-VHklNs7aet5PN9DzXPHuvxBruDUlmfmvNJICw1F7g&s=10',
            price: 480000,
            discount: 0,
            description: 'Bình Petrolimex 12kg van ngang chuyên dụng, thiết kế khớp nối chuẩn xác giúp dòng khí gas lưu thông ổn định, giữ ngọn lửa luôn xanh và đều.',
            specs: 'Trọng lượng ruột: 12kg ± 100g\nLoại van: Van Ngang\nTem chống giả: Tem mã QR / Tem BCT',
            featured: false,
            onSale: false,
            createdAt: '2026-07-02T00:05:00'
        },
        {
            id: 10,
            name: 'Bình Petrolimex 12kg (Van chụp)',
            categoryId: 2,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjUmqf03RBWBdfKMem8XE4F0b31wJ53CtknxigqV-zaQ&s=10',
            price: 480000,
            discount: 0,
            description: 'Bình Petrolimex 12kg tích hợp van chụp tự động ngắt gas khi có sự cố. Vỏ bình sơn tĩnh điện cao cấp, chống ăn mòn trong môi trường bếp ẩm ướt.',
            specs: 'Trọng lượng ruột: 12kg ± 100g\nLoại van: Van Chụp bám an toàn\nÁp suất thử: 34kg/cm²',
            featured: false,
            onSale: false,
            createdAt: '2026-07-02T00:06:00'
        },
        {
            id: 11,
            name: 'Bình Petrolimex 45kg (Van công nghiệp)',
            categoryId: 2,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCBXtJgfeDbv6isnJWlZYNTvJJdSL5TvUClyN_-z_YJg&s=10',
            price: 1750000,
            discount: 0,
            description: 'Bình gas công nghiệp Petrolimex 45kg chuyên dùng cho nhà hàng, khách sạn và bếp ăn tập thể. Dung tích lớn, áp suất gas ổn định, đáp ứng tần suất đun nấu liên tục.',
            specs: 'Trọng lượng ruột: 45kg ± 200g\nLoại van: Van Công Nghiệp\nChiều cao bình: ≈ 1200mm',
            featured: false,
            onSale: false,
            createdAt: '2026-07-02T00:07:00'
        },
        {
            id: 12,
            name: 'Bình Petrolimex 48kg (Van công nghiệp)',
            categoryId: 2,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-PiyHfvbts2VWVuEp13zY9yn2xOkHggt-qXdxIY8kFQ&s=10',
            price: 1850000,
            discount: 0,
            description: 'Dòng bình gas công nghiệp Petrolimex 48kg công suất lớn, tiết kiệm thời gian đổi gas cho các cơ sở chế biến thực phẩm và quán ăn quy mô lớn.',
            specs: 'Trọng lượng ruột: 48kg ± 200g\nLoại van: Van Công Nghiệp\nĐường kính thân bình: ≈ 375mm',
            featured: false,
            onSale: false,
            createdAt: '2026-07-02T00:08:00'
        },
        {
            id: 13,
            name: 'Lon Gas Mini Petrolimex',
            categoryId: 2,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqU_Rq4J3mTQf-O8_ZilQDS6dBU8wNkAgbregJIqEj-A&s=10',
            price: 95000,
            discount: 15,
            description: 'Lon gas mini Petrolimex chứa khí gas tinh khiết, an toàn tuyệt đối cho các loại bếp gas du lịch, bếp lẩu gia đình. Chống nổ hiệu quả khi đun nấu lâu.',
            specs: 'Trọng lượng ruột: 220g / lon\nThành phần: 100% Butane\nQuy cách: Lon lẻ',
            featured: false,
            onSale: true,
            createdAt: '2026-07-02T00:09:00'
        },
        {
            id: 14,
            name: 'Thùng Lon Gas Mini Petrolimex',
            categoryId: 2,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNvMJMO5dTRWcqjwxSxBBawpD9ZvQtVu2sdcdjJLXU5w&s=10',
            price: 550000,
            discount: 0,
            description: 'Thùng lon gas mini Petrolimex tiện lợi, giải pháp tiết kiệm cho các quán lẩu, nướng hoặc các chuyến picnic, dã ngoại đông người.',
            specs: 'Quy cách đóng gói: Thùng 28 lon\nDung tích mỗi lon: 220g\nHạn sử dụng: 5 năm',
            featured: false,
            onSale: false,
            createdAt: '2026-07-02T00:10:00'
        },

        // ===== 3. Gas Gia Đình (3 SP) =====
        {
            id: 15,
            name: 'Gia Đình Gas 12kg (Van ngang)',
            categoryId: 3,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzWWiQEK-rq73NcInh7huxeR88ZiwveZODRrQDkaJiJw&s=10',
            price: 460000,
            discount: 0,
            description: 'Gia Đình Gas 12kg van ngang sở hữu vỏ bình đa sắc hiện đại, lớp sơn tĩnh điện mịn đẹp. Van vặn ren chuẩn an toàn, ngọn lửa xanh mượt tiết kiệm gas.',
            specs: 'Trọng lượng ruột: 12kg ± 100g\nLoại van: Van Ngang POL\nMàu sắc vỏ: Đa sắc (Xám / Xanh / Hồng / Vàng)',
            featured: true,
            onSale: false,
            createdAt: '2026-07-03T00:00:00'
        },
        {
            id: 16,
            name: 'Gia Đình Gas 12kg (Van chụp)',
            categoryId: 3,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKaYlQDEBsnjnkVS91A1OayjqMMlSdytCsp6tIbIAEdg&s=10',
            price: 460000,
            discount: 10,
            description: 'Gia Đình Gas 12kg trang bị van chụp bấm nhanh, chống rò rỉ khí gas vượt trội. Vỏ bình thời trang giúp không gian bếp thêm phần trẻ trung, sinh động.',
            specs: 'Trọng lượng ruột: 12kg ± 100g\nLoại van: Van Chụp Compact\nThương hiệu: An Phát Petrol',
            featured: false,
            onSale: true,
            createdAt: '2026-07-03T00:01:00'
        },
        {
            id: 17,
            name: 'Gia Đình Gas 45kg (Công nghiệp)',
            categoryId: 3,
            image: 'https://mekongsen.vn/datafiles/47/2024-02/thumbs-97594329-G%C4%90-avt.jpg',
            price: 1680000,
            discount: 0,
            description: 'Bình Gia Đình Gas 45kg phục vụ chuỗi nhà hàng, quán ăn. Vỏ bình siêu bền, lưu lượng gas xả đều giúp ngọn lửa luôn mạnh mẽ.',
            specs: 'Trọng lượng ruột: 45kg ± 200g\nLoại van: Van Công Nghiệp\nÁp suất thử: 34kg/cm²',
            featured: false,
            onSale: false,
            createdAt: '2026-07-03T00:02:00'
        },

        // ===== 4. Gas Thủ Đức (3 SP) =====
        {
            id: 18,
            name: 'Gas Thủ Đức 12kg (Van ngang)',
            categoryId: 4,
            image: 'https://gasleminh.com/wp-content/uploads/2022/10/screenshot_1677840360.png',
            price: 450000,
            discount: 0,
            description: 'Gas Thủ Đức 12kg van ngang nổi tiếng với vỏ bình màu xanh đen (Navy) đặc trưng. Khí gas chất lượng cao, cháy sạch, van vặn an toàn chuẩn thị trường phía Nam.',
            specs: 'Trọng lượng ruột: 12kg ± 100g\nLoại van: Van Ngang\nMàu vỏ: Xanh Đen (Navy)',
            featured: true,
            onSale: false,
            createdAt: '2026-07-04T00:00:00'
        },
        {
            id: 19,
            name: 'Gas Thủ Đức 12kg (Van chụp)',
            categoryId: 4,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqqnKfgK14S6uaDZtOuoudXCTiLzRGN0yW5Wg9C3oJug&s=10',
            price: 450000,
            discount: 0,
            description: 'Gas Thủ Đức 12kg van chụp an toàn, thao tác ngắt mở nhẹ nhàng. Sản phẩm đạt tiêu chuẩn chất lượng PCCC, tem nhãn chống giả rõ ràng.',
            specs: 'Trọng lượng ruột: 12kg ± 100g\nLoại van: Van Chụp\nTiêu chuẩn: TCVN 6223:2017',
            featured: false,
            onSale: false,
            createdAt: '2026-07-04T00:01:00'
        },
        {
            id: 20,
            name: 'Gas Thủ Đức 45kg (Công nghiệp)',
            categoryId: 4,
            image: 'https://thuducgas.vn/upload/images/b%C3%ACnh%20gas%20c%C3%B4ng%20nghi%E1%BB%87p%2045kg.png',
            price: 1650000,
            discount: 0,
            description: 'Bình công nghiệp Gas Thủ Đức 45kg cho hiệu suất nhiệt cực cao, vỏ bình chịu lực tốt, đáp ứng hoàn hảo nhu cầu đun nấu công suất lớn.',
            specs: 'Trọng lượng ruột: 45kg ± 200g\nLoại van: Van Công Nghiệp\nỨng dụng: Bếp công nghiệp / Xưởng sản xuất',
            featured: false,
            onSale: false,
            createdAt: '2026-07-04T00:02:00'
        },

        // ===== 5. Gas Elf (5 SP) =====
        {
            id: 21,
            name: 'Elf Màu Đỏ - 6kg',
            categoryId: 5,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9OKER1KLe8rGOooF9CI8jezi5f2Jih1fi2J3irppcXg&s',
            price: 320000,
            discount: 12,
            description: 'Bình Elf Gas 6kg nhỏ gọn, giải pháp lý tưởng cho sinh viên, căn hộ chung cư nhỏ hoặc hộ gia đình ít nấu nướng. Van chụp an toàn chuẩn Châu Âu.',
            specs: 'Trọng lượng ruột: 6kg ± 50g\nLoại van: Van Chụp Đỏ\nThương hiệu: TotalEnergies (Pháp)',
            featured: true,
            onSale: true,
            createdAt: '2026-07-05T00:00:00'
        },
        {
            id: 22,
            name: 'Gas Elf Đỏ 12.5kg',
            categoryId: 5,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpLcfGmx_MR64O7EwtTraZHBNfTKvj_oAdVABgn8OdUA&s=10',
            price: 550000,
            discount: 0,
            description: 'Elf Gas đỏ 12.5kg thương hiệu TotalEnergies (Pháp). Thiết kế vỏ bình chuẩn quốc tế, công nghệ khóa van an toàn cao cấp chống rò rỉ khí gas.',
            specs: 'Trọng lượng ruột: 12.5kg ± 100g\nLoại van: Van Chụp / Van Ngang\nMàu vỏ: Đỏ mảng xám',
            featured: false,
            onSale: false,
            createdAt: '2026-07-05T00:01:00'
        },
        {
            id: 23,
            name: 'Elf Gas 12kg (Van ngang)',
            categoryId: 5,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCItykuDDNEQdzLIeY9zSRL4oa5_zmaq_kINuHE8iRbA&s=10',
            price: 470000,
            discount: 0,
            description: 'Elf Gas 12kg van ngang kết hợp giữa chất lượng gas tiêu chuẩn Châu Âu và van vặn ren truyền thống bền bỉ, cho ngọn lửa xanh và nhiệt lượng cao.',
            specs: 'Trọng lượng ruột: 12kg ± 100g\nLoại van: Van Ngang POL\nTiêu chuẩn: EU Standard',
            featured: false,
            onSale: false,
            createdAt: '2026-07-05T00:02:00'
        },
        {
            id: 24,
            name: 'Elf Gas 12kg (Van chụp)',
            categoryId: 5,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTarAan8NSN_SXdWEjFODiPJfE6zlFsoEtWdLlNFxtiHg&s=10',
            price: 470000,
            discount: 0,
            description: 'Elf Gas 12kg van chụp đỏ cao cấp, thao tác rút khóa nhanh gọn, chống xì gas tối đa, mang lại sự an tâm tuyệt đối cho căn bếp gia đình.',
            specs: 'Trọng lượng ruột: 12kg ± 100g\nLoại van: Van Chụp rút\nXuất xứ thương hiệu: Pháp',
            featured: false,
            onSale: false,
            createdAt: '2026-07-05T00:03:00'
        },
        {
            id: 25,
            name: 'Elf Gas 39kg / 45kg (Công nghiệp)',
            categoryId: 5,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQW148byXQ8eDcrHqpAllXTVgC9DFRe7orAVWJoBw3OYA&s=10',
            price: 1690000,
            discount: 0,
            description: 'Bình Elf Gas công nghiệp 39kg/45kg chịu áp suất cực lớn, cung cấp nguồn năng lượng ổn định cho các hệ thống bếp trung tâm và nhà máy chế biến.',
            specs: 'Trọng lượng ruột: 39kg / 45kg\nLoại van: Van Công Nghiệp chuyên dụng\nÁp suất thử: 34kg/cm²',
            featured: false,
            onSale: false,
            createdAt: '2026-07-05T00:04:00'
        },

        // ===== 6. Bếp Hồng Ngoại (10 SP) =====
        {
            id: 26,
            name: 'Bếp hồng ngoại Sunhouse SHD6011 - Bếp đơn - 2000W',
            categoryId: 6,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-USp9nnPYfDZ7LK3r0l0mRShzOeTHAPPuOPLZ3pnuyQ&s=10',
            price: 650000,
            discount: 0,
            description: 'Bếp hồng ngoại đơn Sunhouse SHD6011 công suất 2000W, mặt kính Ceramic chịu nhiệt tràn viền sang trọng. Bảng điều khiển tiếng Việt dễ dùng, không kén xoong nồi.',
            specs: 'Loại bếp: Bếp đơn\nCông suất: 2000W\nMặt kính: Kính Ceramic chịu nhiệt\nBảng điều khiển: Nút bấm cơ / Tiếng Việt',
            featured: false,
            onSale: false,
            createdAt: '2026-07-06T00:00:00'
        },
        {
            id: 27,
            name: 'Bếp hồng ngoại Kangaroo HG368i - Bếp đơn - 2000W',
            categoryId: 6,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfVQ6GMGrehYCpq6hCjhWLU38dm_GOL0H9q6g44AjNDg&s=10',
            price: 720000,
            discount: 0,
            description: 'Kangaroo HG368i sở hữu phím bấm cơ bền bỉ, tích hợp tay cầm hai bên tiện di chuyển. Đa dạng chế độ nấu nướng từ lẩu, xào đến nướng trực tiếp trên mặt bếp.',
            specs: 'Loại bếp: Bếp đơn\nCông suất: 2000W\nTiện ích: Có tay cầm xách tiện lợi\nHẹn giờ: Có',
            featured: false,
            onSale: false,
            isFlashDeal: true,
            flashDealDesc: 'Khuyến mãi đặc biệt trong ngày',
            createdAt: '2026-07-06T00:01:00'
        },
        {
            id: 28,
            name: 'Bếp hồng ngoại Sanaky SNK-2101HG - Bếp đơn - 2000W',
            categoryId: 6,
            image: 'https://gasleminh.com/wp-content/uploads/2022/10/screenshot_1677840360.png',
            price: 850000,
            discount: 0,
            description: 'Bếp hồng ngoại Sanaky SNK-2101HG trang bị phím cảm ứng mượt mà, màn hình LED hiển thị rõ ràng. Đi kèm vỉ nướng inox tiện lợi cho các buổi tiệc gia đình.',
            specs: 'Loại bếp: Bếp đơn\nCông suất: 2000W\nBảng điều khiển: Cảm ứng\nKhóa an toàn: Có',
            featured: false,
            onSale: false,
            createdAt: '2026-07-06T00:02:00'
        },
        {
            id: 29,
            name: 'Bếp hồng ngoại Midea MIR-T2015DC - Bếp đơn - 2000W',
            categoryId: 6,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCg3AAxwK6HltRWZMA9a525jHdjgab90E0sOxRNivrpA&s=10',
            price: 990000,
            discount: 10,
            description: 'Midea MIR-T2015DC phá cách với núm xoay điều chỉnh công suất nhanh chóng. Mặt kính Ceramic đen bóng chống trầy xước, dễ dàng lau chùi sau khi nấu.',
            specs: 'Loại bếp: Bếp đơn\nCông suất: 2000W\nĐiều khiển: Núm xoay vô cấp\nMặt kính: Ceramic cao cấp',
            featured: false,
            onSale: true,
            createdAt: '2026-07-06T00:03:00'
        },
        {
            id: 30,
            name: 'Bếp hồng ngoại Junger MT-21 - Bếp đơn - 2200W',
            categoryId: 6,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTc-hvpwqlB-HFdPbcHDp7Kf7Lt9oG57h0NyKBuuOSWQ&s=10',
            price: 1850000,
            discount: 0,
            description: 'Bếp hồng ngoại cao cấp Junger MT-21 nhập khẩu, mặt kính Schott Ceran (Đức) chịu lực chịu nhiệt đỉnh cao. Công suất 2200W đun sôi cực nhanh, khóa an toàn thông minh.',
            specs: 'Loại bếp: Bếp đơn cao cấp\nCông suất: 2200W\nMặt kính: Schott Ceran (Đức)\nXuất xứ: Linh kiện Đức / Lắp ráp Thái Lan',
            featured: true,
            onSale: false,
            isFlashDeal: true,
            flashDealDesc: 'Hàng Đức cao cấp giảm cực sốc',
            createdAt: '2026-07-06T00:04:00'
        },
        {
            id: 31,
            name: 'Bếp hồng ngoại Sunhouse Mama MMB9100VN - Bếp đôi - 3600W',
            categoryId: 6,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLezxdBy7vtw0cR6ZpGKT42Xl3UToyaaN8ef5FYo_6mg&s=10',
            price: 3490000,
            discount: 0,
            description: 'Bếp đôi hồng ngoại Sunhouse Mama MMB9100VN thiết kế âm/dương linh hoạt. Mặt kính Kanger bo viền cao cấp, 2 vùng nấu riêng biệt công suất tổng 3600W.',
            specs: 'Loại bếp: Bếp đôi âm/dương\nCông suất: 3600W (Trái: 1800W, Phải: 1800W)\nMặt kính: Kanger vát cạnh\nChức năng: Inverter tiết kiệm điện',
            featured: false,
            onSale: false,
            createdAt: '2026-07-06T00:05:00'
        },
        {
            id: 32,
            name: 'Bếp hồng ngoại Kangaroo GD732IR - Bếp đôi - 4000W',
            categoryId: 6,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLSJHhYHRnWKumwq3zlFSN0svRyiD8AXvs9l4r0jL2YA&s=10',
            price: 4200000,
            discount: 0,
            description: 'Bếp đôi lắp âm Kangaroo GD732IR công suất mạnh mẽ 4000W. Hẹn giờ thông minh, tự động ngắt khi quá nhiệt, tôn lên nét hiện đại cho gian bếp.',
            specs: 'Loại bếp: Bếp đôi âm\nCông suất: 4000W\nBảng điều khiển: Slide trượt độc lập\nKích thước đá cắt: ≈ 680 × 380mm',
            featured: false,
            onSale: false,
            createdAt: '2026-07-06T00:06:00'
        },
        {
            id: 33,
            name: 'Bếp hồng ngoại Canzy CZ 888I - Bếp đôi - 4200W',
            categoryId: 6,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhmo4OBLImALW5wgsocyE45UgS1P7KkiMutZybIyVWHA&s=10',
            price: 5800000,
            discount: 5,
            description: 'Bếp đôi Canzy CZ 888I sử dụng mâm nhiệt E.G.O (Đức) siêu bền. Mặt kính vát cạnh bo viền nhôm bảo vệ, công nghệ biến tần tiết kiệm điện năng.',
            specs: 'Loại bếp: Bếp đôi âm\nCông suất: 4200W (Booster)\nMâm nhiệt: E.G.O Germany\nKhóa trẻ em: Có',
            featured: true,
            onSale: true,
            createdAt: '2026-07-06T00:07:00'
        },
        {
            id: 34,
            name: 'Bếp hồng ngoại Malloca MHR 921 - Bếp đôi - 4000W',
            categoryId: 6,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlcVzN_VVw40nvIPU8ZP0U-dI9pSu2QzjKWDcMKthbig&s=10',
            price: 9200000,
            discount: 0,
            description: 'Bếp hồng ngoại đôi Malloca MHR 921 chuẩn phong cách Tây Ban Nha. Mặt kính EuroKera (Pháp) chịu nhiệt 1000°C, bảng điều khiển touch-slider hiện đại.',
            specs: 'Loại bếp: Bếp đôi âm\nCông suất: 4000W\nMặt kính: EuroKera (KeraResist)\nThương hiệu: Tây Ban Nha',
            featured: false,
            onSale: false,
            createdAt: '2026-07-06T00:08:00'
        },
        {
            id: 35,
            name: 'Bếp hồng ngoại Bosch PKN645FP1E - Bếp 4 vùng nấu - 6600W',
            categoryId: 6,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROy-Y6K5k_oVe7MUHiCt7KiZaj8F0_BJyXKoQsv6lG6g&s=10',
            price: 11500000,
            discount: 8,
            description: 'Bếp hồng ngoại 4 vùng nấu Bosch PKN645FP1E nhập khẩu Đức. Tổng công suất 6600W, điều khiển DirectSelect 17 mức nhiệt, giải pháp hoàn hảo cho căn bếp biệt thự cao cấp.',
            specs: 'Loại bếp: Bếp 4 vùng nấu\nCông suất: 6600W\nMặt kính: Schott Ceran bo viền Inox\nXuất xứ: Đức (Germany)',
            featured: true,
            onSale: true,
            createdAt: '2026-07-06T00:09:00'
        },

        // ===== 7. Bếp Gas Âm (6 SP) =====
        {
            id: 36,
            name: 'Bếp gas âm Rinnai RVB-2GI(B) - Bếp đôi - Đầu đốt đồng thau',
            categoryId: 7,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLNdmNhbK95LNoCFz2DAgrI4sm8JqQoVd-Arjc5VX22A&s=10',
            price: 2850000,
            discount: 0,
            description: 'Bếp gas âm Rinnai RVB-2GI(B) trang bị mặt kính cường lực đen tuyền. Đầu đốt bằng đồng thau siêu bền, cho ngọn lửa xoáy tập trung đáy nồi, tiết kiệm gas.',
            specs: 'Số lò nấu: 2 lò\nĐầu đốt: Đồng thau đúc nguyên khối\nĐánh lửa: Pin IC 1.5V\nNgắt gas tự động: Có',
            featured: true,
            onSale: false,
            createdAt: '2026-07-07T00:00:00'
        },
        {
            id: 37,
            name: 'Bếp gas âm Paloma PA-209J - Bếp đôi - Cảm ứng ngắt gas tự động',
            categoryId: 7,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDSZb6Cg3qzWdLjJBBKm0XWkMKGxuulID7h7ONdEgs1g&s=10',
            price: 3600000,
            discount: 0,
            description: 'Bếp gas âm Paloma PA-209J nhập khẩu Nhật Bản. Cụm cảm ứng ngắt gas tự động khi tràn nước hoặc gió thổi tắt bếp, an toàn tuyệt đối cho người dùng.',
            specs: 'Số lò nấu: 2 lò\nXuất xứ: Nhật Bản\nMặt bếp: Kính cường lực chịu lực 8mm\nLượng gas tiêu thụ: 0.43kg/h',
            featured: false,
            onSale: false,
            createdAt: '2026-07-07T00:01:00'
        },
        {
            id: 38,
            name: 'Bếp gas âm Electrolux EGG7627S - Bếp đôi - Mâm chia lửa SABAF',
            categoryId: 7,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2VXY2znTJTjR3aGTMUR8B1juCd4_JUJwMUu641NpD2w&s=10',
            price: 3290000,
            discount: 0,
            description: 'Electrolux EGG7627S mang thiết kế Châu Âu sang trọng. Mâm chia lửa SABAF (Ý) cho ngọn lửa xòe đều, đánh lửa bằng pin IC siêu nhạy.',
            specs: 'Số lò nấu: 2 lò\nMâm chia lửa: SABAF (Nhập khẩu Ý)\nKiềng bếp: Gang đúc\nThương hiệu: Thụy Điển',
            featured: false,
            onSale: false,
            createdAt: '2026-07-07T00:02:00'
        },
        {
            id: 39,
            name: 'Bếp gas âm Sunhouse SHB5536 - Bếp đôi - Kiềng gang đúc chống trượt',
            categoryId: 7,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMoVyKRj25gjwjfUv1YeR1QQ-OjRT10VrNXH3gXs8wFA&s=10',
            price: 2150000,
            discount: 15,
            description: 'Bếp gas âm Sunhouse SHB5536 trang bị kiềng gang đúc nguyên khối siêu bền, chống trơn trượt nồi chảo. Mặt kính cường lực dày 8mm chịu lực cực tốt.',
            specs: 'Số lò nấu: 2 lò\nMặt kính: Kính cường lực dày 8mm\nCụm kim phun: Đồng thau\nHệ thống đánh lửa: Magneto / IC',
            featured: false,
            onSale: true,
            createdAt: '2026-07-07T00:03:00'
        },
        {
            id: 40,
            name: 'Bếp gas âm Canzy CZ-102 - Bếp đôi - Khay inox 304 có chế độ hầm',
            categoryId: 7,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoT56q6Imn1ln6VO_0E_Gxgxcb9jKYbeBEOd06xCpH4A&s=10',
            price: 2450000,
            discount: 0,
            description: 'Canzy CZ-102 sở hữu khay Inox 304 không gỉ sáng bóng. Tích hợp chế độ pép hầm tiết kiệm gas, thích hợp cho các món ninh, hầm thời gian dài.',
            specs: 'Số lò nấu: 2 lò\nKhay hứng: Inox 304 chống gỉ\nTính năng: Có pép hầm tiết kiệm gas\nĐánh lửa: Pin 1.5V',
            featured: false,
            onSale: false,
            createdAt: '2026-07-07T00:04:00'
        },
        {
            id: 41,
            name: 'Bếp gas âm Malloca DSG 732 - Bếp đôi - Kính cường lực vát cạnh 8mm',
            categoryId: 7,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQg5t3EqBjSEo9IzkQQtzHg3P3HEeSYtNtfexUtHnQcbg&s=10',
            price: 4800000,
            discount: 0,
            description: 'Bếp gas âm cao cấp Malloca DSG 732 với mặt kính cường lực vát cạnh 8mm tinh tế. Chế độ ngắt gas tự động van kim an toàn, kiềng thế hệ mới chống va đập.',
            specs: 'Số lò nấu: 2 lò\nMặt kính: Kính cường lực vát cạnh 8mm\nCảm ứng ngắt gas: Van kim tự động\nThương hiệu: Malloca',
            featured: false,
            onSale: false,
            createdAt: '2026-07-07T00:05:00'
        },

        // ===== 8. Phụ Kiện (Van, Dây) (6 SP) =====
        {
            id: 42,
            name: 'Van ngắt gas tự động Namilux NA-337S (Van ngang)',
            categoryId: 8,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSF4eu_DgVyBuhH6pl1lpYTFCWrZJoYE55On5OipJvciA&s',
            price: 220000,
            discount: 0,
            description: 'Van ngang Namilux NA-337S tích hợp rơ-le ngắt gas tự động khi phát hiện sự cố rò rỉ hoặc tuột dây. Thân van đúc bằng hợp kim kẽm nguyên khối chống gỉ.',
            specs: 'Loại van: Van ngang ngắt tự động\nChất liệu: Hợp kim kẽm nguyên khối\nÁp suất đầu vào: 0.7 - 7kg/cm²\nÁp suất đầu ra: 350 ± 50mm H₂O',
            featured: false,
            onSale: false,
            createdAt: '2026-07-08T00:00:00'
        },
        {
            id: 43,
            name: 'Van chụp gas Namilux NA-345S (Van chụp)',
            categoryId: 8,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcST1qawQCA6UDSMUK5JX2QrL_n8TsACg1hFkUHZIqJe0w&s=10',
            price: 260000,
            discount: 0,
            description: 'Van chụp Namilux NA-345S chuyên dụng cho các bình gas van chụp (Gia Đình, Petrolimex, Elf). Thao tác khóa/mở bằng nút bấm an toàn, bảo vệ tối đa cho chung cư.',
            specs: 'Loại van: Van chụp (Compact 20mm)\nTính năng: Ngắt gas tự động\nÁp suất xả: Tiêu chuẩn an toàn PCCC',
            featured: false,
            onSale: false,
            createdAt: '2026-07-08T00:01:00'
        },
        {
            id: 44,
            name: 'Van gas cao cấp Katsura V-2S (Van ngang)',
            categoryId: 8,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmLJ_1_CuDJRJn1tFhOc4-7W_7FK4pAL7uRRaQePYMzw&s',
            price: 380000,
            discount: 0,
            description: 'Van gas Katsura V-2S sản xuất theo công nghệ JIS Nhật Bản. Độ bền trên 10 năm, cơ chế xả áp tự động chống cháy nổ tuyệt đối.',
            specs: 'Xuất xứ: Công nghệ Nhật Bản (JIS Standard)\nLoại van: Van ngang cao cấp\nTuổi thọ thiết kế: > 10 năm',
            featured: false,
            onSale: false,
            createdAt: '2026-07-08T00:02:00'
        },
        {
            id: 45,
            name: 'Dây dẫn gas chống chuột Namilux (Dây bọc inox)',
            categoryId: 8,
            image: 'https://gasleminh.com/wp-content/uploads/2022/10/screenshot_1677840360.png',
            price: 120000,
            discount: 0,
            description: 'Dây dẫn gas Namilux 3 lớp cao cấp, bên ngoài bọc vỏ lò xo inox sáng bóng chống chuột, gián cắn đứt. Chịu được áp suất cực cao và không bị gập dây.',
            specs: 'Chiều dài: 1.5m\nCấu tạo: 3 lớp (Cao su PVC + Lưới sợi Nilon + Vỏ lò xo Inox)\nTự động chống chuột: 100%',
            featured: false,
            onSale: false,
            createdAt: '2026-07-08T00:03:00'
        },
        {
            id: 46,
            name: 'Dây dẫn gas Hàn Quốc Kogas (Dây lõi thép)',
            categoryId: 8,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqfHS6yU1Lf0Kzd2NSmypWEUq3NonkZJqRq3bqgw_W3g&s=10',
            price: 180000,
            discount: 0,
            description: 'Dây gas Kogas nhập khẩu Hàn Quốc cấu tạo từ cao su lưu hóa cao cấp tích hợp lưới lõi thép dẻo dai. Khả năng chống cháy, chống ăn mòn hóa chất vượt trội.',
            specs: 'Xuất xứ: Hàn Quốc (Kogas)\nCấu tạo: Cao su lưu hóa + Lưới thép gia cường\nÁp suất nổ: > 10bar',
            featured: false,
            onSale: false,
            createdAt: '2026-07-08T00:04:00'
        },
        {
            id: 47,
            name: 'Bộ combo van dây ngắt tự động Namilux',
            categoryId: 8,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC76n9joZyiYn9x2HaCsiIhcXU1R5KtawvTFBnmiD4Tw&s=10',
            price: 320000,
            discount: 10,
            description: 'Trọn bộ Combo gồm 01 Van ngắt gas tự động Namilux + 01 Dây dẫn gas chống chuột + 02 Đai siết inox. Giải pháp an toàn đồng bộ, tiết kiệm chi phí cho gia đình.',
            specs: 'Trọn bộ gồm: 1 Van tự động NA-337S + 1 Dây bọc Inox 1.5m + 2 Đai siết Inox\nThương hiệu: Namilux chính hãng',
            featured: false,
            onSale: true,
            createdAt: '2026-07-08T00:05:00'
        },
        // ===== 9. Combo Khuyến Mãi (9 SP) =====
        {
            id: 101,
            name: 'Combo Bếp Gas Đôi + Bộ Van Dây Nhật Bản',
            categoryId: 9,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJZ-HwOA8Qu2AZHWWU-XTK5yHB9PH-uOD2m-f-7ORBEg&s=10',
            price: 690000,
            discount: 22,
            description: 'Combo hoàn hảo cho gia đình bắt đầu làm bếp mới. Bao gồm bếp gas đôi mặt kính cường lực chịu nhiệt cao, đi kèm bộ van ngắt gas tự động Katsura công nghệ Nhật Bản và dây dẫn gas chống chuột 3 lớp, đảm bảo an toàn tuyệt đối chống rò rỉ.',
            specs: 'Trọn bộ gồm: 01 Bếp gas đôi mặt kính + 01 Van ngắt tự động Katsura + 01 Dây gas bọc inox 1.5m\nMặt bếp: Kính cường lực vát cạnh 7mm\nHệ thống đánh lửa: Magneto',
            featured: true,
            onSale: true,
            createdAt: '2026-07-29T00:01:00'
        },
        {
            id: 102,
            name: 'Combo Bếp Gas Đơn Inox + Bình Gas 12kg',
            categoryId: 9,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgPLowpg8EgN0ym9AefcONTThVfm5x0unJW2QR82qg2A&s=10',
            price: 490000,
            discount: 25,
            description: 'Đổi bình gas chính hãng Petrolimex/Saigon Petro 12kg nhận ngay bộ van dây an toàn. Đặc biệt phù hợp cho khách hàng có nhu cầu thay thế bộ van dây đã quá hạn sử dụng (trên 2 năm) để phòng chống cháy nổ.',
            specs: 'Trọn bộ gồm: 01 Bình gas 12kg (Đổi khí) + 01 Bộ van dây tự động Namilux\nChứng nhận an toàn: Có bảo hiểm trách nhiệm 2 tỷ đồng\nThời hạn sử dụng khuyên dùng cho van dây: 24 tháng',
            featured: true,
            onSale: true,
            createdAt: '2026-07-29T00:02:00'
        },
        {
            id: 103,
            name: 'Combo Bếp Điện Từ Hồng Ngoại + Chảo Chống Dính',
            categoryId: 9,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuK9j6B8dhfrG0PqePi9Yg0eFpfTFqaO8TTC-bo3GZsA&s',
            price: 350000,
            discount: 22,
            description: 'Tiện lợi tối đa cho những chuyến dã ngoại, sinh viên ở trọ hoặc ăn lẩu tại nhà. Bếp gas mini Namilux với van an toàn Inline-Cut ngắt gas trực tiếp từ bên trong, kèm theo 5 lon gas mini Maxsun chính hãng.',
            specs: 'Trọn bộ gồm: 01 Bếp gas mini Namilux + 05 Lon gas mini Maxsun 250g\nCông suất: 2.4 kW (2,050 kcal/h)\nTính năng an toàn: Van ngắt gas Inline-Cut (chống nổ lon gas)\nChất liệu bếp: Thép sơn tĩnh điện chống gỉ',
            featured: true,
            onSale: true,
            createdAt: '2026-07-29T00:03:00'
        },
        {
            id: 104,
            name: 'Combo Bình ga Bếp Gas Đôi Van Dây Tự Động',
            categoryId: 9,
            image: 'https://giadoibinhgaspetro6kg12kg45kg.com.vn/upload/elfinder/B%E1%BB%99%20b%C3%ACnh%20b%E1%BA%BFp%20%C4%91%C6%A1n/HIKUSHI.png',
            price: 790000,
            discount: 20,
            description: 'Giải pháp toàn diện và cực kỳ tiết kiệm cho sinh viên, công nhân hoặc gia đình 1-2 người. Mua 1 lần có ngay trọn bộ bếp và gas để nấu nướng ngay lập tức mà không phát sinh thêm chi phí.',
            specs: 'Trọn bộ gồm: 01 Bếp gas đơn mặt inox + 01 Bình gas 12kg + 01 Bộ van dây an toàn\nChất liệu mặt bếp: Inox 304 không gỉ dễ lau chùi\nLoại bình gas: Tùy chọn Saigon Petro / Gia Đình / Pacific',
            featured: true,
            onSale: true,
            createdAt: '2026-07-29T00:04:00'
        },
        {
            id: 105,
            name: 'Combo Bếp Gas Âm + Bộ Dao Thớt Cao Cấp',
            categoryId: 9,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkxeq4ZkPtSTy1DiPFelccBrQnRu2l0_jYIi1jh9AlBA&s=10',
            price: 890000,
            discount: 25,
            description: 'Ứng dụng công nghệ đầu đốt hồng ngoại bằng gốm Ceramic, đốt cháy 100% lượng gas tiêu thụ, không đen đáy nồi, không sợ gió thổi tắt lửa. Tặng kèm bộ 3 nồi Inox cao cấp.',
            specs: 'Trọn bộ gồm: 01 Bếp gas hồng ngoại đôi + 01 Bộ 3 nồi Inox 430\nĐầu đốt: Gốm Ceramic hồng ngoại tiết kiệm 30% gas\nMặt kính: Cường lực chịu nhiệt 700 độ C',
            featured: true,
            onSale: true,
            createdAt: '2026-07-29T00:05:00'
        },
        {
            id: 106,
            name: 'Combo Đổi Bình Gas 12kg + Thay Dây Van Mới',
            categoryId: 9,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoc3XBxNLZJVEWBA63ivUypqw-JxVHZLMKIyuksaXKfg&s',
            price: 1050000,
            discount: 22,
            description: 'Giải pháp xào nấu lửa lớn dành cho quán ăn, nhà hàng Á. Bếp khè công nghiệp cán trung/cán dài cho ngọn lửa xanh cực mạnh, đi kèm van gas cao áp và dây dẫn chịu lực chống cháy nổ.',
            specs: 'Trọn bộ gồm: 01 Bếp khè công nghiệp + 01 Van gas cao áp + 01 Dây gas công nghiệp\nHệ thống đánh lửa: Magneto đập cực nhạy\nCụm đầu đốt: Gang đúc nguyên khối chịu nhiệt cao\nNhiên liệu: Gas LPG áp cao',
            featured: true,
            onSale: true,
            createdAt: '2026-07-29T00:06:00'
        },
        {
            id: 107,
            name: 'Combo Bếp Hồng Ngoại + Nồi Lẩu Mini',
            categoryId: 9,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTstmIhceJ2flda51V8rVEiJp9t37h4Qc9Y9QeRlITOFQ&s',
            price: 650000,
            discount: 23,
            description: 'Giải pháp thay thế an toàn cho bếp gas sinh viên. Bếp từ đơn công suất lớn đun sôi nước chỉ trong 3 phút, mặt kính pha lê dễ lau chùi. Tặng kèm chảo chống dính đáy từ tiện dụng.',
            specs: 'Trọn bộ gồm: 01 Bếp điện từ đơn + 01 Chảo chống dính 24cm\nCông suất: 2000W\nBảng điều khiển: Cảm ứng chạm (Touch Control) với 8 chế độ nấu\nTính năng: Hẹn giờ, khóa trẻ em, tự ngắt khi quá nhiệt',
            featured: true,
            onSale: true,
            createdAt: '2026-07-29T00:07:00'
        },
        {
            id: 108,
            name: 'Combo Bếp Từ Đôi + Tặng Bộ Nồi Inox 5 Món',
            categoryId: 9,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROwTl-FcMBOKZNOTiQNVJTBLqfxAiKcHffqAKyHgM4Zw&s=10',
            price: 5490000,
            discount: 20,
            description: 'Bếp từ đôi cao cấp công nghệ Inverter tiết kiệm 35% điện năng. Thiết kế bo viền nhôm chống va đập góc kính. Tặng trọn bộ nồi Inox 3 đáy đun từ 5 món cao cấp đáp ứng mọi nhu cầu nấu nướng.',
            specs: 'Trọn bộ gồm: 01 Bếp từ đôi + 01 Bộ nồi Inox 304 (5 món)\nCông suất: 4200W (Dual Booster)\nMặt kính: Schott Ceran (Đức) bo viền kim loại\nCông nghệ: Inverter thông minh duy trì nhiệt liu riu',
            featured: true,
            onSale: true,
            createdAt: '2026-07-29T00:08:00'
        },
        {
            id: 109,
            name: 'Combo Bếp Khè Công Nghiệp + Van Cao Áp',
            categoryId: 9,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhKuGhKtxMfgacnPk3zIkjIQ0XWS8T_5zMP1qW8cRTew&s',
            price: 3990000,
            discount: 23,
            description: 'Bộ đôi không thể thiếu cho không gian bếp hiện đại. Bếp gas âm 2 lò nấu mặt kính sang trọng kết hợp máy hút mùi kính cong công suất hút lớn, đánh bay mọi mùi dầu mỡ.',
            specs: 'Trọn bộ gồm: 01 Bếp gas âm (Pép đồng thau) + 01 Máy hút mùi kính cong 70cm\nCông suất hút mùi: 1000 m3/h\nKích thước khoét đá bếp âm: 680 x 380 mm\nĐộng cơ hút mùi: Tuabin đôi lõi đồng 100%',
            featured: true,
            onSale: true,
            createdAt: '2026-07-29T00:09:00'
        }
    ];

    const defaultSettings = {
        hotline: '1900.123.123',
        zalo: '0901.111.222',
        address: '123 Thủ Đức, Hồ Chí Minh',
        logo: 'assets/logo/logo_primary_gas - Copy.png'
    };

    // ========== HELPERS ==========
    function _getSettings() {
        try {
            return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || defaultSettings;
        } catch { return defaultSettings; }
    }

    function _saveSettings(settings) {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    }

    function _getProducts() {
        try {
            const items = JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || [];
            return items.map(p => {
                if (p.slug && p.slug.startsWith('cat-')) p.slug = p.slug.replace(/^cat-/, '');
                if (!p.slug) p.slug = _generateSlug(p.name);
                return p;
            });
        } catch { return []; }
    }

    function _saveProducts(products) {
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    }

    function _getCategories() {
        try {
            const items = JSON.parse(localStorage.getItem(CATEGORIES_KEY)) || [];
            return items.map(c => {
                if (c.slug && c.slug.startsWith('cat-')) c.slug = c.slug.replace(/^cat-/, '');
                if (!c.slug) c.slug = _generateSlug(c.name);
                return c;
            });
        } catch { return []; }
    }

    function _saveCategories(categories) {
        localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    }

    function _getNewsCategories() {
        try {
            const items = JSON.parse(localStorage.getItem(NEWS_CATEGORIES_KEY)) || [];
            return items.map(c => {
                if (c.slug && c.slug.startsWith('cat-')) c.slug = c.slug.replace(/^cat-/, '');
                if (!c.slug) c.slug = _generateSlug(c.name);
                return c;
            });
        } catch { return []; }
    }

    function _saveNewsCategories(categories) {
        localStorage.setItem(NEWS_CATEGORIES_KEY, JSON.stringify(categories));
    }

    function _getNews() {
        try {
            const items = JSON.parse(localStorage.getItem(NEWS_KEY)) || [];
            return items.map(n => {
                if (n.slug && n.slug.startsWith('cat-')) n.slug = n.slug.replace(/^cat-/, '');
                if (!n.slug) n.slug = _generateSlug(n.title);
                return n;
            });
        } catch { return []; }
    }

    function _saveNews(newsList) {
        localStorage.setItem(NEWS_KEY, JSON.stringify(newsList));
    }

    function _nextNewsId() {
        const news = _getNews();
        if (news.length === 0) return 1;
        return Math.max(...news.map(n => n.id)) + 1;
    }

    function _generateSlug(name) {
        return String(name || '')
            .toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd').replace(/Đ/g, 'D')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }

    function _nextProductId() {
        const products = _getProducts();
        if (products.length === 0) return 1;
        return Math.max(...products.map(p => p.id)) + 1;
    }

    function _nextCategoryId() {
        const cats = _getCategories();
        if (cats.length === 0) return 1;
        return Math.max(...cats.map(c => c.id)) + 1;
    }

    function _nextNewsCategoryId() {
        const cats = _getNewsCategories();
        if (cats.length === 0) return 1;
        return Math.max(...cats.map(c => c.id)) + 1;
    }

    function _formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'đ';
    }

    function _shuffleArray(arr) {
        const shuffled = [...arr];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // ========== PUBLIC API ==========
    return {
        /**
         * Initialize database asynchronously with API
         */
        async initAsync() {
            try {
                // Try to load from API
                const response = await fetch('api.php');
                if (response.ok) {
                    const data = await response.json();
                    if (data && data.products) {
                        _saveProducts(data.products);
                        _saveCategories(data.categories || []);
                        if (data.settings) _saveSettings(data.settings);
                        if (data.news) _saveNews(data.news);
                        if (data.newsCategories) _saveNewsCategories(data.newsCategories);
                        console.log('[ProductDB] Loaded from API.');
                        document.dispatchEvent(new Event('ProductDBReady'));
                        return;
                    }
                }
            } catch (e) {
                console.log('[ProductDB] API fetch failed, using local/seed data.', e);
            }

            // Fallback: Use LocalStorage or Seed data if API fails
            if (!localStorage.getItem(INIT_KEY)) {
                _saveCategories(seedCategories);
                _saveProducts(seedProducts);
                _saveSettings(defaultSettings);
                _saveNews(seedNews);
                _saveNewsCategories(seedNewsCategories);
                localStorage.setItem(INIT_KEY, 'true');
                console.log('[ProductDB] Initialized with seed data.');
                // Push initial seed data to API so it creates the data.json
                this.syncToApi();
            } else {
                let nc = _getNewsCategories();
                if (nc.length === 0) {
                    _saveNewsCategories(seedNewsCategories);
                } else {
                    let updated = false;
                    nc = nc.map(c => {
                        if (!c.seoDesc) {
                            const seed = seedNewsCategories.find(s => s.id === c.id);
                            if (seed) {
                                c.seoDesc = seed.seoDesc;
                                updated = true;
                            }
                        }
                        return c;
                    });
                    if (updated) {
                        _saveNewsCategories(nc);
                        this.syncToApi();
                    }
                }
                if (_getNews().length === 0) {
                    _saveNews(seedNews);
                }

                // MIGRATION: Ensure seed flash deals are set for existing DB
                let prods = _getProducts();
                let pUpdated = false;
                if (!prods.some(p => p.isFlashDeal)) {
                    prods = prods.map(p => {
                        const seed = seedProducts.find(s => s.id === p.id);
                        if (seed && seed.isFlashDeal) {
                            p.isFlashDeal = true;
                            p.flashDealDesc = seed.flashDealDesc;
                            pUpdated = true;
                        }
                        return p;
                    });
                    if (pUpdated) {
                        _saveProducts(prods);
                        this.syncToApi();
                    }
                }
            }
            document.dispatchEvent(new Event('ProductDBReady'));
        },

        /**
         * Sync local data to API
         */
        async syncToApi() {
            try {
                await fetch('api.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        products: _getProducts(),
                        categories: _getCategories(),
                        settings: _getSettings(),
                        news: _getNews(),
                        newsCategories: _getNewsCategories()
                    })
                });
                console.log('[ProductDB] Synced to API.');
            } catch (e) {
                console.error('[ProductDB] Failed to sync to API', e);
            }
        },

        /**
         * Force re-seed (useful for reset)
         */
        reset() {
            localStorage.removeItem(INIT_KEY);
            localStorage.removeItem(PRODUCTS_KEY);
            localStorage.removeItem(CATEGORIES_KEY);
            localStorage.removeItem(SETTINGS_KEY);
            localStorage.removeItem(NEWS_KEY);
            localStorage.removeItem(NEWS_CATEGORIES_KEY);
            this.initAsync();
        },

        // ===== PRODUCT CRUD =====
        getAll(isAdmin = false) {
            const products = _getProducts();
            if (isAdmin) return products;
            return products.filter(p => p.active !== false);
        },

        getById(id) {
            return _getProducts().find(p => p.id === parseInt(id));
        },

        getBySlug(slug) {
            return _getProducts().find(p => 
                (p.slug === slug) || 
                (_generateSlug(p.name) === slug) || 
                (p.id.toString() === slug)
            );
        },

        getByCategory(categoryId, isAdmin = false) {
            const products = _getProducts().filter(p => p.categoryId === parseInt(categoryId));
            if (isAdmin) return products;
            return products.filter(p => p.active !== false);
        },

        add(product) {
            const products = _getProducts();
            const newProduct = {
                ...product,
                id: _nextProductId(),
                price: parseInt(product.price) || 0,
                discount: parseInt(product.discount) || 0,
                categoryId: parseInt(product.categoryId),
                featured: !!product.featured,
                onSale: !!product.onSale,
                isSaleOff50: !!product.isSaleOff50,
                active: product.active !== false,
                seoTitle: product.seoTitle || '',
                seoDesc: product.seoDesc || '',
                slug: product.slug || '',
                createdAt: new Date().toISOString()
            };
            products.push(newProduct);
            _saveProducts(products);
            this.syncToApi();
            return newProduct;
        },

        update(id, data) {
            const products = _getProducts();
            const index = products.findIndex(p => p.id === parseInt(id));
            if (index === -1) return null;
            products[index] = {
                ...products[index],
                ...data,
                id: parseInt(id),
                price: parseInt(data.price) || products[index].price,
                discount: parseInt(data.discount) || 0,
                categoryId: parseInt(data.categoryId) || products[index].categoryId,
                featured: !!data.featured,
                onSale: !!data.onSale,
                isSaleOff50: data.isSaleOff50 !== undefined ? !!data.isSaleOff50 : !!products[index].isSaleOff50,
                isFlashDeal: data.isFlashDeal !== undefined ? !!data.isFlashDeal : !!products[index].isFlashDeal,
                flashDealDesc: data.flashDealDesc !== undefined ? data.flashDealDesc : (products[index].flashDealDesc || ''),
                flashDealPrice: data.flashDealPrice !== undefined ? parseInt(data.flashDealPrice) : (products[index].flashDealPrice || 0),
                active: data.active !== false,
                seoTitle: data.seoTitle !== undefined ? data.seoTitle : (products[index].seoTitle || ''),
                seoDesc: data.seoDesc !== undefined ? data.seoDesc : (products[index].seoDesc || ''),
                slug: data.slug !== undefined ? data.slug : (products[index].slug || '')
            };
            _saveProducts(products);
            this.syncToApi();
            return products[index];
        },

        delete(id) {
            const products = _getProducts();
            const filtered = products.filter(p => p.id !== parseInt(id));
            if (filtered.length === products.length) return false;
            _saveProducts(filtered);
            this.syncToApi();
            return true;
        },

        // ===== CATEGORY CRUD =====
        getCategories() {
            return _getCategories();
        },

        getCategoryById(id) {
            return _getCategories().find(c => c.id === parseInt(id));
        },

        getCategoryBySlug(slug) {
            return _getCategories().find(c => c.slug === slug);
        },

        addCategory(category) {
            const cats = _getCategories();
            const newCat = {
                id: _nextCategoryId(),
                name: category.name,
                slug: category.slug || _generateSlug(category.name),
                seoDesc: category.seoDesc || ''
            };
            cats.push(newCat);
            _saveCategories(cats);
            this.syncToApi();
            return newCat;
        },

        updateCategory(id, data) {
            const cats = _getCategories();
            const index = cats.findIndex(c => c.id === parseInt(id));
            if (index === -1) return null;
            cats[index] = {
                ...cats[index],
                name: data.name || cats[index].name,
                slug: data.slug || _generateSlug(data.name || cats[index].name),
                seoDesc: data.seoDesc !== undefined ? data.seoDesc : (cats[index].seoDesc || '')
            };
            _saveCategories(cats);
            this.syncToApi();
            return cats[index];
        },

        deleteCategory(id) {
            const products = _getProducts();
            const hasProducts = products.some(p => p.categoryId === parseInt(id));
            if (hasProducts) return { success: false, message: 'Không thể xóa danh mục có sản phẩm!' };
            const cats = _getCategories();
            const filtered = cats.filter(c => c.id !== parseInt(id));
            if (filtered.length === cats.length) return { success: false, message: 'Danh mục không tồn tại!' };
            _saveCategories(filtered);
            this.syncToApi();
            return { success: true };
        },

        toggleFlashDeal(id, isFlashDeal) {
            const products = _getProducts();
            const index = products.findIndex(p => p.id === parseInt(id));
            if (index !== -1) {
                products[index].isFlashDeal = isFlashDeal;
                if (isFlashDeal && !products[index].flashDealDesc) {
                    products[index].flashDealDesc = 'Giá sốc không thể bỏ lỡ!';
                }
                if (isFlashDeal && !products[index].flashDealPrice) {
                    products[index].flashDealPrice = Math.round(products[index].price * 0.9); // Default 10% off
                }
                _saveProducts(products);
                this.syncToApi();
                return true;
            }
            return false;
        },

        getFlashDealProducts() {
            return _getProducts().filter(p => p.isFlashDeal && p.active !== false);
        },

        updateFlashDealData(id, desc, price) {
            const products = _getProducts();
            const index = products.findIndex(p => p.id === parseInt(id));
            if (index !== -1) {
                if (desc !== undefined) products[index].flashDealDesc = desc;
                if (price !== undefined) products[index].flashDealPrice = parseInt(price) || 0;
                _saveProducts(products);
                this.syncToApi();
                return true;
            }
            return false;
        },

        getProductCountByCategory(categoryId) {
            return _getProducts().filter(p => p.categoryId === parseInt(categoryId)).length;
        },

        // ===== QUERY HELPERS =====
        getFeatured() {
            return _getProducts().filter(p => p.featured && p.active !== false);
        },

        getOnSale() {
            return _getProducts().filter(p => p.onSale && p.discount > 0 && p.active !== false);
        },

        getRelated(productId, limit = 4) {
            const product = this.getById(productId);
            if (!product) return [];
            const sameCategory = _getProducts().filter(
                p => p.categoryId === product.categoryId && p.id !== parseInt(productId) && p.active !== false
            );
            return _shuffleArray(sameCategory).slice(0, limit);
        },

        getRandom(limit = 20) {
            return _shuffleArray(_getProducts().filter(p => p.active !== false)).slice(0, limit);
        },

        paginate(page = 1, perPage = 20, categoryId = null, isAdmin = false) {
            let products = categoryId
                ? this.getByCategory(categoryId, isAdmin)
                : this.getAll(isAdmin);

            const totalItems = products.length;
            const totalPages = Math.ceil(totalItems / perPage);
            const start = (page - 1) * perPage;
            const items = products.slice(start, start + perPage);

            return {
                items,
                page: parseInt(page),
                perPage,
                totalItems,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1
            };
        },

        search(keyword, isAdmin = false) {
            const kw = keyword.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            let products = _getProducts();
            if (!isAdmin) {
                products = products.filter(p => p.active !== false);
            }
            return products.filter(p => {
                const name = p.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                return name.includes(kw);
            });
        },

        // ===== UTILITIES =====
        formatPrice: _formatPrice,

        getDiscountedPrice(product) {
            if (product.isFlashDeal && product.flashDealPrice) return parseInt(product.flashDealPrice);
            if (product.isSaleOff50) return Math.round(product.price * 0.5);
            if (!product.discount || product.discount <= 0) return product.price;
            return Math.round(product.price * (1 - product.discount / 100));
        },

        getCategoryName(categoryId) {
            const cat = this.getCategoryById(categoryId);
            return cat ? cat.name : 'Không phân loại';
        },

        // Stats for admin dashboard
        getStats() {
            const products = _getProducts();
            const categories = _getCategories();
            return {
                totalProducts: products.length,
                totalCategories: categories.length,
                featuredCount: products.filter(p => p.featured).length,
                onSaleCount: products.filter(p => p.onSale && p.discount > 0).length
            };
        },

        // ===== SETTINGS CRUD =====
        getSettings() {
            return _getSettings();
        },

        updateSettings(newSettings) {
            _saveSettings(newSettings);
            this.syncToApi();
            return newSettings;
        },

        // ===== NEWS CRUD =====
        getNews(isAdmin = false) {
            const news = _getNews();
            if (isAdmin) return news;
            return news.filter(n => n.active !== false);
        },

        getNewsById(id) {
            return _getNews().find(n => n.id === parseInt(id)) || null;
        },

        addNews(data) {
            const news = _getNews();
            const id = _nextNewsId();
            const newEntry = {
                id,
                ...data,
                slug: data.slug || _generateSlug(data.title),
                createdAt: new Date().toISOString()
            };
            news.push(newEntry);
            _saveNews(news);
            this.syncToApi();
            return newEntry;
        },

        updateNews(id, data) {
            const news = _getNews();
            const index = news.findIndex(n => n.id === parseInt(id));
            if (index !== -1) {
                if (data.title && !data.slug) {
                    data.slug = _generateSlug(data.title);
                }
                news[index] = { ...news[index], ...data };
                _saveNews(news);
                this.syncToApi();
                return news[index];
            }
            return null;
        },

        deleteNews(id) {
            const news = _getNews();
            const filtered = news.filter(n => n.id !== parseInt(id));
            _saveNews(filtered);
            this.syncToApi();
            return { success: true };
        },

        // ===== NEWS CATEGORIES CRUD =====
        getNewsCategories() {
            return _getNewsCategories();
        },

        getNewsCategoryById(id) {
            return _getNewsCategories().find(c => c.id === parseInt(id)) || null;
        },

        addNewsCategory(data) {
            const categories = _getNewsCategories();
            const id = _nextNewsCategoryId();
            const slug = data.slug || _generateSlug(data.name);
            if (categories.some(c => c.slug === slug)) {
                return { success: false, message: 'Danh mục tin tức đã tồn tại!' };
            }
            const newCat = { id, name: data.name, slug, seoDesc: data.seoDesc || '' };
            categories.push(newCat);
            _saveNewsCategories(categories);
            this.syncToApi();
            return { success: true, category: newCat };
        },

        updateNewsCategory(id, data) {
            const categories = _getNewsCategories();
            const index = categories.findIndex(c => c.id === parseInt(id));
            if (index !== -1) {
                const slug = data.slug || _generateSlug(data.name);
                if (categories.some(c => c.slug === slug && c.id !== parseInt(id))) {
                    return { success: false, message: 'Đường dẫn tĩnh đã bị trùng với danh mục khác!' };
                }
                categories[index] = { ...categories[index], name: data.name, slug, seoDesc: data.seoDesc !== undefined ? data.seoDesc : (categories[index].seoDesc || '') };
                _saveNewsCategories(categories);
                this.syncToApi();
                return { success: true, category: categories[index] };
            }
            return { success: false, message: 'Không tìm thấy danh mục!' };
        },

        deleteNewsCategory(id) {
            const categories = _getNewsCategories();
            const news = _getNews();

            if (news.some(n => n.categoryId === parseInt(id))) {
                return { success: false, message: 'Không thể xóa danh mục đang chứa tin tức!' };
            }

            const filtered = categories.filter(c => c.id !== parseInt(id));
            _saveNewsCategories(filtered);
            this.syncToApi();
            return { success: true };
        }
    };
})();

// Removed auto-init, will be initialized by main.js and admin.js
// ProductDB.init();
