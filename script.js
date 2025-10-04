// 🌙 Theme Selector
const select = document.getElementById('themeSelect');
select.addEventListener('change', () => {
    document.body.setAttribute('data-theme', select.value);
});

// 🍔 Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const menu = document.getElementById('menu');

if (menuToggle && menu) {
    const closeMenu = () => {
        if (!menu.hasAttribute('hidden')) {
            menu.setAttribute('hidden', '');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    };

    menuToggle.addEventListener('click', (event) => {
        event.stopPropagation();
        const isHidden = menu.hasAttribute('hidden');

        if (isHidden) {
            menu.removeAttribute('hidden');
        } else {
            menu.setAttribute('hidden', '');
        }

        menuToggle.setAttribute('aria-expanded', String(isHidden));
    });

    document.addEventListener('click', (event) => {
        if (!menu.contains(event.target) && event.target !== menuToggle) {
            closeMenu();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeMenu();
        }
    });
}

// 💬 Chat Section
const items = document.querySelectorAll('.contact');
const chatBox = document.querySelector('#chat-space');
const chatList = document.querySelector('#webchat');
const place = document.querySelector('#chatPlaceholder');
const chatName = document.querySelector('.chat-contact-name');
const chatAvatar = document.querySelector('#chat-header .avatar');

items.forEach(item => {
    item.addEventListener('click', () => {
        chatBox.classList.add('active');
        place.style.display = 'none';

        const name = item.querySelector('.contact-name').textContent;
        const avatarSrc = item.querySelector('.avatar').getAttribute('src');

        chatName.textContent = name;
        chatAvatar.setAttribute('src', avatarSrc);

        if (window.innerWidth <= 768) {
            chatList.classList.add('hidden');
        }
    });
});
