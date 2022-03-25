class HcodeGrid {

    constructor(configs) {

        configs.listeners = Object.assign({
            afterUpdateClick: (e) => {
                $("#modal-update").modal('show');
            },
            afterDeleteClick: (e) => {
                window.location.reload();
            },
            afterFormCreate: (e) => {
                window.location.reload();
            },
            afterFormUpdate: (e) => {
                window.location.reload();
            },
            afterFormUpdateError: (e) => {
                alert('Não foi possível enviar o formulário!')
            },
            afterFormUpdateError: (e) => {
                alert('Não foi possível enviar o formulário!')
            },
        }, configs.listeners);
        this.options = Object.assign({}, {
            formCreate: '#modal-create form',
            formUpdate: '#modal-update form',
            btnUpdate: '.btn-update',
            btnDelete: '.btn-delete',
            onUpdateLoad: (form, name, data) => {
                const input = form.querySelector(`[name=${name}]`);
                if (input) input.value = data[name];
            }
        }, configs);

        this.initForms();
        this.initButtons();
    }

    initForms() {

        this.formCreate = document.querySelector(this.options.formCreate);

        this.formCreate.save().then(json => {
            this.fireEvent('afterFormCreate');
        }).catch(err => {
            this.fireEvent('afterFormCreateError');
        });

        this.formUpdate = document.querySelector(this.options.formUpdate);

        this.formUpdate.save().then(json => {
            this.fireEvent('afterFormUpdate');
        }).catch(err => {
            this.fireEvent('afterFormUpdateError');
        });
    }

    fireEvent(name, args) {
        if (typeof this.options.listeners[name] === 'function')
            this.options.listeners[name].apply(this, args);
    }

    getRowData(e) {
        const tr = e.composedPath().find(el => {
            return (el.tagName.toUpperCase() === 'TR');
        });
        return JSON.parse(tr.dataset.row);
    }

    initButtons() {

        [...document.querySelectorAll(this.options.btnUpdate)].forEach(btn => {
            btn.addEventListener('click', e => {

                this.fireEvent('beforeUpdateClick', [e]);

                const data = this.getRowData(e);

                for (let name in data) {

                    this.options.onUpdateLoad(this.formUpdate, name, data);
                }
                this.fireEvent('afterUpdateClick', [e]);
            });
        });

        [...document.querySelectorAll(this.options.btnDelete)].forEach(btn => {
            btn.addEventListener('click', e => {

                this.fireEvent('beforeUpdateClick', [e]);
                
                const data = this.getRowData(e);
                
                if (confirm(eval("`" + this.options.deleteMsg + "`"))) {

                    fetch(eval("`" + this.options.deleteUrl + "`"), {
                        method: 'DELETE'
                    })
                        .then(response => response.json())
                        .then(json => {
                            this.fireEvent('afterDeleteClick');
                        });
                }
            });
        });
    }
}