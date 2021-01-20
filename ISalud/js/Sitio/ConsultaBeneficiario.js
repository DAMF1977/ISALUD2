
var handleMensaje = {

    mensajeInfo: function (mensaje) {

        //var types = type;

        //$.each(types, function (index, type) {

        swal({
            title: 'Información',
            text: mensaje,
            type: 'warning',
            buttonsStyling: true,
            confirmButtonColor: "#FF0000"
        });


        //});
    },
    mensajeError: function (mensaje, type) {

        //var types = type;

        //$.each(types, function (index, type) {
        swal({
            title: 'Error',
            text: mensaje,
            type: 'warning',
            buttonsStyling: true,
            confirmButtonColor: "#FF0000"
        });
        //});
    },
    mensajeExito: function (mensaje) {

        //var types = type;

        //$.each(types, function (index, type) {
        swal({
            title: 'Mensaje',
            text: mensaje,
            type: 'warning',
            buttonsStyling: true,
            confirmButtonColor: "#FF0000"
        });
        //});
    },
    mensajeConfirmacion: function (mensaje, callback) {
        //var types = type;

        //$.each(types, function (index, type) {
        swal({
            title: 'Mensaje',
            text: mensaje,
            type: 'warning',
            buttonsStyling: true,
            confirmButtonColor: "#FF0000"
        });
        //});
    },

    mensajeConfirmation: function (mensaje, callback) {
        swal({
            title: "Mensaje",
            text: mensaje,
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "btn-danger",
            confirmButtonText: "Si, Ejecutar!",
            cancelButtonText: "No, Cancelar!",
            closeOnConfirm: false,
            closeOnCancel: false
        },
            function (isConfirm) {
                if (callback !== undefined)
                    callback(isConfirm);
                //if (isConfirm) {
                //    swal("Deleted!", "Your imaginary file has been deleted.", "success");
                //} else {
                //    swal("Cancelled", "Your imaginary file is safe :)", "error");
                //}
            });
    }
}



$(document).ready(function () {
    //#region SECCION POR DEFECTO COMPONENTE DATATABLES
    var dataTableButtons = '<div class="dataTables_buttons hidden-sm-down actions">' +
        '<span class="actions__item zmdi zmdi-print" data-table-action="print" />' +
        '<span class="actions__item zmdi zmdi-fullscreen" data-table-action="fullscreen" />' +
        '<div class="dropdown actions__item">' +
        '<i data-toggle="dropdown" class="zmdi zmdi-download" />' +
        '<ul class="dropdown-menu dropdown-menu-right">' +
        '<a href="" class="dropdown-item" data-table-action="excel">Excel (.xlsx)</a>' +
        '</ul>' +
        '</div>' +
        '</div>';
    moment.locale('es');
    $("#btn-buscar").click(function () {
        if ($('#txtRutBeneficiario').val() == '') {
            handleMensaje.mensajeInfo('Debe ingresar Rut Beneficiario');
            return;
        }
        CargarBeneficiario();
        $('#resultado-busqueda').show();
        $('#resultado-busqueda').addClass('animate__animated animate__fadeInUp');
    });




    //Funciones
    function CargarBeneficiario() {

        var _Data = {
            "RutBeneficiario": $("#txtRutBeneficiario").val() //"2410000" //
        }
        var v_url = "/ConsultaBeneficiario/Get";
        console.log(v_url);
        // console.log(_Data);
        $.ajax({
            type: "POST",
            url: v_url,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(_Data),
            dataType: 'json',
            beforeSend: function () {
                $('.page-loader').fadeIn();
            },
            complete: function () {
                $('.page-loader').fadeOut();
            },
            success: function (response) {


                $('#txtNombre').html(response.aaData.Nombre);
                if (response.aaData.Rut == '') {
                    $('#txtRut').html('');
                }
                else {
                    $('#txtRut').html(response.aaData.Rut + '-' + response.aaData.Dv);
                }
                $('#txtTipoBeneficiario').html(response.aaData.Tipo);
                $('#txtPlanSalud').html(response.aaData.PlanCodigo);
                $('#txtIsapre').html(response.aaData.Isapre);
                $('#txtPlanPotrerillo').html("");
                $('#txtFechaInicio').html(response.aaData.InicioVigencia);

                $('#resultado-busqueda').change();


                console.log(response);

            },
            error: function (xhr, status, error) {
                swal({
                    title: 'Error',
                    text: xhr.responseText,
                    type: 'warning',
                    buttonsStyling: true,
                    confirmButtonColor: "#FF0000"
                })
            }
        });

    };



});
