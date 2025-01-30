document.addEventListener('DOMContentLoaded', function() {
    const gallery = document.getElementById('gallery');
    const effectsContainer = document.querySelector('.effects-container');
    const images = [
        'photos/1.jpeg', 'photos/2.jpg', 'photos/3.JPEG', 'photos/4.JPEG', 'photos/5.jpg',
        'photos/6.jpg', 'photos/7.jpg', 'photos/8.jpg', 'photos/9.jpg', 'photos/10.jpg',
        'photos/11.jpg', 'photos/12.JPG', 'photos/13.JPG', 'photos/14.JPG'
    ];

    // 创建烟花
    function createFirework(x, y) {
        const colors = ['#ff6b6b', '#ffd93d', '#6c5ce7', '#a8e6cf', '#fdcb6e'];
        const firework = document.createElement('div');
        firework.className = 'firework';
        firework.style.left = x + 'px';
        firework.style.top = y + 'px';
        firework.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        effectsContainer.appendChild(firework);

        // 创建粒子
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'firework-particle';
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            const angle = (Math.PI * 2 * i) / 30;
            const velocity = 50 + Math.random() * 50;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;
            
            particle.style.setProperty('--tx', tx + 'px');
            particle.style.setProperty('--ty', ty + 'px');
            
            firework.appendChild(particle);
        }

        firework.addEventListener('animationend', () => {
            firework.remove();
        });
    }

    // 随机创建烟花
    function randomFirework() {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * (window.innerHeight * 0.7);
        createFirework(x, y);
        
        // 随机间隔后再次创建
        setTimeout(randomFirework, 1000 + Math.random() * 2000);
    }

    // 创建浮动爱心
    function createFloatingHeart() {
        const container = document.querySelector('.floating-hearts');
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.innerHTML = '';
        
        // 随机位置、大小和轨迹
        const startX = Math.random() * window.innerWidth;
        const size = Math.random() * 20 + 10;
        const tx = (Math.random() - 0.5) * 200;
        const ty = -Math.random() * 300 - 100;
        
        heart.style.left = startX + 'px';
        heart.style.bottom = '-20px';
        heart.style.fontSize = size + 'px';
        heart.style.setProperty('--tx', tx + 'px');
        heart.style.setProperty('--ty', ty + 'px');
        
        container.appendChild(heart);
        
        heart.addEventListener('animationend', () => {
            heart.remove();
        });
    }

    // 创建闪烁星星
    function createStar() {
        const star = document.createElement('div');
        star.className = 'star';
        
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        
        star.style.left = x + 'px';
        star.style.top = y + 'px';
        
        effectsContainer.appendChild(star);
        
        setTimeout(() => {
            star.remove();
        }, 1000);
    }

    // 定期创建特效
    setInterval(createFloatingHeart, 300);
    setInterval(createStar, 500);
    setTimeout(randomFirework, 1000);

    // 更新计时器
    function updateCounter() {
        const startDate = new Date('2022-05-01').getTime();
        const now = new Date().getTime();
        const diff = now - startDate;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        document.querySelector('.days').textContent = days;
        document.querySelector('.hours').textContent = hours;
        document.querySelector('.minutes').textContent = minutes;
    }

    // 每分钟更新一次计时器
    updateCounter();
    setInterval(updateCounter, 60000);

    // 图片加载函数
    function loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }

    // 创建模态框
    function createModal(imageSrc) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <img src="${imageSrc}" alt="放大图片">
            </div>
        `;
        
        modal.addEventListener('click', () => {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
            
            // 点击时创建烟花
            const rect = modal.getBoundingClientRect();
            createFirework(rect.width / 2, rect.height / 2);
        });

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 10);
    }

    // 加载并显示图片
    async function displayImages() {
        for (let [index, imageName] of images.entries()) {
            try {
                await loadImage(imageName);
                
                const div = document.createElement('div');
                div.className = 'gallery-item';
                div.style.opacity = '0';
                div.style.transform = 'translateY(30px)';
                
                const img = document.createElement('img');
                img.src = imageName;
                img.alt = '我们的美好回忆';
                
                div.appendChild(img);
                gallery.appendChild(div);

                // 添加渐入动画
                setTimeout(() => {
                    div.style.transition = 'all 0.8s ease';
                    div.style.opacity = '1';
                    div.style.transform = 'translateY(0)';
                    // 图片出现时创建烟花
                    createFirework(
                        Math.random() * window.innerWidth,
                        Math.random() * (window.innerHeight * 0.7)
                    );
                }, index * 100);

                // 点击查看大图
                div.addEventListener('click', () => {
                    createModal(imageName);
                    // 点击时创建烟花
                    const rect = div.getBoundingClientRect();
                    createFirework(
                        rect.left + rect.width / 2,
                        rect.top + rect.height / 2
                    );
                });

            } catch (error) {
                console.error(`Failed to load image: ${imageName}`, error);
            }
        }
    }

    // 页面滚动视差效果
    function parallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.gallery-item');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.05;
            const offset = scrolled * speed * (index % 2 ? 1 : -1);
            element.style.transform = `translateY(${offset}px)`;
        });
    }

    // 初始化
    displayImages();
    window.addEventListener('scroll', parallax);

    // 添加页面加载动画
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 1s ease';
    setTimeout(() => {
        document.body.style.opacity = '1';
        // 页面加载完成时创建烟花
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                createFirework(
                    Math.random() * window.innerWidth,
                    Math.random() * (window.innerHeight * 0.7)
                );
            }, i * 300);
        }
    }, 100);
});