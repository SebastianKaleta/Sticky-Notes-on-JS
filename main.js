(function () {
    'use strict';


    let grabPointY,
        grabPointX,
        draggedEl,
        addNoteBtnEl;

    const onDragStart = function (e) {
        let boundingClientRect;
        if (e.target.className.indexOf('bar') === -1) {
            return;
        }

        draggedEl = this;

        boundingClientRect = draggedEl.getBoundingClientRect();

        grabPointY = boundingClientRect.top - e.clientY;
        grabPointX = boundingClientRect.left - e.clientX;

    }
    const onDrag = function (e) {
        if (!draggedEl) {
            return;
        }

        let posX = e.clientX + grabPointX,
            posY = e.clientY + grabPointY;

        if (posX < 0) {
            posX = 0;
        }
        if (posY < 0) {
            posY = 0;
        }

        draggedEl.style.transform = "translateX(" + posX + "px) translateY(" + posY + "px)";
    };

    const onDragEnd = function () {
        draggedEl = null;
        grabPointX = null;
        grabPointY = null;
    }

    const createNote = function () {

        let stickerEl = document.createElement('div'),
            barEl = document.createElement('div'),
            textareaEl = document.createElement('textarea');

        let transformCSSValue = "translateX(" + Math.random() * 400 + "px) translateY(" + Math.random() * 400 + "px)";

        stickerEl.style.transform = transformCSSValue;
        barEl.classList.add('bar');
        stickerEl.classList.add('sticker');

        stickerEl.append(barEl);
        stickerEl.appendChild(textareaEl);

        stickerEl.addEventListener('mousedown', onDragStart, false);
        document.body.appendChild(stickerEl);

    }

    createNote();

    addNoteBtnEl = document.querySelector('.addNoteBtn');
    addNoteBtnEl.addEventListener('click', createNote, false);
    document.addEventListener('mousemove', onDrag, false);
    document.addEventListener('mouseup', onDragEnd, false);
})();