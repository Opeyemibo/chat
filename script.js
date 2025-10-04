// 🌙 THEME SELECTOR -------------------------------
// Handles switching between light/dark/custom themes dynamically
const select = document.getElementById('themeSelect');

select.addEventListener('change', () => {
    document.body.setAttribute('data-theme', select.value);
});


// 🍔 MENU TOGGLE ----------------------------------
// Controls opening and closing of the side menu or dropdown
const menuToggle = document.getElementById('menuToggle');
const menu = document.getElementById('menu');

if (menuToggle && menu) {
    // Function to close the menu safely
    const closeMenu = () => {
        if (!menu.hasAttribute('hidden')) {
            menu.setAttribute('hidden', '');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    };

    // Toggle open/close when clicking the menu button
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

    // Close when clicking outside of the menu
    document.addEventListener('click', (event) => {
        if (!menu.contains(event.target) && event.target !== menuToggle) {
            closeMenu();
        }
    });

    // Close when pressing ESC
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeMenu();
        }
    });
}


// 💬 CHAT SECTION --------------------------------
// Handles chat switching, activation, and messaging

const items = document.querySelectorAll('.contact');
const chatBox = document.querySelector('#chat-space');
const chatList = document.querySelector('#webchat');
const place = document.querySelector('#chatPlaceholder');
const chatName = document.querySelector('.chat-contact-name');
const chatAvatar = document.querySelector('#chat-header .avatar');
const chatMessages = document.querySelector('#chat-messages');
const chatInputField = document.querySelector('#chat-input input');
const sendButton = document.getElementById('send-btn');

let activeContact = items.length ? items[0] : null;


// 📦 Function: Activates the chat view
const activateChatView = () => {
    if (chatBox) chatBox.classList.add('active');
    if (place) place.style.display = 'none';
};


// ⭐ Function: Marks the selected contact as active
const markActiveContact = (contact) => {
    if (!contact) return;
    if (activeContact) {
        activeContact.classList.remove('active-contact');
    }
    activeContact = contact;
    activeContact.classList.add('active-contact');
};


// 🕓 Function: Gets formatted time (e.g., 12:45 PM)
const getFormattedTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};


// 📨 Function: Updates the last message preview under contact name
const updateLastMessagePreview = (text) => {
    if (!activeContact) return;
    const previewElement = activeContact.querySelector('.last-message');
    if (!previewElement) return;
    previewElement.textContent = text;
    previewElement.dataset.originalText = text;
};


// 🧱 Function: Adds a new message (sent) into the chat area
const appendSentMessage = (text) => {
    if (!chatMessages) return;

    // Restore old highlights before adding new message
    document.querySelectorAll('#chat-messages .message p[data-original-text]').forEach((paragraph) => {
        paragraph.textContent = paragraph.dataset.originalText ?? paragraph.textContent;
    });

    // Message wrapper
    const messageWrapper = document.createElement('div');
    messageWrapper.classList.add('message', 'sent');

    // Text element
    const messageText = document.createElement('p');
    messageText.textContent = text;
    messageText.dataset.originalText = text;

    // Timestamp element
    const timeStamp = document.createElement('span');
    timeStamp.classList.add('time');
    timeStamp.textContent = getFormattedTime();

    // Combine all parts
    messageWrapper.append(messageText, timeStamp);
    chatMessages.append(messageWrapper);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Reapply highlights if search feature is active
    runSearch?.(searchInput?.value ?? '');
};


// ✉️ Function: Sends the message written by user
const sendMessage = () => {
    if (!chatInputField) return;

    const messageText = chatInputField.value.trim();
    if (!messageText) return;

    activateChatView();

    if (!activeContact && items.length) {
        markActiveContact(items[0]);
    }

    appendSentMessage(messageText);
    updateLastMessagePreview(messageText);

    chatInputField.value = '';
    chatInputField.focus();
};


// 🌟 Set the first contact active when chat loads
if (activeContact) {
    activeContact.classList.add('active-contact');
}


// 👆 Contact click event: switch chat and load info
items.forEach((item) => {
    item.addEventListener('click', () => {
        markActiveContact(item);
        activateChatView();

        const name = item.querySelector('.contact-name')?.textContent ?? '';
        const avatarSrc = item.querySelector('.avatar')?.getAttribute('src') ?? '';

        if (chatName) chatName.textContent = name;
        if (chatAvatar && avatarSrc) chatAvatar.setAttribute('src', avatarSrc);

        // Hide contact list on mobile for better UX
        if (window.innerWidth <= 768 && chatList) {
            chatList.classList.add('hidden');
        }
    });
});


// 🖱️ Send button click
if (sendButton) {
    sendButton.addEventListener('click', () => {
        sendMessage();
    });
}


// ⌨️ Press Enter to send message (Shift + Enter = new line)
if (chatInputField) {
    chatInputField.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    });
});
