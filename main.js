(function () {
    'use strict';

    let grabPointY,
        grabPointX,
        draggedEl,
        addNoteBtnEl,
        saveNote,
        deleteNote,
        loadNotes,
        onAddNoteBtnClick,
        localStorage;

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

    const getNoteObject = function (el) {
        let textarea = el.querySelector('textarea');
        return {
            content: textarea.value,
            id: el.id,
            transformCSSValue: el.style.transform
        }
    }

    const createNote = function (options) {

        let stickerEl = document.createElement('div'),
            barEl = document.createElement('div'),
            textareaEl = document.createElement('textarea'),
            saveBtnEl = document.createElement("button"),
            deleteBtnEl = document.createElement("button"),
            // onSave,
            // onDelete,
            boundaries = 400,
            noteConfig = options || {
                content: "",
                id: "sticker_" + new Date().getTime(),
                transformCSSValue: "translateX(" + Math.random() * boundaries + "px) translateY(" + Math.random() * boundaries + "px)"
            };

        const onDelete = function () {
            const obj = {};
            deleteNote(obj);
        };

        const onSave = function () {
            const obj = {};
            saveNote(getNoteObject(stickerEl));
        }

        stickerEl.id = noteConfig.id;
        textareaEl.value = noteConfig.content;


        saveBtnEl.addEventListener('click', onSave);
        deleteBtnEl.addEventListener('click', onDelete);

        saveBtnEl.classList.add('saveButton');
        deleteBtnEl.classList.add('deleteButton');

        let transformCSSValue = noteConfig.transformCSSValue;

        stickerEl.style.transform = transformCSSValue;
        barEl.classList.add('bar');
        stickerEl.classList.add('sticker');

        barEl.appendChild(saveBtnEl);
        barEl.appendChild(deleteBtnEl);

        stickerEl.append(barEl);
        stickerEl.appendChild(textareaEl);

        stickerEl.addEventListener('mousedown', onDragStart, false);
        document.body.appendChild(stickerEl);

    }

    const testLocalStorage = function () {
        let foo = "foo";
        try {
            localStorage.setItem(foo, foo);
            localStorage.removeItem(foo);
            return true;
        } catch (e) {
            return false;
        }
    }

    onAddNoteBtnClick = function () {
        createNote();
    }

    const init = function () {

        if (!testLocalStorage()) {
            let message = "We are sorry, but you cannot use localStorage";
        } else {
            saveNote = function (note) {
                console.log(localStorage.setItem(note.id, JSON.stringify(note)))
                localStorage.setItem(note.id, JSON.stringify(note));
                // tutaj zapisze notatke
            };
            deleteNote = function (note) {
                // usuwamy konkretną notatkę
            };

            loadNotes = function () {
                for (let i = 0; i < localStorage.length; i++) {
                    let noteObject =
                        // JSON.parse(
                        localStorage.getItem(
                            localStorage.key(i)
                        )
                    // );
                    createNote(noteObject);
                }
                // załadujemy wszystkie notatki
            };

            loadNotes();

        };

        addNoteBtnEl = document.querySelector('.addNoteBtn');
        addNoteBtnEl.addEventListener('click', onAddNoteBtnClick, false);
        document.addEventListener('mousemove', onDrag, false);
        document.addEventListener('mouseup', onDragEnd, false);
    }
    init();
    // createNote();




})();