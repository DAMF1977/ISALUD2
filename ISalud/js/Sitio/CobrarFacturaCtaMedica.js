var tableHeaderFiles = [
    { Nombre: "Nombre Documento", MinWidth: "", MaxWidth: "", ClassName: "text-center" },
    { Nombre: "Tipo de Documento", MinWidth: "", MaxWidth: "", ClassName: "text-center" },
    { Nombre: "", MinWidth: "", MaxWidth: "", ClassName: "text-center" }
]

var ListaArchivos = [];

$(function () {

    handlePagesStates.init();
});

var handlePagesStates = function () {

    function init() {

        var startDate = moment().add('-24', 'M').toDate();
        var endDate = moment().add('24', 'M').toDate();

        $('#txtFechaInicio').datepicker({
            minDate: new Date(startDate),
            maxDate: new Date(endDate),
            onSelect: function (dateStr) {
                var fecha = moment(dateStr, Global.FormatoFecha).toDate();
                $('#txtFechaTermino').datepicker('option', 'minDate', fecha);
            }
        });
        $('#txtFechaTermino').datepicker({
            minDate: new Date(startDate),
            maxDate: new Date(endDate),
            onSelect: function (dateStr) {
                var fecha = moment(dateStr, Global.FormatoFecha).toDate();
                $('#txtFechaInicio').datepicker('option', 'maxDate', fecha);
            }
        });
        InitDatePickerOptions();

        var objFiltro = handleGetFiltroCobro();
        if (objFiltro != null) {
            $("#lblNroFactura").text(objFiltro.NroFactura);
            $('#lblValorFactura').text(`$${handleFormato.formatNumber.new(objFiltro.ValorFactura)}`);
        }

        handleGenericEvents();
        handleButtonsEvents();

    }

    function handleGenericEvents() {

        $(document).on('change', '#select-documentacion', function (e) {
            var tipo_id = Number(GetSelectValue('select-documentacion'));
            if (tipo_id > 0) {
                e.preventDefault();
                $('#subir-archivo').fadeIn();
            }
            else {
                $('#subir-archivo').fadeOut();
            }
        });

        $(document).on('change', '#file-3', function () {

            var files = $('#file-3').prop('files');
            if (files && files[0]) {

                var filename = files[0].name;
                var extension = filename.substr((filename.lastIndexOf('.') + 1));

                var FR = new FileReader();
                FR.addEventListener("load", function (e) {

                    if (extension != 'pdf') {
                        AlertInfo('warning', 'Advertencia', 'Solo se permiten archivos en formato pdf');
                        $("#lblInputFile").text("Click aquí para subir archivo");
                        $('#file-3').val(null);
                        SetInputValue('select2', 'select-documentacion', '0');
                        $('#subir-archivo').fadeOut();
                    }
                    else {

                        var tipo_id = Number(GetSelectValue('select-documentacion'));
                        var valid_tipo = ListaArchivos.filter(x => x.TipoId == tipo_id);

                        if (valid_tipo.length > 0) {
                            AlertInfo('warning', 'Advertencia', 'El documento ya se encuentra adjunto');
                            $("#lblInputFile").text("Click aquí para subir archivo");
                            $('#file-3').val(null);
                            SetInputValue('select2', 'select-documentacion', '0');
                            $('#subir-archivo').fadeOut();
                        }
                        else {

                            ListaArchivos.push({
                                Id: ListaArchivos.length + 1,
                                Nombre: filename,
                                TipoId: tipo_id,
                                TipoNombre: GetSelectText('select-documentacion'),
                                Data: e.target.result
                            });

                            $("#lblInputFile").text("Click aquí para subir archivo");
                            $('#file-3').val(null);
                            SetInputValue('select2', 'select-documentacion', '0');
                            $('#subir-archivo').fadeOut();

                            handleDatatableFiles.init();

                            $('#btn-continuar').show();
                            $('#btn-continuar').addClass('animate__animated animate__fadeIn');

                        }
                    }

                });
                FR.readAsDataURL(this.files[0]);
            }

        });

    }

    function handleButtonsEvents() {

        $(document).on('click', '#btn-continuar', function (e) {

            var cta_medica = ListaArchivos.filter(x => x.TipoId == 1);
            var epicrisis = ListaArchivos.filter(x => x.TipoId == 2);
            var protocolo = ListaArchivos.filter(x => x.TipoId == 3);

            if (cta_medica.length == 0) {
                AlertInfo('warning', 'Advertencia', 'Debe adjuntar el documento de cuenta médica');
                e.preventDefault();
            }
            else if (epicrisis.length == 0) {
                AlertInfo('warning', 'Advertencia', 'Debe adjuntar el documento de epicrisis');
                e.preventDefault();
            } else if (protocolo.length == 0) {
                AlertInfo('warning', 'Advertencia', 'Debe adjuntar el documento de protocolo operatorio');
                e.preventDefault();
            }

        });

    }

    function handleSetFiltroCobro(value) {
        localStorage.setItem('objFiltro', JSON.stringify(value));
    }

    function handleGetFiltroCobro() {
        var value = localStorage.getItem('objFiltro');
        if (IsNull(value) == null)
            return null
        else
            return $.parseJSON(value);
    }

    return {
        init: init,
        handleSetFiltroCobro: handleSetFiltroCobro,
        handleGetFiltroCobro: handleGetFiltroCobro
    }

}();

var handleDatatableFiles = function () {

    function init() {
        SetColumnsTable(tableHeaderFiles)
            .then(res => {
                $('#table-list-head-files').html(`<tr>${res}</tr>`);
                LlenarData();
            });
    }

    function handleEvents() {

        $(".deleteFile").on("click", function (e) {
            var id_file = $(this).attr("data-id");

            var array = ListaArchivos;
            ListaArchivos = [];

            var cont = 1;
            array.map(elem => {
                if (elem.Id != Number(id_file)) {
                    ListaArchivos.push({
                        Id: cont,
                        Nombre: elem.Nombre,
                        TipoId: elem.TipoId,
                        TipoNombre: elem.TipoNombre,
                        Data: elem.Data
                    });
                    cont++;
                }
            });

            LlenarData();
        });

    }

    function LlenarData() {
        if ($.fn.DataTable.isDataTable("#table-list-files")) {
            $('#table-list-files').dataTable().fnDestroy();
            $('#table-list-body-files').html('');
        }

        $.each(ListaArchivos, function (i, element) {

            let row = '';
            row += `<tr>
                        <td>${element.Nombre}</td>
                        <td>${element.TipoNombre}</td>
                        <td>
                            <a href="javascript:void(0);" class="deleteFile" data-id="${element.Id}"><img src="/img/i-eliminar.svg"></a>
                        </td>
                    </tr>`;

            $('#table-list-body-files').append(row);
        });

        handleEvents();

        $('.documentosAdjuntos').show();

        InitDateTableFiles('table-list-files');
    }

    function InitDateTableFiles(tableId, disableColumsOrder = [], pagining = true, enableSearch = true, columns_align_right = [], columns_align_left = [], columns_align_center = [], number_format = [], nuevoRegistro = false) {
        $('#' + tableId).DataTable({
            ordering: false,
            searching: false,
            language: {
                "lengthMenu": "Monstrando _MENU_ registros por página",
                "zeroRecords": "No se encontró el resultado buscado",
                "info": "Mostrando página _PAGE_ de _PAGES_",
                "infoEmpty": "No hay registros disponibles",
                "infoFiltered": "(filtered from _MAX_ total records)"
            },
            columnDefs: [
                { className: "text-right", "targets": columns_align_right },
                { className: "text-left", "targets": columns_align_left },
                { className: "text-center", "targets": columns_align_center }
            ],
            initComplete: function () {
                
            }
        });

    }

    return {
        init: init
    }

}();