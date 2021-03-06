﻿var tableHeader = [
    { Nombre: "", MinWidth: "", MaxWidth: "", ClassName: "text-center" },
    { Nombre: "Rut prestador", MinWidth: "100", MaxWidth: "100", ClassName: "text-left" },
    { Nombre: "Nombre prestador", MinWidth: "", MaxWidth: "", ClassName: "text-left" },
    { Nombre: "Nº factura", MinWidth: "", MaxWidth: "", ClassName: "text-right" },
    { Nombre: "Fecha emisión", MinWidth: "80", MaxWidth: "80", ClassName: "text-left" },
    { Nombre: "Tipo de factura", MinWidth: "", MaxWidth: "", ClassName: "text-left" },
    { Nombre: "Monto excento", MinWidth: "", MaxWidth: "", ClassName: "text-left" },
    { Nombre: "Monto afecto", MinWidth: "", MaxWidth: "", ClassName: "text-left" },
    { Nombre: "IVA", MinWidth: "", MaxWidth: "", ClassName: "text-left" },
    { Nombre: "Total a pagar", MinWidth: "", MaxWidth: "", ClassName: "text-left" },
    { Nombre: "Descuento", MinWidth: "", MaxWidth: "", ClassName: "text-left" }
];

var tableHeaderBonos = [
    { Nombre: `<input id="chkTodos" type="checkbox" name="type" class="checkbox-body" />`, MinWidth: "", MaxWidth: "", ClassName: "text-center" },
    { Nombre: "Nº de bono", MinWidth: "", MaxWidth: "", ClassName: "text-center" },
    { Nombre: "Fecha de emisión", MinWidth: "", MaxWidth: "", ClassName: "text-center" },
    { Nombre: "Monto", MinWidth: "", MaxWidth: "", ClassName: "text-center" }
]

var ListaItems = [];
var ListaItemsBonos = [];
var checkedBonos = false;

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

        handleGenericEvents();
        handleButtonsEvents();

        handleCobrarFactura.ConsultaFacturasPorCobrar();

    }

    function handleGenericEvents() {

        $(document).on('click', '.seleccion-factura', function () {
            $('#btn-cobrar-1').show();
            $('#btn-cobrar-1').addClass('animate__animated animate__fadeIn');

            var factura = $(this).attr("data-id");
            var factura_valor = $(this).attr("data-valor");
            var rut_prestador = $(this).attr("data-rut");
            var rut_dv = $(this).attr("data-dv");
            var tipo_dt = $(this).attr("data-tipo");
            var nombre_prestador = $(this).attr("data-prestador");

            var objCobroFactura = {
                NroFactura: factura,
                ValorFactura: factura_valor,
                RutPrestador: rut_prestador,
                NombrePrestador: nombre_prestador,
                RutDV: rut_dv,
                TipoDT: tipo_dt
            }
            handleSetFiltroCobro(objCobroFactura);
        });

        $(document).on('click', '.seleccion-modo-cobro', function () {
            $('#btn-cobrar-2').show();
            $('#btn-cobrar-2').addClass('animate__animated animate__fadeIn');
            $('.seleccion-modo-cobro').removeClass('active-menu');
            $(this).addClass('active-menu');

            let modo = $(this).attr('rel');

            var objFiltro = handleGetFiltroCobro();
            if (objFiltro != null) {
                var objCobroFactura = {
                    NroFactura: objFiltro.NroFactura,
                    ValorFactura: objFiltro.ValorFactura,
                    RutPrestador: objFiltro.RutPrestador,
                    NombrePrestador: objFiltro.NombrePrestador,
                    RutDV: objFiltro.RutDV,
                    TipoDT: objFiltro.TipoDT,
                    TipoCobro: modo
                }
            }
            handleSetFiltroCobro(objCobroFactura);

        });

        $(document).on('click', '.check-filtro', function () {

            let tipo = $(this).attr('rel');
            if (tipo == 2) {
                $('#n-cuenta-medica').val('');
                $('#rut-beneficiario').val('');
                $('#rut-beneficiario').attr('disabled', false);
                $('#n-cuenta-medica').attr('disabled', true);
            } else if (tipo == 3) {
                $('#n-cuenta-medica').val('');
                $('#rut-beneficiario').val('');
                $('#n-cuenta-medica').attr('disabled', false);
                $('#rut-beneficiario').attr('disabled', true);
            } else {
                $('#n-cuenta-medica').val('');
                $('#rut-beneficiario').val('');
                $('#rut-beneficiario').attr('disabled', true);
                $('#n-cuenta-medica').attr('disabled', true);
            }

            var objFiltro = handleGetFiltroCobro();
            if (objFiltro != null) {
                var objCobroFactura = {
                    NroFactura: objFiltro.NroFactura,
                    ValorFactura: objFiltro.ValorFactura,
                    RutPrestador: objFiltro.RutPrestador,
                    NombrePrestador: objFiltro.NombrePrestador,
                    RutDV: objFiltro.RutDV,
                    TipoDT: objFiltro.TipoDT,
                    TipoCobro: objFiltro.TipoCobro,
                    FiltroBono: tipo
                }
            }
            handleSetFiltroCobro(objCobroFactura);

            $('#btn-continuar').show();
            $('.contenedorTablaResumen').hide();
            $('#btn-continuar').addClass('animate__animated animate__fadeIn');
        });

    }

    function handleButtonsEvents() {

        $("#btnBuscar").on("click", function (e) {

            handleCobrarFactura.ConsultaFacturasPorCobrar();

        });

        $('#btn-cobrar-1').on("click", function (e) {

            window.location.href = '/CobrarFactura/CobrarFacturaIndex';

        });

        $('#btn-cobrar-2').on("click", function (e) {

            var objFiltro = handleGetFiltroCobro();
            if (objFiltro != null) {
                switch (objFiltro.TipoCobro)
                {
                    case 'bono':
                        window.location.href = '/CobrarFactura/CobrarFacturaBono';
                        break;
                    case 'archivo':
                        window.location.href = '/CobrarFactura/CobrarFacturaArchivo';
                        break;
                    case 'cuenta':
                        window.location.href = '/CobrarFactura/CobrarFacturaCuentaMedica';
                        break;
                }
            }

        });

        $(document).on('click', '#btn-continuar', function (e) {

            var continuar = true;
            var objFiltro = handleGetFiltroCobro();
            if (objFiltro != null) {

                if (objFiltro.FiltroBono == "2" && IsNull(GetInputValue('rut-beneficiario')) == null) {
                    continuar = false;
                    AlertInfo('warning', 'Advertencia', 'Ingrese el RUT del beneficiario antes de continuar');
                }

                if (objFiltro.FiltroBono == "3" && IsNull(GetInputValue('n-cuenta-medica')) == null) {
                    continuar = false;
                    AlertInfo('warning', 'Advertencia', 'Ingrese el N° de la cuenta médica antes de continuar');
                }

                if (continuar) {

                    $(document).on('blur', '#txtRutBeneficiarioFiltro', function (e) {
                        var value = GetInputValue('txtRutBeneficiarioFiltro');
                        if (IsNull(value) != null) {
                            var valid = ValidarRut(value);
                            if (!valid.resultado) {
                                AlertInfo('warning', 'Advertencia', 'EL RUT ingresado no es correcto');
                                SetInputValue('text', 'txtRutBeneficiarioFiltro', '');
                            }
                        }
                    });

                    switch (objFiltro.FiltroBono) {
                        case "1":
                            $('#rbTodosBonos').prop('checked', true);
                            break;
                        case "2":
                            SetInputValue('text', 'txtRutBeneficiarioFiltro', GetInputValue('rut-beneficiario'));
                            break;
                        case "3":
                            SetInputValue('text', 'txtNroCuentaFiltro', GetInputValue('n-cuenta-medica'));
                            break;
                    }

                    $('#lblNroFactura').text(objFiltro.NroFactura);
                    $('#lblValorFactura').text(`$${handleFormato.formatNumber.new(objFiltro.ValorFactura)}`);

                    $('#content-filtro').addClass('animate__animated animate__fadeOutLeft');
                    setTimeout(() => {
                        $('#content-filtro').hide();
                        $('#contenido-filtrado').show();
                        $('#contenido-filtrado').addClass('animate__animated animate__fadeInRight');
                    }, 500);

                    handleCobrarFactura.ConsultaBonosParaCobro();

                }

            }

        });

        $(document).on('click', '#btn-continuar2', function (e) {

            var continuar = true;
            var objFiltro = handleGetFiltroCobro();
            if (objFiltro != null) {

   
                if (continuar) {

      
                    $('#lblNroFactura').text(objFiltro.NroFactura);
                    $('#lblValorFactura').text(`$${handleFormato.formatNumber.new(objFiltro.ValorFactura)}`);

                    $('#content-filtro').addClass('animate__animated animate__fadeOutLeft');
                    setTimeout(() => {
                        $('#content-filtro').hide();
                        $('#contenido-filtrado').show();
                        $('#contenido-filtrado').addClass('animate__animated animate__fadeInRight');
                    }, 500);

                    handleCobrarFactura.ConsultaBonosParaCobro();

                }

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

var handleCobrarFactura = function () {

    function ConsultaFacturasPorCobrar() {
        
        var fecha_inicio = (IsNull(GetInputValue('txtFechaInicio')) == null) ? "" : GetInputValue('txtFechaInicio'),
            fecha_termino = IsNull(GetInputValue('txtFechaTermino')) == null ? "" : GetInputValue('txtFechaTermino'),
            nro_factura = IsNull(GetInputValue('txtNroFactura')) == null ? 0 : GetInputValue('txtNroFactura');

        var params = {
            FechaInicio: fecha_inicio,
            FechaTermino: fecha_termino,
            NroFactura: nro_factura
        }

        EjecutaConsulta.Post(Global.CobrarFacturaController.Name, Global.CobrarFacturaController.ConsultaFacturasPorCobrar, params, false)
            .then(response => {
                if (response.Resultado) {
                    ListaItems = response.Elemento;

                    //ListaItems.push({
                    //    RutPrestador: 78350440,
                    //    DV: '5',
                    //    RazonSocial: '',
                    //    FechaEmision: '01/02/2021 02:15:00',
                    //    TipoDT: 33,
                    //    FolioDT: 61945,
                    //    MontoExento: 0,
                    //    MontoAfecto: 0,
                    //    IVA: 0,
                    //    MontoTotal: 0,
                    //    Descuento: 0
                    //});

                    if (ListaItems.length == 0)
                        $('#btn-cobrar-1').hide();
                }
                else {
                    $('#btn-cobrar-1').hide();
                }
                handleDatatableFacturas.init();
            });
        
    }

    function ConsultaBonosParaCobro() {

        var objFiltro = handlePagesStates.handleGetFiltroCobro();
        if (objFiltro != null) {

            
            var tipo_filtro, valor_filtro = '';
            switch (objFiltro.FiltroBono) {
                case '1':
                    tipo_filtro = 'TODO';
                    break;
                case '2':
                    tipo_filtro = 'RUT';
                    valor_filtro = GetInputValue('txtRutBeneficiarioFiltro');
                    break;
                case '3':
                    tipo_filtro = 'CTA';
                    valor_filtro = GetInputValue('txtNroCuentaFiltro');
                    break;
            }

            var params = {
                RutPrestador: objFiltro.RutPrestador,
                TipoFiltro: tipo_filtro,
                Valor: valor_filtro
            }

            EjecutaConsulta.Post(Global.CobrarFacturaController.Name, Global.CobrarFacturaController.ConsultaBonosParaCobro, params, false)
                .then(response => {
                    if (response.Resultado) {
                        ListaItemsBonos = response.Elemento;
                    }
                    else {
                        AlertInfo('info', 'Información', response.Mensaje);
                    }
                    handleDatatableBonos.init();
                });
            
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

    function ObtieneFacturaPDF(rut, dv, tipo, folio) {

        var params = {
            RutPrestador: rut,
            DV: dv,
            TipoDT: tipo,
            Folio: folio
        }

        EjecutaConsulta.Post(Global.CobrarFacturaController.Name, Global.CobrarFacturaController.ObtieneFacturaPDF, params, false)
            .then(response => {
                
                if (response.Resultado) {
                    if (IsNull(response.Elemento) == null) {
                        AlertInfo('info', 'Información', 'El formato del documento es incorrecto');
                    }
                    else {
                        let a = document.createElement("a");
                        a.href = "data:application/octet-stream;base64," + response.Elemento;
                        a.download = "Factura" + folio +  ".pdf"
                        a.click();
                    }
                }
                else {
                    AlertInfo('info', 'Información', response.Mensaje);
                }

            });

    }

    return {
        ConsultaFacturasPorCobrar: ConsultaFacturasPorCobrar,
        ConsultaBonosParaCobro: ConsultaBonosParaCobro,
        CobrarFacturaBonos: CobrarFacturaBonos,
        ObtieneFacturaPDF: ObtieneFacturaPDF
    }

}();

var handleDatatableFacturas = function () {

    function init() {
        SetColumnsTable(tableHeader)
            .then(res => {
                $('#table-list-head').html(`<tr>${res}</tr>`);
                LlenarData();
            });
    }

    function handleEvents() {

        $(document).on("click", ".VerPDF", function (e) {
            var rut = $(this).attr("data-rut");
            var dv = $(this).attr("data-dv");
            var tipo = $(this).attr("data-tipo");
            var folio = $(this).attr("data-folio");

            handleCobrarFactura.ObtieneFacturaPDF(rut, dv, tipo, folio);
        });

    }

    function LlenarData() {
        if ($.fn.DataTable.isDataTable("#table-list")) {
            $('#table-list').dataTable().fnDestroy();
            $('#table-list-body').html('');
        }

        $.each(ListaItems, function (i, element) {

            var tipo_factura = '';
            switch (element.TipoDT) {
                case 33:
                    tipo_factura = 'Afecta';
                    break;
                case 34:
                    tipo_factura = 'Exenta';
                    break;
            }

            let row = '';
            row += `<tr>
                        <td>
                            <label class="radio-button seleccion-factura" data-id="${element.FolioDT}" 
                                data-valor="${element.MontoTotal}" data-rut="${element.RutPrestador}"
                                data-dv="${element.DV}" data-tipo="${element.TipoDT}" data-prestador="${element.RazonSocial}">
                                <input type="radio" name="radio">
                                <span class="label-visible">
                                    <span class="fake-radiobutton"></span>
                                </span>
                            </label>
                        </td>
                        <td>${element.RutPrestador}-${element.DV}</td>
                        <td>${element.RazonSocial}</td>
                        <td><a href="javascript:void(0);" class="VerPDF" data-rut="${element.RutPrestador}" data-dv="${element.DV}" data-tipo="${element.TipoDT}" data-folio="${element.FolioDT}">${element.FolioDT}</a></td>
                        <td>${moment(element.FechaEmision, 'DD/MM/YYYY HH:mm:ss').format('DD-MM-YYYY')}</td>
                        <td>${tipo_factura}</td>
                        <td>$${handleFormato.formatNumber.new(element.MontoExento)}</td>
                        <td>$${handleFormato.formatNumber.new(element.MontoAfecto)}</td>
                        <td>$${handleFormato.formatNumber.new(element.IVA)}</td>
                        <td>$${handleFormato.formatNumber.new(element.MontoTotal)}</td>
                        <td>$${handleFormato.formatNumber.new(element.Descuento)}</td>
                    </tr>`;

            $('#table-list-body').append(row);
        });

        handleEvents();

        InitDateTableSolicitudes('table-list', [0, 1, 2, 3, 4, 5, 6, 7, 8], false, false, [3, 6, 7, 8, 9, 10], [2], [4]);
    }

    function InitDateTableSolicitudes(tableId, disableColumsOrder = [], pagining = true, enableSearch = true, columns_align_right = [], columns_align_left = [], columns_align_center = [], number_format = [], nuevoRegistro = false) {
        $('#' + tableId).DataTable({
            //paging: pagining,
            //bFilter: enableSearch,
            //"order": [],
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
                //{
                //    orderable: false,
                //    targets: disableColumsOrder != null && disableColumsOrder.length > 0 ? disableColumsOrder : []
                //},
                { className: "text-right", "targets": columns_align_right },
                { className: "text-left", "targets": columns_align_left },
                { className: "text-center", "targets": columns_align_center }
                //{
                //    "render": function (data, type, row) {
                //        return handleFormato.formatNumber.new(data);
                //    },
                //    "targets": number_format
                //}
            ],
            //responsive: true,
            //autoWidth: true,
            //buttons: [],
            //language: Global.DatatableLanguage,
            //bLengthChange: false,
            //dom: Global.DatatableDOM,
            initComplete: function () {

            }
        });

    }

    return {
        init: init
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
                        total_bonos = total_bonos + element.MontoACobrar;
                    }
                });
            }

            if (total_bonos == 0) {
                AlertInfo('warning', 'Advertencia', 'Seleccione al menos un bono');
            }
            else {

                var objFiltro = handlePagesStates.handleGetFiltroCobro();
                if (objFiltro != null) {

                    var total_factura = Number(objFiltro.ValorFactura);

                    if (total_factura != total_bonos)
                        AlertInfo('warning', 'Advertencia', 'La suma de los bonos seleccionados debe ser igual al monto de la factura');
                    else {

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

            }
            
        });

        $("#btnCobrarFacturaModal").click(function () {

            handleCobrarFactura.CobrarFacturaBonos();

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