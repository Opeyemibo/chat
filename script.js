const place = document.querySelector('#chatPlaceholder');
const chatName = document.querySelector('.chat-contact-name');
const chatAvatar = document.querySelector('#chat-header .avatar');
const chatMessages = document.querySelector('#chat-messages');
const chatInputField = document.querySelector('#chat-input input');
const sendButton = document.getElementById('send-btn');

let activeContact = items.length ? items[0] : null;

const activateChatView = () => {
    if (chatBox) {
        chatBox.classList.add('active');
    }
    if (place) {
        place.style.display = 'none';
    }
};

const markActiveContact = (contact) => {
    if (!contact) return;
    if (activeContact) {
        activeContact.classList.remove('active-contact');
    }
    activeContact = contact;
    activeContact.classList.add('active-contact');
};

const updateLastMessagePreview = (text) => {
    if (!activeContact) return;
    const previewElement = activeContact.querySelector('.last-message');
    if (!previewElement) return;
    previewElement.textContent = text;
    previewElement.dataset.originalText = text;
};

const getFormattedTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const appendSentMessage = (text) => {
    if (!chatMessages) return;

    // Restore search highlighting in previous messages before adding a new one
    document.querySelectorAll('#chat-messages .message p[data-original-text]').forEach((paragraph) => {
        paragraph.textContent = paragraph.dataset.originalText ?? paragraph.textContent;
    });

    const messageWrapper = document.createElement('div');
    messageWrapper.classList.add('message', 'sent');

    const messageText = document.createElement('p');
    messageText.textContent = text;
    messageText.dataset.originalText = text;

    const timeStamp = document.createElement('span');
    timeStamp.classList.add('time');
    timeStamp.textContent = getFormattedTime();

    messageWrapper.append(messageText, timeStamp);
    chatMessages.append(messageWrapper);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Restore search highlights after adding the new message
    runSearch(searchInput?.value ?? '');
};

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

if (activeContact) {
    activeContact.classList.add('active-contact');
}

items.forEach((item) => {
    item.addEventListener('click', () => {
        markActiveContact(item);
        activateChatView();

        const name = item.querySelector('.contact-name')?.textContent ?? '';
        const avatarSrc = item.querySelector('.avatar')?.getAttribute('src') ?? '';

        if (chatName) chatName.textContent = name;
        if (chatAvatar && avatarSrc) chatAvatar.setAttribute('src', avatarSrc);

        if (window.innerWidth <= 768 && chatList) {
            chatList.classList.add('hidden');
        }
    });
});

if (sendButton) {
    sendButton.addEventListener('click', () => {
        sendMessage();
    });
}

if (chatInputField) {
    chatInputField.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    });
}
