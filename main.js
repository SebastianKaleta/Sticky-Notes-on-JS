(function () {
    'use strict';

    var draggedEl,
        onDragStart,
        onDrag,
        onDragEnd,
        getNoteObject,
        grabPointY,
        grabPointX,
        createNote,
        addNoteBtnEl,
        onAddNoteBtnClick,
        saveNote,
        deleteNote,
        loadNotes,
        init,
        testLocalStorage;

    onDragStart = function (e) {
        let boundingClientRect;
        if (e.target.className.indexOf('bar') === -1) {
            return;
        }

        draggedEl = this;

        boundingClientRect = draggedEl.getBoundingClientRect();

        grabPointY = boundingClientRect.top - e.clientY;
        grabPointX = boundingClientRect.left - e.clientX;

    }
    onDrag = function (e) {
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

    onDragEnd = function () {
        draggedEl = null;
        grabPointX = null;
        grabPointY = null;
    }

    getNoteObject = function (el) {
        let textarea = el.querySelector('textarea');
        return {
            transformCSSValue: el.style.transform,
            content: textarea.value,
            id: el.id,
            textarea: {
                width: textarea.style.width,
                height: textarea.style.height
            }
        }
    }

    onAddNoteBtnClick = function () {
        createNote();
    }

    createNote = function (options) {

        let stickerEl = document.createElement('div'),
            barEl = document.createElement('div'),
            saveBtnEl = document.createElement('button'),
            deleteBtnEl = document.createElement('button'),
            textareaEl = document.createElement('textarea'),
            BOUNDARIES = 400,
            noteConfig = options || {
                transformCSSValue: "translateX(" + Math.random() * BOUNDARIES + "px) translateY(" + Math.random() * BOUNDARIES + "px)",
                content: '',
                id: "sticker_" + new Date().getTime(),
            },
            onSave,
            onDelete;

        if (noteConfig.textarea) {
            textareaEl.style.width = noteConfig.textarea.width;
            textareaEl.style.height = noteConfig.textarea.height;
            textareaEl.style.resize = 'none';
        }

        onDelete = function () {
            deleteNote(
                getNoteObject(stickerEl)
            );
            document.body.removeChild(stickerEl);
        };

        onSave = function () {
            saveNote(
                getNoteObject(stickerEl)
            );
        };

        stickerEl.style.transform = noteConfig.transformCSSValue;
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

    testLocalStorage = function () {
        const foo = "foo";
        try {
            localStorage.setItem(foo, foo);
            localStorage.removeItem(foo);
            return true;
        } catch (e) {
            return false;
        }
    }



    init = function () {

        if (!testLocalStorage()) {
            let message = "We are sorry, but you cannot use localStorage";
            saveNote = function () {
                console.warn(message);
            };

            deleteNote = function () {
                console.warn(message);
            };
        } else {

            saveNote = function (note) {
                localStorage.setItem(note.id, JSON.stringify(note));
                // tutaj zapisze notatke
            };

            deleteNote = function (note) {
                localStorage.removeItem(note.id);
                // usuwamy konkretną notatkę
            };

            loadNotes = function () {
                for (let i = 0; i < localStorage.length; i++) {
                    var noteObject = JSON.parse(
                        localStorage.getItem(
                            localStorage.key(i)
                        )
                    );
                    createNote(noteObject);
                };
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