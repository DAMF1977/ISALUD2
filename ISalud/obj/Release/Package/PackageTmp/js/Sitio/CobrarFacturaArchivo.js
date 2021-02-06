var tableHeaderBonos = [
    { Nombre: `<input id="chkTodos" type="checkbox" name="type" class="checkbox-body" />`, MinWidth: "", MaxWidth: "", ClassName: "text-center" },
    { Nombre: "Nº de bono", MinWidth: "", MaxWidth: "", ClassName: "text-center" },
    { Nombre: "Fecha de emisión", MinWidth: "", MaxWidth: "", ClassName: "text-center" },
    { Nombre: "Monto", MinWidth: "", MaxWidth: "", ClassName: "text-center" }
]

var ListaItemsBonos = [];
var checkedBonos = false;

$(function () {

    handlePagesStates.init();
});

var handlePagesStates = function () {

    function init() {

        handleGenericEvents();
        handleButtonsEvents();

    }

    function handleGenericEvents() {

        $(document).on('change', '#file-3', function () {

            var files = $('#file-3').prop('files');
            if (files && files[0]) {
                var FR = new FileReader();
                FR.addEventListener("load", function (e) {
                    $('#btn-continuar').show();
                    $('#btn-continuar').addClass('animate__animated animate__fadeIn');
                });
                FR.readAsDataURL(this.files[0]);
            }

        });

    }

    function handleButtonsEvents() {

        $(document).on('click', '#btn-continuar', function () {
            
            handleCargaArchivo.CargaExcel();
            
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

var handleCargaArchivo = function () {

    function CargaExcel() {

        var objFiltro = handlePagesStates.handleGetFiltroCobro();
        if (objFiltro != null) {
          
            var params = [
                { nombre: 'RutPrestador', valor: objFiltro.RutPrestador }
            ];

            EjecutaConsulta.UploadFile('file-3', Global.CobrarFacturaController.Name, Global.CobrarFacturaController.SubirArchivo, params, true)
                .then(response => {
                    if (response.Resultado) {

                        ListaItemsBonos = response.Elemento;
                        handleDatatableBonos.init();

                        $('#lblNroFactura').text(objFiltro.NroFactura);
                        $('#lblValorFactura').text(`$${handleFormato.formatNumber.new(objFiltro.ValorFactura)}`);

                        $('#contenido-archivo').addClass('animate__animated animate__fadeOutLeft');
                        setTimeout(() => {
                            $('#contenido-archivo').hide();
                            $('#contenido-filtrado').show();
                            $('#contenido-filtrado').addClass('animate__animated animate__fadeInRight');
                        }, 500);

                    }
                    else {
                        AlertInfo('warning', 'Advertencia', response.Mensaje);
                    }
                });
            

            /*
            ListaItemsBonos.push({ NumeroBono: 24400411, FechaEmision: '2012-04-26T00:00:00', MontoACobrar: 10000, Seleccionado: false });
            ListaItemsBonos.push({ NumeroBono: 24400412, FechaEmision: '2012-04-26T00:00:00', MontoACobrar: 10000, Seleccionado: false });
            ListaItemsBonos.push({ NumeroBono: 24400413, FechaEmision: '2012-04-26T00:00:00', MontoACobrar: 10000, Seleccionado: false });
            ListaItemsBonos.push({ NumeroBono: 24400414, FechaEmision: '2012-04-26T00:00:00', MontoACobrar: 10000, Seleccionado: false });
            ListaItemsBonos.push({ NumeroBono: 24400415, FechaEmision: '2012-04-26T00:00:00', MontoACobrar: 20000, Seleccionado: false });

            handleDatatableBonos.init();

            $('#lblNroFactura').text(objFiltro.NroFactura);
            $('#lblValorFactura').text(`$${handleFormato.formatNumber.new(objFiltro.ValorFactura)}`);

            $('#contenido-archivo').addClass('animate__animated animate__fadeOutLeft');
            setTimeout(() => {
                $('#contenido-archivo').hide();
                $('#contenido-filtrado').show();
                $('#contenido-filtrado').addClass('animate__animated animate__fadeInRight');
            }, 500);
            */
        }

    }

    function CobrarFacturaBonos() {

        var objFiltro = handlePagesStates.handleGetFiltroCobro();
        if (objFiltro != null) {

            var array_bonos = [];
            if (IsNull(ListaItemsBonos) != null) {
                ListaItemsBonos.map(element => {
                    if (element.Seleccionado) {

                        array_bonos.push({
                            Folio: element.NumeroBono,
                            Valor: element.MontoACobrar,
                            Fecha: moment(element).format('YYYY-MM-DD')
                        });

                    }
                });
            }

            var tipo_cobro;
            switch (objFiltro.TipoCobro) {
                case 'bono':
                    tipo_cobro = 1;
                    break;
                case 'archivo':
                    tipo_cobro = 2;
                    break;
                case 'cuenta':
                    tipo_cobro = 3;
                    break;
            }

            var params = {
                DTBono: {
                    RutPrestador: objFiltro.RutPrestador,
                    Nombre: objFiltro.NombrePrestador,
                    DV: objFiltro.RutDV,
                    FolioDT: objFiltro.NroFactura,
                    TipoDT: objFiltro.TipoDT,
                    TipoCobro: tipo_cobro,
                    Valor: objFiltro.ValorFactura,
                    Bonos: array_bonos
                }
            }

            EjecutaConsulta.Post(Global.CobrarFacturaController.Name, Global.CobrarFacturaController.CobrarFacturaBonos, params, false)
                .then(response => {
                    if (response.Resultado) {

                        var objFiltro = handlePagesStates.handleGetFiltroCobro();
                        if (objFiltro != null) {
                            var objCobroFactura = {
                                NroFactura: objFiltro.NroFactura,
                                ValorFactura: objFiltro.ValorFactura,
                                RutPrestador: objFiltro.RutPrestador,
                                RutDV: objFiltro.RutDV,
                                TipoDT: objFiltro.TipoDT,
                                TipoCobro: objFiltro.TipoCobro,
                                FiltroBono: objFiltro.FiltroBono,
                                NroWorkflow: response.Elemento
                            }
                        }
                        handlePagesStates.handleSetFiltroCobro(objCobroFactura);

                        window.location.href = '/CobrarFactura/ExitoCobro';
                    }
                    else {
                        window.location.href = '/CobrarFactura/ErrorCobro';
                    }
                });
        }

    }

    return {
        CargaExcel: CargaExcel,
        CobrarFacturaBonos: CobrarFacturaBonos
    }

}();

var handleDatatableBonos = function () {

    function init() {
        SetColumnsTable(tableHeaderBonos)
            .then(res => {
                $('#table-list-head-bonos').html(`<tr>${res}</tr>`);
                LlenarData();
            });
    }

    function handleEvents() {

        $(document).on('change', '#chkTodos', function (e) {

            if (this.checked) {
                if (IsNull(ListaItemsBonos) != null) {
                    ListaItemsBonos.map(element => {
                        element.Seleccionado = true;
                    });
                }

                checkedBonos = true;
                handleDatatableBonos.init();
            }
            else {
                if (IsNull(ListaItemsBonos) != null) {
                    ListaItemsBonos.map(element => {
                        element.Seleccionado = false;
                    });
                }

                checkedBonos = false;
                handleDatatableBonos.init();
            }

            SumaBonosSeleccionados();
        });

        $(document).on('change', '.select-bono', function (e) {


            var nro_bono = $(this).attr("data-id");
            if (this.checked) {
                if (IsNull(ListaItemsBonos) != null) {
                    ListaItemsBonos.map(element => {
                        if (element.NumeroBono == Number(nro_bono))
                            element.Seleccionado = true;
                    });
                }
            }
            else {
                $('#chkTodos').attr('checked', false);
                if (IsNull(ListaItemsBonos) != null) {
                    ListaItemsBonos.map(element => {
                        if (element.NumeroBono == Number(nro_bono))
                            element.Seleccionado = false;
                    });
                }
            }

            SumaBonosSeleccionados();
        });

        $(document).on('click', '#btn-filtro', function (e) {

            handleCobrarFactura.ConsultaBonosParaCobro();

        });

        $("#btnModalCobro").click(function () {

            var total_bonos = 0;
            if (IsNull(ListaItemsBonos) != null) {
                ListaItemsBonos.map(element => {
                    if (element.Seleccionado) {
                        total_bonos++;
                    }
                });
            }

            if (total_bonos == 0) {
                AlertInfo('warning', 'Advertencia', 'Seleccione al menos un bono');
            }
            else {

                var objFiltro = handlePagesStates.handleGetFiltroCobro();
                if (objFiltro != null) {

                    $('#lblNroFacturaModal').text(objFiltro.NroFactura);
                    if (objFiltro.TipoCobro == 'bono')
                        $('#lblTipoCobroModal').text('Bono');
                    else {
                        if (objFiltro.TipoCobro == 'archivo')
                            $('#lblTipoCobroModal').text('Archivo');
                        else
                            $('#lblTipoCobroModal').text('Cuenta médica');
                    }
                    $('#lblFechaCobroModal').text(moment().format(Global.FormatoFecha));
                    $('#lblMontoCobroModal').text(handleFormato.formatNumber.new(objFiltro.ValorFactura));

                    $(".overlay").fadeIn(200);
                    event.preventDefault();

                }

            }

        });

        $("#btnCobrarFacturaModal").click(function () {

            handleCargaArchivo.CobrarFacturaBonos();

        });

        $("#btnCancelarModal").click(function () {
            $(".overlay").fadeOut(200);
            event.preventDefault();
        });
    }

    function LlenarData() {
        if ($.fn.DataTable.isDataTable("#table-list-bonos")) {
            $('#table-list-bonos').dataTable().fnDestroy();
            $('#table-list-body-bonos').html('');
        }

        //chkTodos
        if (IsNull(ListaItemsBonos) == null) {
            $('#chkTodos').removeClass('checkbox-body');
            $('#chkTodos').addClass('checkbox-head');
        }

        $.each(ListaItemsBonos, function (i, element) {

            var checked = (element.Seleccionado) ? 'checked' : '';
            let row = '';
            row += `<tr>
                        <td width="10">
                            <input class="select-bono checkbox-body" data-id="${element.NumeroBono}" type="checkbox" ${checked} />
                        </td>
                        <td><a href="${element.UrlBono}" target="_blank">${element.NumeroBono}</a></td>
                        <td>${moment(element.FechaEmision).format(Global.FormatoFecha)}</td>
                        <td>$${handleFormato.formatNumber.new(element.MontoACobrar)}</td>
                    </tr>`;

            $('#table-list-body-bonos').append(row);
        });

        handleEvents();

        $('.contenedorTablaResumen').show();

        InitDateTableBonos('table-list-bonos', [0, 1, 2], false, false, [3], [], [1, 2]);
    }

    function InitDateTableBonos(tableId, disableColumsOrder = [], pagining = true, enableSearch = true, columns_align_right = [], columns_align_left = [], columns_align_center = [], number_format = [], nuevoRegistro = false) {
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
                if (checkedBonos)
                    $('#chkTodos').attr('checked', true);
                else
                    $('#chkTodos').attr('checked', false);
            }
        });

    }

    function SumaBonosSeleccionados() {
        var total_bonos = 0;
        if (IsNull(ListaItemsBonos) != null) {
            ListaItemsBonos.map(element => {
                if (element.Seleccionado)
                    total_bonos = total_bonos + element.MontoACobrar;
            });
        }

        $("#lblTotalSumaBonos").text(`$${handleFormato.formatNumber.new(total_bonos)}`);
    }

    return {
        init: init
    }

}();