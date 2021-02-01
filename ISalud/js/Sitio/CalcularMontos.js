var tableHeaderBonos  = [
    { Nombre: `<input id="chkTodos"  width="10px" type="checkbox" name="type" />`, MinWidth: "", MaxWidth: "", ClassName: "text-center" },
    { Nombre: "Nº bono", MinWidth: "", MaxWidth: "", ClassName: "text-left" },
    { Nombre: "Monto bono", MinWidth: "", MaxWidth: "", ClassName: "text-left" },
    { Nombre: "Nº de cuenta médica", MinWidth: "", MaxWidth: "", ClassName: "text-left" },
    { Nombre: "Nº PAM", MinWidth: "", MaxWidth: "", ClassName: "text-left" },
];

var ListaItemsBonos = [];

var checkedBonos = false;


$(function () {

    function handleGetFiltroCobro() {
        var value = localStorage.getItem('objFiltro');
        if (IsNull(value) == null)
            return null
        else
            return $.parseJSON(value);
    }

    function ConsultaBonosParaCobro() {
        var objFiltro = handleGetFiltroCobro();
        if (objFiltro != null) {
          //  console.log('RUT:' + $('#txtRutBeneficiarioFiltro').val());
          //  console.log('CUENTA: ' + $('#txtNroCuentaFiltro').val());


            if ((($('#txtRutBeneficiarioFiltro').val() == '') || ($('#txtRutBeneficiarioFiltro').val() == null))
                && (($('#txtNroCuentaFiltro').val() == '') || ($('#txtNroCuentaFiltro').val() == null))) {

                tipo_filtro = 'TODO';
                valor_filtro = null;
            }
            else if ((($('#txtRutBeneficiarioFiltro').val() != '') || ($('#txtRutBeneficiarioFiltro').val() != null)) &&
                (($('#txtNroCuentaFiltro').val() == '') || ($('#txtNroCuentaFiltro').val() == null))) {

                tipo_filtro = 'RUT';
                valor_filtro = GetInputValue('txtRutBeneficiarioFiltro');
            }
            else if ((($('#txtRutBeneficiario').val() == '') || ($('#txtRutBeneficiario').val() == null)) &&
                (($('#txtNroCuentaFiltro').val() != '') || ($('#txtNroCuentaFiltro').val() != null))) {

                tipo_filtro = 'CTA';
                valor_filtro = GetInputValue('txtNroCuentaFiltro');
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
                    SetColumnsTable(tableHeaderBonos)
                        .then(res => {
                            $('#table-list-head-bonos').html(`<tr>${res}</tr>`);
                            LlenarData();
                        });
                });

        }



        }


    function init() {
        SetColumnsTable(tableHeaderBonos)
            .then(res => {
                $('#table-list-head-bonos').html(`<tr>${res}</tr>`);
                LlenarData();
            });
    }


    $(document).on('change', '#chkTodos', function (e) {

        if (this.checked) {
            if (IsNull(ListaItemsBonos) != null) {
                ListaItemsBonos.map(element => {
                    element.Seleccionado = true;
                });
            }

            checkedBonos = true;
           // handleDatatableBonos.init();
            SetColumnsTable(tableHeaderBonos)
                .then(res => {
                    $('#table-list-head-bonos').html(`<tr>${res}</tr>`);
                    LlenarData();
                });
        }
        else {
            if (IsNull(ListaItemsBonos) != null) {
                ListaItemsBonos.map(element => {
                    element.Seleccionado = false;
                });
            }

            checkedBonos = false;
            SetColumnsTable(tableHeaderBonos)
                .then(res => {
                    $('#table-list-head-bonos').html(`<tr>${res}</tr>`);
                    LlenarData();
                });
            // handleDatatableBonos.init();

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





    $("#btnCancelarModal").click(function () {
        $(".overlay").fadeOut(200);
        event.preventDefault();
    });

    function LlenarData() {
        if ($.fn.DataTable.isDataTable("#table-list-bonos")) {
            $('#table-list-bonos').dataTable().fnDestroy();
            $('#table-list-body-bonos').html('');
        }

        $.each(ListaItemsBonos, function (i, element) {

            var checked = (element.Seleccionado) ? 'checked' : '';
            let row = '';
            row += `<tr>
                        <td width="10">
                            <input class="select-bono" data-id="${element.NumeroBono}" type="checkbox" name="type" ${checked} />
                        </td>
                        <td> <a href="${element.UrlBono}"  target="_blank">${element.NumeroBono}</a></td>
                        <td>$${handleFormato.formatNumber.new(element.MontoACobrar)}</td>
                         <td>${element.NumeroCuentaMedica}</td>
                        <td>${element.NumeroPAM}</td>

                    </tr>`;

            $('#table-list-body-bonos').append(row);
        });

     

        $('.contenedorTablaResumen').show();

        InitDateTableBonos('table-list-bonos', [0, 1], false, false, [3], [], [1, 2]);
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
  
    $(document).on('click', '#btn-filtro', function (e) {

        var value = GetInputValue('txtRutBeneficiarioFiltro');
        if (IsNull(value) != null) {
            var valid = ValidarRut(value);
            console.log(valid);
            if (!valid.resultado) {
                AlertInfo('warning', 'Advertencia', 'EL RUT ingresado no es correcto');
                SetInputValue('text', 'txtRutBeneficiarioFiltro', '');
            }
            else {
                ConsultaBonosParaCobro();
            }

        }
        else {
            ConsultaBonosParaCobro();
        }
   
         

    

    });
});



