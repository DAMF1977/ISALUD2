
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
    function GetInputValue(id) {
        return $('#' + id).val();
    }
    function IsNull(value) {
        if (value == '' || value == null || value == undefined || value == NaN || value == 'null') {
            return null;
        }
        else {
            return value;
        }
    }

   


    //Valida un Rut
    function ValidarRut(intlargo) {
        var validacionRut = {
            resultado: false,
            rut: 0,
            dv: ""
        }
        var tmpstr = "";
        var dv = 0;
        var rut = "";
        if (parseInt(intlargo) != 0) {
            if (intlargo.length > 0) {
                let crut = intlargo;
                let largo = crut.length;
                if (largo < 2)
                    return validacionRut;
                var chardv = '';
                for (let i = 0; i < crut.length; i++)
                    if (crut.charAt(i) != ' ' && crut.charAt(i) != '.' && crut.charAt(i) != '-' && !isNaN(parseInt(crut.charAt(i)))) tmpstr = tmpstr + crut.charAt(i);
                    else if (crut.charAt(i).toUpperCase() == 'K')
                        chardv = crut.charAt(i).toUpperCase();
                tmpstr = Number(tmpstr).toString();
                rut = tmpstr + chardv;
                crut = tmpstr + chardv;
                largo = crut.length;
                rut = (largo > 2) ? crut.substring(0, largo - 1) : crut.charAt(0);
                dv = crut.charAt(largo - 1);
                if (rut == null || dv == null)
                    return validacionRut;
                var dvr = '0';
                let suma = 0;
                let mul = 2;
                for (let i = rut.length - 1; i >= 0; i--) {
                    suma = suma + parseInt(rut.charAt(i)) * mul;
                    if (mul == 7)
                        mul = 2;
                    else
                        mul++;
                }
                let res = suma % 11;
                if (res == 1)
                    dvr = 'k';
                else if (res == 0)
                    dvr = '0';
                else {
                    let dvi = 11 - res;
                    dvr = dvi + "";
                }
                if (dvr != dv.toString().toLowerCase())
                    return validacionRut;
                var rut_final = "";
                var num = 0;
                var val = rut.length;
                while (val != 0) {
                    num++;
                    if (num == 3) {
                        rut_final = "" + rut[val - 1] + rut_final;
                        num = 0;
                    }
                    else
                        rut_final = rut[val - 1] + rut_final;
                    val--;
                }
                validacionRut.rut = parseInt(rut_final);
                validacionRut.dv = dv.toString();
                validacionRut.resultado = true;
                if (rut_final == '0-0')
                    return '';
                else
                    return validacionRut;
            }
            else
                return validacionRut;
        }
        else
            return validacionRut;
    }

    //Asigna un valor aun input o combo box
    function SetInputValue(inputType, inputId, inputValue) {
        if (inputType.toLowerCase() == 'text') {
            $(`#${inputId}`).val(inputValue);
        }
        //if (inputType.toLowerCase() == 'select') {
        //    $(`#${inputId}`).val(inputValue).trigger('chosen:updated');
        //}
        //if (inputType.toLowerCase() == 'check') {
        //    $(`#${inputId}`).prop('checked', inputValue == 1 ? true : false)
        //}
    }

    $("#btn-buscar").click(function () {
        if ($('#txtRutBeneficiario').val() == '') {
            handleMensaje.mensajeInfo('Debe ingresar Rut Beneficiario');
            return;
        }

        var value = GetInputValue('txtRutBeneficiario');
            if (IsNull(value) != null) {
                var valid = ValidarRut(value);
                if (!valid.resultado) {
                    handleMensaje.mensajeInfo('EL RUT ingresado no es correcto');
                    SetInputValue('text', 'txtRutBeneficiario', '');
                    return;
                }
            }
    


        CargarBeneficiario();
        $('#resultado-busqueda').show();
        $('#resultado-busqueda').addClass('animate__animated animate__fadeInUp');
    });




    //Funciones
    function CargarBeneficiario() {
        var v_rut = $("#txtRutBeneficiario").val().split('-');

        var _Data = {
            "RutBeneficiario": v_rut[0] //"2410000" //
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
