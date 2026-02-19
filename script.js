const book = document.getElementById('book');
const scrollContainer = document.getElementById('mainContainer');
const navBtns = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.content-section');

// --- HÀM 1: CHUYỂN TRANG BẰNG NÚT BẤM (DÀNH CHO PC) ---
function scrollToPage(sectionId) {
    const targetSection = document.getElementById(sectionId);
    if (!targetSection) return;

    // Kích hoạt hiệu ứng "Lật đi"
    scrollContainer.classList.add('flipping');

    setTimeout(() => {
        targetSection.scrollIntoView({ behavior: 'auto', block: 'start' });

        // Cập nhật Sidebar thủ công
        if (sectionId === 'home') {
            book.classList.remove('scrolled');
        } else {
            book.classList.add('scrolled');
        }
        
        updateActiveNav(sectionId);

        scrollContainer.classList.remove('flipping');
        scrollContainer.classList.add('flip-finish');

        setTimeout(() => {
            scrollContainer.classList.remove('flip-finish');
        }, 500);

    }, 500); 
}

function updateActiveNav(currentId) {
    navBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.innerText.toLowerCase().includes(currentId)) {
            btn.classList.add('active');
        }
    });
}

// --- HÀM 2: LẮNG NGHE SỰ KIỆN CUỘN CHUỘT ---
scrollContainer.addEventListener('scroll', () => {
    
    // A. LOGIC CHO DESKTOP (SIDEBAR DOCKING)
    if (window.innerWidth > 768) {
        if (scrollContainer.classList.contains('flipping') || scrollContainer.classList.contains('flip-finish')) {
            return;
        }

        const scrollTop = scrollContainer.scrollTop;
        if (scrollTop > 50) {
            book.classList.add('scrolled');
        } else {
            book.classList.remove('scrolled');
        }

        let currentId = 'home';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollTop >= sectionTop - 250) {
                currentId = section.getAttribute('id');
            }
        });
        updateActiveNav(currentId);
    } 
    
    // B. LOGIC CHO MOBILE (HEADER MORPHING)
    else {
        const scrollTop = scrollContainer.scrollTop;
        const mHeader = document.querySelector('.mobile-header');
        const mHomeText = document.querySelector('.home-text');
        
        // 1. Hiệu ứng chữ Home bay lên và mờ dần
        const fadePoint = 300; // Khoảng cách pixel để hoàn tất hiệu ứng mờ
        let opacity = 1 - (scrollTop / fadePoint);
        let translateY = scrollTop * 0.5; // Tốc độ bay

        if (opacity < 0) opacity = 0;
        
        if (mHomeText) {
            mHomeText.style.opacity = opacity;
            // Dịch chuyển lên trên và thu nhỏ nhẹ
            mHomeText.style.transform = `translateY(-${translateY}px) scale(${0.9 + (opacity * 0.1)})`;
        }

        // 2. Hiệu ứng hiện Header
        if (scrollTop > 200) { 
            mHeader.classList.add('active');
        } else {
            mHeader.classList.remove('active');
        }
    }
});


// --- HIỆU ỨNG PLEXUS (MẠNG LƯỚI KẾT NỐI) ---
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let width, height;

const config = {
    particleCount: 100,
    connectionDistance: 150,
    mouseDistance: 200,
    speed: 0.5,
    color: '0, 243, 255'
};

let particles = [];

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * config.speed;
        this.vy = (Math.random() - 0.5) * config.speed;
        this.size = Math.random() * 2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${config.color}, 0.8)`;
        ctx.fill();
    }
}

function initPlexus() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    
    particles = [];
    const count = width < 768 ? 50 : config.particleCount;
    
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}

function animatePlexus() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
        let p1 = particles[i];
        p1.update();
        p1.draw();

        for (let j = i; j < particles.length; j++) {
            let p2 = particles[j];
            let dx = p1.x - p2.x;
            let dy = p1.y - p2.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < config.connectionDistance) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(${config.color}, ${1 - distance/config.connectionDistance})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animatePlexus);
}

window.addEventListener('resize', initPlexus);
initPlexus();
animatePlexus();