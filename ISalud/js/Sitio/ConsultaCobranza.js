var tableHeader = [
    { Nombre: "Nº factura", MinWidth: "", MaxWidth: "", ClassName: "text-left" },
    { Nombre: "Tipo de factura", MinWidth: "", MaxWidth: "", ClassName: "text-left" },
    { Nombre: "Nº de cobranza", MinWidth: "", MaxWidth: "", ClassName: "text-left" },
    { Nombre: "Fecha Ing.Cobranza", MinWidth: "", MaxWidth: "", ClassName: "text-center" },
    { Nombre: "Estado", MinWidth: "", MaxWidth: "", ClassName: "text-left" },
    { Nombre: "Nº Comprobante de egreso", MinWidth: "", MaxWidth: "", ClassName: "text-left" },
    { Nombre: "Fecha pago", MinWidth: "", MaxWidth: "", ClassName: "text-left" },
    { Nombre: "Monto pago", MinWidth: "", MaxWidth: "", ClassName: "text-left" },
    { Nombre: "Forma pago", MinWidth: "", MaxWidth: "", ClassName: "text-left" },
   // { Nombre: "", MinWidth: "", MaxWidth: "", ClassName: "text-left" },
];

var ListaItems = [];


$(function () {

    function handleGetFiltroCobro() {
        var value = localStorage.getItem('objFiltro');
        if (IsNull(value) == null)
            return null
        else
            return $.parseJSON(value);
    }

    function handleGetFiltroPrestadores() {
        var value = localStorage.getItem('objPrestadores');
        if (IsNull(value) == null)
            return null
        else
            return $.parseJSON(value);
    }


    function ConsultaGrilla() {

       // console.log()
     //   var objFiltro = handleGetFiltroCobro();

       // var Prestadores = handleGetFiltroPrestadores();
     
            var fecha_inicio = (IsNull(GetInputValue('txtFechaIni')) == null) ? "" : GetInputValue('txtFechaIni'),
                fecha_termino = IsNull(GetInputValue('txtFechaTermino')) == null ? "" : GetInputValue('txtFechaTermino'),
                nro_factura = IsNull(GetInputValue('txtNroFactura')) == null ? 0 : GetInputValue('txtNroFactura');

            
       // console.log(Prestadores);
        var params = {

        
                "Estado": 1,
                "NroFactura": IsNull(GetInputValue('txtNroFactura')) == null ? 0 : GetInputValue('txtNroFactura'),
                "FechaInicio": (IsNull(GetInputValue('txtFechaIni')) == null) ? "" : GetInputValue('txtFechaIni'), 
                "FechaTermino": (IsNull(GetInputValue('txtFechaTermino')) == null) ? "" : GetInputValue('txtFechaTermino'), 
                "TipoCobro": (IsNull(GetInputValue('cmbTipoCobro')) == null) ? 0 : GetInputValue('cmbTipoCobro'), 
                "NroCobranza": IsNull(GetInputValue('txtNroCobranza')) == null ? 0 : GetInputValue('txtNroCobranza'),
                "EstadoDT": (IsNull(GetInputValue('cmbEstado')) == null) ? 0 : GetInputValue('cmbEstado')
               // FechaInicio: "01/04/2019",
                //FechaTermino: "30/04/2020",
           
                
                //FechaInicio: fecha_inicio,
                //FechaTermino: fecha_termino,
                //NroFactura: nro_factura
                /*ListaRut: args,
               ,
                FechaInicio: "01/04/2020",
                FechaTermino: "30/04/2020",
                NroFactura: 0,
                TipoCobro: 3,
                NroCobranza: 22914
                */
            }

            EjecutaConsulta.Post(Global.ConsultaCobranzaController.Name, Global.ConsultaCobranzaController.CargarGrilla, params, false)
                .then(response => {
                    if (response.Resultado) {
                        ListaItems = response.Elemento;
                    }
                    else {
                        AlertInfo('info', 'Información', response.Mensaje);
                    }
                    SetColumnsTable(tableHeader)
                        .then(res => {
                            $('#table-list-head-principal').html(`<tr>${res}</tr>`);
                            LlenarData();
                        });
                });

        



    }









    function init() {
        SetColumnsTable(tableHeaderBonos)
            .then(res => {
                $('#table-list-head-principal').html(`<tr>${res}</tr>`);
                LlenarData();
            });
    }


    $("#btnCancelarModal").click(function () {
        $(".overlay").fadeOut(200);
        event.preventDefault();
    });

    function LlenarData() {
        if ($.fn.DataTable.isDataTable("#table-list-principal")) {
            $('#table-list-principal').dataTable().fnDestroy();
            $('#table-list-body-principal').html('');
        }

        $.each(ListaItems, function (i, element) {
            console.log(element);
            var checked = (element.Seleccionado) ? 'checked' : '';
            let row = '';
            row += `<tr>
                   
                        <td>${element.FolioDT}</td>
                         <td>${element.DescripcionTipoDT}</td>
                         <td>${element.IdNroCaso}</td>
                         <td>${moment(element.FechaEmision, 'DD/MM/YYYY HH:mm:ss').format('DD-MM-YYYY')}</td>
                         <td>${element.Estado}</td>
                         <td>${element.ComprobanteEgreso.NComprobante}</td>
                         <td>${element.ComprobanteEgreso.FechaPago}</td>
                            <td>$${handleFormato.formatNumber.new(element.ComprobanteEgreso.MontoPago)}</td>
                         <td>${element.ComprobanteEgreso.Formapago}</td>
                                            </tr>`;

            $('#table-list-body-principal').append(row);
        });

        //  <td><a href="#" class="btn-historial"><img src="/img/i-historial.svg"></a></td>


        //$('.contenedorTablaResumen').show();

        InitDateTableBonos('table-list-principal', [0], false, false, [0], [], [0]);
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
               /* if (checkedBonos)
                    $('#chkTodos').attr('checked', true);
                else
                    $('#chkTodos').attr('checked', false);
                    */
            }
        });

    }

  
    $(document).on('click', '#btn-filtro', function (e) {

        ConsultaGrilla();

    });
});

// SETEA VALORES DE DATEPICKER EN ESPAÑOL
function InitDatePickerOptions() {
    $.datepicker.regional['es'] = {
        closeText: 'Cerrar',
        prevText: '< Ant',
        nextText: 'Sig >',
        currentText: 'Hoy',
        monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        dayNames: ['Domingo', 'Lunes', 'Martes', 'Mi\xE9rcoles', 'Jueves', 'Viernes', 'Sábado'],
        dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mi\xE9', 'Juv', 'Vie', 'S\xE1b'],
        dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'S\xE1'],
        weekHeader: 'Sm',
        dateFormat: 'dd/mm/yy',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: ''
    };
    $.datepicker.setDefaults($.datepicker.regional['es']);
}

var startDate = moment().add('-24', 'M').toDate();
var endDate = moment().add('24', 'M').toDate();

$('#txtFechaIni').datepicker({
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
        $('#txtFechaIni').datepicker('option', 'maxDate', fecha);
    }
});

InitDatePickerOptions();
$('#cmbTipoCobro').select2();
$('#cmbEstado').select2();