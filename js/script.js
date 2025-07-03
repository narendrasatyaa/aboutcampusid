const products = [{
        id: 1,
        name: "Partnership Gratis",
        category: "partnership",
        description: "Program kolaborasi tanpa biaya untuk mempublikasikan event atau kegiatan kampus melalui platform About Campus ID.",
        price: "Gratis",
        image: "images/partner.png",
        waMessage: "Halo kak, saya tertarik dengan Partnership Gratis. Bisa dijelaskan lebih lanjut?"
    },
    {
        id: 2,
        name: "Partnership Berbayar",
        category: "partnership",
        description: "Layanan kolaborasi berbayar yang memberikan exposure maksimal untuk event kampus, komunitas, atau bisnis mahasiswa.",
        price: "Mulai dari Rp 10.000",
        image: "images/partner.png",
        waMessage: "Halo kak, saya ingin booking layanan Partnership Berbayar. Apa saja benefit-nya?"
    }
];

const advantages = [{
        svg: `
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 7v5l3 3" stroke="#00b894" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="12" cy="12" r="10" stroke="#00b894" stroke-width="2"/>
            </svg>
        `,
        title: "Tepat Waktu & Fleksibel",
        description: "Layanan kami disesuaikan dengan jadwal dan kebutuhanmu, tanpa ribet."
    },
    {
        svg: `
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="#00b894" stroke-width="2"/>
                <circle cx="12" cy="12" r="3" fill="#00b894"/>
                <path d="M12 2v2M12 20v2M2 12h2M20 12h2" stroke="#00b894" stroke-width="2"/>
            </svg>
        `,
        title: "Efektif & Tepat Sasaran",
        description: "Konten dan layanan dirancang agar langsung menyasar kebutuhan mahasiswa."
    },
    {
        svg: `
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12a9 9 0 0 0 18 0" stroke="#00b894" stroke-width="2"/>
                <path d="M21 12A9 9 0 0 0 3 12" stroke="#00b894" stroke-width="2"/>
                <circle cx="12" cy="12" r="3" fill="#00b894"/>
            </svg>
        `,
        title: "Jangkauan Luas",
        description: "Dapat diakses dari mana saja dan menjangkau seluruh kampus di Indonesia."
    }
];



// Nomor WhatsApp AboutCampus
const whatsappNumber = "6285226446178";

// Fungsi untuk memuat produk
function loadProducts(filter = "all") {
    const productsContainer = document.querySelector('.products-container');
    productsContainer.innerHTML = '';

    const filteredProducts = filter === "all" ?
        products :
        products.filter(product => product.category === filter);

    if (filteredProducts.length === 0) {
        productsContainer.innerHTML = '<p class="no-products">Tidak ada produk dalam kategori ini</p>';
        return;
    }

    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <span class="price">${product.price}</span>
                <a href="https://wa.me/${whatsappNumber}?text=${encodeURIComponent(product.waMessage)}" 
                   class="wa-button" 
                   data-product="${product.name}"
                   onclick="trackWAEvent(this)">
                    <i class="fab fa-whatsapp"></i> Pesan Sekarang
                </a>
            </div>
        `;
        productsContainer.appendChild(productCard);
    });
}

// Fungsi untuk tracking klik WA
function trackWAEvent(element) {
    const productName = element.getAttribute('data-product');

    // Google Analytics tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', 'whatsapp_click', {
            'event_category': 'Conversion',
            'event_label': productName
        });
    }

    // Facebook Pixel tracking (jika ada)
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Contact', {
            content_name: productName
        });
    }
}

// Filter produk
document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        const filter = button.getAttribute('data-filter');
        loadProducts(filter);
    });
});

// Testimonial data
const testimonials = [{
        name: "Ilyas",
        role: "Panitia Event Seminar Nasional UMS",
        text: "Assalamualaikum dan selamat siang kak, maaf menganggu waktunya kak, aku llyas dari panitia event seminar nasional UMS, mau ngucapin maturnuwun ya mas udh mau bantu publikasi, semoga aboutcampus_id makin maju dan semakin bermanfaat bagi banyak-orang.",
        avatar: "images/avatar-cowo.png"
    },
    {
        name: "Devia",
        role: "Panitia Event Seminar Nasional 2022",
        text: "Selamat siang kak, maaf menganggu waktunya kak, aku Devia dari panitia event seminar nasional tahun 2022, makasih bangett ya kak udah mau bantu publikasi, karena bantuan kaka program. seminar di kampusku jadi dapet peserta banyakk banget kak, bahkan sampe overload, sekali lagi makasihh ya kak atas bantuan dari aboutcampus_id.",
        avatar: "images/avatar-cewe.png"
    },
    {
        name: "Siti Aminah",
        role: "Panitia Event Bisnis Plan 2021",
        text: "Selamat siang как, perenaikan aku Arina sebagai salah satu panitia event bisnis plan tingkat nasional tahun 2021, aku mau ucapin terimakasih yaa kak udah mau bantu publikasi event kami kak, berkat bantuan publikasi dari pihak aboutcampus id peserta lomba bisnis plan kami mengingkat 60% kak.",
        avatar: "images/avatar-cewe.png"
    }
];

// Load testimonials
function loadTestimonials() {
    const testimonialGrid = document.querySelector('.testimonial-grid');

    testimonials.forEach(testimonial => {
        const testimonialCard = document.createElement('div');
        testimonialCard.className = 'testimonial-card';
        testimonialCard.innerHTML = `
            <div class="testimonial-content">
                <p>"${testimonial.text}"</p>
            </div>
            <div class="testimonial-author">
                <img src="${testimonial.avatar}" alt="${testimonial.name}">
                <div>
                    <h4>${testimonial.name}</h4>
                    <span>${testimonial.role}</span>
                </div>
            </div>
        `;
        testimonialGrid.appendChild(testimonialCard);
    });
}

function loadAdvantages() {
    const advantageContainer = document.querySelector('#keunggulan .advantage-grid');
    advantages.forEach(item => {
        const card = document.createElement('div');
        card.className = 'advantage-card';
        card.innerHTML = `
            <div class="advantage-icon">${item.svg}</div>
            <h4>${item.title}</h4>
            <p>${item.description}</p>
        `;
        advantageContainer.appendChild(card);
    });
}



// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    loadAdvantages();
    loadTestimonials();

});


// Mobile Menu Toggle
const menuToggle = document.createElement('div');
menuToggle.className = 'menu-toggle';
menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
document.querySelector('header .container').appendChild(menuToggle);

const nav = document.querySelector('nav');
menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
    menuToggle.innerHTML = nav.classList.contains('active') ?
        '<i class="fas fa-times"></i>' :
        '<i class="fas fa-bars"></i>';
});

// Close menu when clicking on nav link
document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        document.querySelector('header').classList.add('scrolled');
    } else {
        document.querySelector('header').classList.remove('scrolled');
    }
});