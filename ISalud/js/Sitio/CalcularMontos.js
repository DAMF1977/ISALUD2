var tableHeaderBonos  = [
    { Nombre: `<input id="chkTodos"  width="10px" type="checkbox" name="type" />`, MinWidth: "", MaxWidth: "", ClassName: "text-center" },
    { Nombre: "Nº bono", MinWidth: "", MaxWidth: "", ClassName: "text-left" },
    { Nombre: "Monto bono", MinWidth: "", MaxWidth: "", ClassName: "text-left" },
    { Nombre: "Nº de cuenta médica", MinWidth: "", MaxWidth: "", ClassName: "text-left" },
    { Nombre: "Nº PAM", MinWidth: "", MaxWidth: "", ClassName: "text-left" },
];



var ListaItemsBonos = [];

var checkedBonos = false;



function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
}

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
$(function () {

    $("#txtRutBeneficiarioFiltro").rut({ formatOn: 'keyup' });
    $("#btnExportar").click(function () {

        var vSel = false;

        var a = document.createElement('a');
        var data_type = 'data:application/vnd.ms-excel';

        var nombre = makeid(5);
        var tab_text = "<table id='" + nombre + "' style='display: none'>";
        tab_text = tab_text + "<tr><td> Nro.Bono</td></tr>";
        ListaItemsBonos.map(element => {
            if (element.Seleccionado) {
                tab_text = tab_text + "<tr><td>"+ element.NumeroBono + "</td></tr>";
            
                vSel = true;
            }
     
        });


        if (vSel == false) {
            AlertInfo('info', 'Información', 'Debe seleccionar al menos una fila');
            return false;

        }
        tab_text = tab_text + "</table>";
        tab_text = tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
        tab_text = tab_text.replace(/<img[^>]*>/gi, ""); // remove if u want images in your table
        tab_text = tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params
        var menu = document.createElement('div');
        console.log(tab_text);
        menu.id = nombre;
        menu.innerHTML = tab_text;
        document.body.appendChild(menu);
        

        //document.body.innerHTML += tab_text;




        var wb = XLSX.utils.table_to_book(document.getElementById(nombre), {sheet:"Sheet JS"});
        var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary'});

        saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), 'BonosExcel.xlsx');
        
        
    });

      /*  var ua = window.navigator.userAgent;
        var msie = ua.indexOf("MSIE ");

        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
        {
            txtArea1.document.open("txt/html", "replace");
            txtArea1.document.write(tab_text);
            txtArea1.document.close();
            txtArea1.focus();
            sa = txtArea1.document.execCommand("SaveAs", true, "Say Thanks to Sumit.xls");
        }
        else                 //other browser not tested on IE 11
            //sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text) );
            //sa = window.open('data:application/vnd.ms-excel,filename=ExcelBonos.xls,' + encodeURIComponent(tab_text));
            a.href = data_type + ', ' + tab_text;
        a.download = 'BonosExcel.xls';
        //triggering the function
        a.click();
        //just in case, prevent default behaviour
        //e.preventDefault();
        //return (sa);
   
    });

     */

    function fnExcelReport() {


  



        var tab_text = "<table>";
        var textRange; var j = 0;
        tab = document.getElementById('table-list-bonos'); // id of table

        for (j = 0; j < tab.rows.length; j++) {
            tab_text = tab_text + tab.rows[j].innerHTML + "</tr>";
            //tab_text=tab_text+"</tr>";
        }

        tab_text = tab_text + "</table>";
        tab_text = tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
        tab_text = tab_text.replace(/<img[^>]*>/gi, ""); // remove if u want images in your table
        tab_text = tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params

        var ua = window.navigator.userAgent;
        var msie = ua.indexOf("MSIE ");

        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
        {
            txtArea1.document.open("txt/html", "replace");
            txtArea1.document.write(tab_text);
            txtArea1.document.close();
            txtArea1.focus();
            sa = txtArea1.document.execCommand("SaveAs", true, "Say Thanks to Sumit.xls");
        }
        else                 //other browser not tested on IE 11
            sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));

        return (sa);
       
    }


    function handleGetFiltroCobro() {
        var value = localStorage.getItem('objFiltro');
        if (IsNull(value) == null)
            return null
        else
            return $.parseJSON(value);
    }

    function ConsultaBonosParaCobro() {
        //var objFiltro = handleGetFiltroCobro();
       // if (objFiltro != null) {
          //  console.log('RUT:' + $('#txtRutBeneficiarioFiltro').val());
          //  console.log('CUENTA: ' + $('#txtNroCuentaFiltro').val());


            if ((($('#txtRutBeneficiarioFiltro').val() == '') || ($('#txtRutBeneficiarioFiltro').val() == null))
                && (($('#txtNroCuentaFiltro').val() == '') || ($('#txtNroCuentaFiltro').val() == null))) {

                tipo_filtro = 'TODO';
                valor_filtro = null;
            }
            else if ((($('#txtRutBeneficiarioFiltro').val() != '') || ($('#txtRutBeneficiarioFiltro').val() != null)) &&
                (($('#txtNroCuentaFiltro').val() == '') || ($('#txtNroCuentaFiltro').val() == null))) {

                var rut_beneficiaro = GetInputValue('txtRutBeneficiarioFiltro');
                rut_beneficiaro = rut_beneficiaro.split('.').join('');
                var partes_rut = rut_beneficiaro.split('-');

                tipo_filtro = 'RUT';
                valor_filtro = partes_rut[0];
            }
            else if ((($('#txtRutBeneficiario').val() == '') || ($('#txtRutBeneficiario').val() == null)) &&
                (($('#txtNroCuentaFiltro').val() != '') || ($('#txtNroCuentaFiltro').val() != null))) {

                tipo_filtro = 'CTA';
                valor_filtro = GetInputValue('txtNroCuentaFiltro');
            }


            var params = {
                RutPrestador: "60910000",
                TipoFiltro: tipo_filtro,
                Valor: valor_filtro
            }
            console.log(params);
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
                            $("#lblTotalSumaBonos").text(`$${handleFormato.formatNumber.new(0)}`);
                            LlenarData();
                        });
                });

       // }



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

        if (IsNull(ListaItemsBonos) == null) {
            $('#chkTodos').removeClass('checkbox-body');
            $('#chkTodos').addClass('checkbox-head');
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
            },
            dom: 'Bfrtip',
            buttons: [
                'copy', 'csv', 'excel', 'pdf', 'print'
            ]
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

        ConsultaBonosParaCobro();
        /*
        var value = GetInputValue('txtRutBeneficiarioFiltro');
        if (IsNull(value) != null) {
            var valid = ValidarRut(value);
            console.log(value);
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
        */
   
         

    

    });

    //EXCEL
    $(document).on('click', '#btn-filtro', function (e) {



    });

});



