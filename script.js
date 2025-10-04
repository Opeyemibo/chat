const select = document.getElementById('themeSelect');
select.addEventListener('change', () => {
    document.body.setAttribute('data-theme', select.value);
});

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

    menu.addEventListener('click', (event) => {
        if (event.target.closest('a')) {
            closeMenu();
        }
    });
}

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

const activateChatView = () => {
    if (chatBox) {
        chatBox.classList.add('active');
    }
    if (place) {
        place.style.display = 'none';
    }
};

const markActiveContact = (contact) => {
    if (!contact) {
        return;
    }
    if (activeContact) {
        activeContact.classList.remove('active-contact');
    }
    activeContact = contact;
    activeContact.classList.add('active-contact');
};

const updateLastMessagePreview = (text) => {
    if (!activeContact) {
        return;
    }
    const previewElement = activeContact.querySelector('.last-message');
    if (!previewElement) {
        return;
    }
    previewElement.textContent = text;
    previewElement.dataset.originalText = text;
};

const getFormattedTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const appendSentMessage = (text) => {
    if (!chatMessages) {
        return;
    }

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

const lightbox = document.getElementById('imageLightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxCloseTriggers = document.querySelectorAll('[data-close="lightbox"]');
const chatHeaderAvatar = document.querySelector('#chat-header .avatar');

const openLightbox = ({ src, alt }) => {
    if (!lightbox || !lightboxImage) {
        return;
    }

    lightboxImage.setAttribute('src', src);
    lightboxImage.setAttribute('alt', alt);

    if (lightboxCaption) {
        lightboxCaption.textContent = chatName?.textContent?.trim() || '';
    }

    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
};

const closeLightbox = () => {
    if (!lightbox) {
        return;
    }

    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
};

if (chatHeaderAvatar) {
    chatHeaderAvatar.addEventListener('click', () => {
        const src = chatHeaderAvatar.getAttribute('src');
        const alt = chatHeaderAvatar.getAttribute('alt') || chatName?.textContent || 'Avatar preview';

        openLightbox({ src: src || '', alt });
    });
}

lightboxCloseTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
        closeLightbox();
    });
});

if (lightbox) {
    lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && lightbox.getAttribute('aria-hidden') === 'false') {
            closeLightbox();
        }
    });
}

const sendMessage = () => {
    if (!chatInputField) {
        return;
    }

    const messageText = chatInputField.value.trim();
    if (!messageText) {
        return;
    }

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

        if (chatName) {
            chatName.textContent = name;
        }

        if (chatAvatar && avatarSrc) {
            chatAvatar.setAttribute('src', avatarSrc);
        }

        if (chatAvatar) {
            chatAvatar.setAttribute('alt', name || 'Chat avatar');
        }

        if (lightboxCaption) {
            lightboxCaption.textContent = name;
        }

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

const searchInput = document.querySelector('#search input');

const storeOriginalText = (element) => {
    if (element && !element.dataset.originalText) {
        element.dataset.originalText = element.textContent;
    }
};

const highlightMatches = (element, rawQuery, normalizedQuery) => {
    if (!element) {
        return false;
    }

    storeOriginalText(element);
    const originalText = element.dataset.originalText || '';

    if (!rawQuery) {
        element.textContent = originalText;
        return false;
    }

    const lowerOriginal = originalText.toLowerCase();
    let matchIndex = lowerOriginal.indexOf(normalizedQuery);

    if (matchIndex === -1) {
        element.textContent = originalText;
        return false;
    }

    element.textContent = '';
    let lastIndex = 0;
    const fragment = document.createDocumentFragment();

    while (matchIndex !== -1) {
        if (matchIndex > lastIndex) {
            fragment.append(document.createTextNode(originalText.slice(lastIndex, matchIndex)));
        }

        const matchText = originalText.slice(matchIndex, matchIndex + rawQuery.length);
        const mark = document.createElement('mark');
        mark.textContent = matchText;
        fragment.append(mark);

        lastIndex = matchIndex + rawQuery.length;
        matchIndex = lowerOriginal.indexOf(normalizedQuery, lastIndex);
    }

    if (lastIndex < originalText.length) {
        fragment.append(document.createTextNode(originalText.slice(lastIndex)));
    }

    element.append(fragment);
    return true;
};

const resetMessageClasses = () => {
    document.querySelectorAll('#chat-messages .message').forEach((message) => {
        message.classList.remove('search-hidden', 'search-match');
    });
};

const runSearch = (rawQuery) => {
    const query = rawQuery.trim();
    const normalizedQuery = query.toLowerCase();
    const hasQuery = normalizedQuery.length > 0;

    items.forEach((contact) => {
        const nameElement = contact.querySelector('.contact-name');
        const previewElement = contact.querySelector('.last-message');

        const nameMatch = highlightMatches(nameElement, query, normalizedQuery);
        const previewMatch = highlightMatches(previewElement, query, normalizedQuery);
        const matchesContact = nameMatch || previewMatch;

        contact.classList.toggle('search-hidden', hasQuery && !matchesContact);
    });

    const messageParagraphs = document.querySelectorAll('#chat-messages .message p');

    messageParagraphs.forEach((paragraph) => {
        const messageMatch = highlightMatches(paragraph, query, normalizedQuery);
        const wrapper = paragraph.closest('.message');

        if (wrapper) {
            wrapper.classList.toggle('search-hidden', hasQuery && !messageMatch);
            wrapper.classList.toggle('search-match', hasQuery && messageMatch);
        }
    });

    if (!hasQuery) {
        resetMessageClasses();
    }
};

if (searchInput) {
    searchInput.addEventListener('input', (event) => {
        runSearch(event.target.value);
    });
}



document.getElementById('back-btn').addEventListener('click', () => {
  document.getElementById('chat-space').classList.remove('active');
  document.getElementById('webchat').classList.remove('hidden');
});
