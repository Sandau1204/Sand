const book = document.getElementById('book');
const scrollContainer = document.getElementById('mainContainer');
const navBtns = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.content-section');

// --- HÀM 1: CHUYỂN TRANG BẰNG NÚT BẤM (GIỮ NGUYÊN) ---
function scrollToPage(sectionId) {
    const targetSection = document.getElementById(sectionId);
    if (!targetSection) return;

    // Kích hoạt hiệu ứng "Lật đi"
    scrollContainer.classList.add('flipping');

    setTimeout(() => {
        // Nhảy đến section đích
        targetSection.scrollIntoView({ behavior: 'auto', block: 'start' });

        // Cập nhật Sidebar thủ công
        if (sectionId === 'home') {
            book.classList.remove('scrolled');
        } else {
            book.classList.add('scrolled');
        }
        
        // Cập nhật Highlight nút
        updateActiveNav(sectionId);

        // Kích hoạt hiệu ứng "Lật về"
        scrollContainer.classList.remove('flipping');
        scrollContainer.classList.add('flip-finish');

        setTimeout(() => {
            scrollContainer.classList.remove('flip-finish');
        }, 500);

    }, 500); 
}

// Hàm cập nhật highlight menu
function updateActiveNav(currentId) {
    navBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.innerText.toLowerCase().includes(currentId)) {
            btn.classList.add('active');
        }
    });
}

// --- HÀM 2: LẮNG NGHE SỰ KIỆN CUỘN CHUỘT (GIỮ NGUYÊN) ---
scrollContainer.addEventListener('scroll', () => {
    if (scrollContainer.classList.contains('flipping') || scrollContainer.classList.contains('flip-finish')) {
        return;
    }

    const scrollTop = scrollContainer.scrollTop;
    
    // Logic Sidebar Docking
    if (scrollTop > 50) {
        book.classList.add('scrolled');
    } else {
        book.classList.remove('scrolled');
    }

    // Logic Active Menu
    let currentId = 'home';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollTop >= sectionTop - 250) {
            currentId = section.getAttribute('id');
        }
    });
    updateActiveNav(currentId);
});


// --- HIỆU ỨNG PLEXUS (MẠNG LƯỚI KẾT NỐI) ---
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let width, height;

// Cấu hình Plexus
const config = {
    particleCount: 100,      // Số lượng hạt (giảm nếu lag)
    connectionDistance: 150, // Khoảng cách tối đa để nối dây
    mouseDistance: 200,      // Khoảng cách tương tác chuột
    speed: 0.5,              // Tốc độ bay của hạt
    color: '0, 243, 255'     // Màu Cyan (R, G, B)
};

let particles = [];

// Class Hạt (Particle)
class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * config.speed; // Vận tốc X
        this.vy = (Math.random() - 0.5) * config.speed; // Vận tốc Y
        this.size = Math.random() * 2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Chạm cạnh màn hình thì bật lại
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${config.color}, 0.8)`; // Màu hạt
        ctx.fill();
    }
}

function initPlexus() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    
    // Tạo lại mảng hạt
    particles = [];
    // Tự động điều chỉnh số lượng hạt theo kích thước màn hình
    const count = width < 768 ? 50 : config.particleCount;
    
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}

function animatePlexus() {
    ctx.clearRect(0, 0, width, height);
    
    // Vẽ nền tối mờ (để tạo chiều sâu nếu muốn, ở đây ta xóa sạch để trong suốt)
    // ctx.fillStyle = 'rgba(11, 13, 23, 1)';
    // ctx.fillRect(0,0,width,height);

    // Vòng lặp cập nhật và vẽ
    for (let i = 0; i < particles.length; i++) {
        let p1 = particles[i];
        p1.update();
        p1.draw();

        // Kiểm tra kết nối với các hạt khác
        for (let j = i; j < particles.length; j++) {
            let p2 = particles[j];
            
            // Tính khoảng cách (Pythagoras)
            let dx = p1.x - p2.x;
            let dy = p1.y - p2.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            // Nếu đủ gần thì vẽ đường nối
            if (distance < config.connectionDistance) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(${config.color}, ${1 - distance/config.connectionDistance})`; // Độ mờ theo khoảng cách
                ctx.lineWidth = 0.5;
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animatePlexus);
}

// Khởi chạy
window.addEventListener('resize', initPlexus);
initPlexus();
animatePlexus();