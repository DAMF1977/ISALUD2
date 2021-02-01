﻿var Global = {
    CobrarFacturaController: {
        Name: 'CobrarFactura',
        ConsultaFacturasPorCobrar: 'ConsultaFacturasPorCobrar',
        ConsultaBonosParaCobro: 'ConsultaBonosParaCobro',
        CobrarFacturaBonos: 'CobrarFacturaBonos'
    },
    CalcularMontosController: {
        Name: 'CalcularMontos',
        ConsultaBonosParaCobro: 'ConsultaBonosParaCobro'
    },
   ConsultaCobranzaController: {
        Name: 'ConsultaCobranza',
       CargarGrilla: 'CargarGrilla'
    },
    FormatoFecha: 'DD/MM/YYYY'
}

//Función que abre el modal de carga de transacciones
$(function () {
    $('.loading').hide();

    window.ajax_loading = false;
    $.hasAjaxRunning = function () {
        ShowLoading();
    };
    $(document).ajaxStart(function () {
        ShowLoading();
    });
    $(document).ajaxStop(function () {
        CloseLoading();
    });

    $(document).on('focus', ':input', function () {
        $(this).attr('autocomplete', 'off');
    }).on('paste drop', ':input', function () {
        return false;
    });

    handleFunctions.Init();
});

//Función que cierra el modal de carga de transacciones
function ShowLoading() {
    $('.loading').show();
}

//Función que cierre el modal de carga de transacciones
function CloseLoading() {
    $('.loading').hide();
}

//Función que renderiza los nombres de las columnas de encabezado de un datatable pasado por parametro
function SetColumnsTable(headerTable = []) {
    return new Promise(resolve => {
        var columns = "";
        headerTable.forEach((element, index) => {
            element.Id = element.Id ? element.Id : '';
            columns += `<th style="min-width: ${element.MinWidth}px !important; max-width: ${element.MaxWidth}px !important;" class="${element.Id}${element.ClassName}">${element.Nombre}</th>`;
            if (index == headerTable.length - 1)
                resolve(`<tr>${columns}</tr>`);
        });
    });
}

//Objeto que provee de metodos para realizar peticiones get y post a los metodos en los controladores
var EjecutaConsulta = function () {
    return {
        Post: function (controller, action, params = null, showMessage = true) {
            ShowLoading();
            return new Promise(resolve => {

                $.ajax({
                    type: 'POST',
                    url: `/${controller}/${action}`,
                    data: JSON.stringify({ data: params }),
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    success: res => {
                        if (res) {
                            if (!res.EsError) {
                                resolve(res);
                            }
                            else {
                                AlertInfo('error', 'Error', res.Mensaje);
                            }
                        }
                    },
                    error: (xhr, ajaxOptions, thrownError) => {
                        let tipoAlerta = null;
                        if (xhr.status == 404) tipoAlerta = 'warning';
                        if (xhr.status == 500 || xhr.status == 400 || xhr.status == 401) tipoAlerta = 'error';
                        if (showMessage || xhr.status == 400 || xhr.status == 500) {
                            AlertInfo(tipoAlerta ? tipoAlerta : 'error', 'Error', xhr.responseText);
                        }
                        CloseLoading();
                        resolve(false);
                    }
                });

            });
        },
        Get: function (controller, action, showMessage = true) {
            ShowLoading();
            return new Promise(resolve => {

                $.ajax({
                    type: 'GET',
                    url: `/${controller}/${action}`,
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    success: res => {
                        if (res) {
                            if (!res.EsError) {
                                resolve(res);
                            }
                            else {
                                AlertToast('error', res.Mensaje);
                            }
                        }
                    },
                    error: (xhr, ajaxOptions, thrownError) => {
                        let tipoAlerta = null;
                        if (xhr.status == 404) tipoAlerta = 'warning';
                        if (xhr.status == 500 || xhr.status == 400 || xhr.status == 401) tipoAlerta = 'error';
                        if (showMessage || xhr.status == 400 || xhr.status == 500) {
                            AlertToast(tipoAlerta ? tipoAlerta : 'error', 'error', xhr.responseText);
                        }
                        CloseLoading();
                        resolve(false);
                    }
                });

            });
        }
    }
}();

//Muestra una alerta donde los tipos son: success, error, info y warning
function AlertInfo(type, title, message) {
    swal({
        title: title,
        text: message,
        type: type
    });
}

//Objeto de funciones que inicia distintas funciones para el formateo de campos cuando se leen sus datos
var handleFormato = function () {
    return {
        formatNumber: {
            separador: ".", // separador para los miles
            sepDecimal: ',', // separador para los decimales
            formatear: function (num) {
                num += '';
                var splitStr = num.split('.');
                var splitLeft = splitStr[0];
                var splitRight = splitStr.length > 1 ? this.sepDecimal + splitStr[1] : '';
                var regx = /(\d+)(\d{3})/;
                while (regx.test(splitLeft)) {
                    splitLeft = splitLeft.replace(regx, '$1' + this.separador + '$2');
                }
                return this.simbol + splitLeft + splitRight;
            },
            new: function (num, simbol) {
                this.simbol = simbol || '';
                return this.formatear(num);
            }
        }
    }
}();

//Obtiene el valor de un input
function GetInputValue(id) {
    return $('#' + id).val();
}

///Función que retorna nulo en caso de que el objeto no tenga valor o sea indefinido
function IsNull(value) {
    if (value == '' || value == null || value == undefined || value == NaN || value == 'null') {
        return null;
    }
    else {
        return value;
    }
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

//Objeto de funciones que inicia distintas funciones para el formateo de campos al inputar valores en ellos
var handleFunctions = function () {

    function FormatAmountMiles(value) {
        var n = value.toString().split(",");
        n[0] = n[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");

        return n.join(",");
    }

    return {
        Init: function () {

            $('.FormatAmount').on('input', function (e) {
                var beforeDecimal = 10, afterDecimal = 2;
                var precision = $(this).attr("data-precision");
                if (IsNull(precision) != null) {
                    var array = precision.split(",");
                    beforeDecimal = parseInt(array[0]);
                    afterDecimal = parseInt(array[1]);
                }
                this.value = this.value
                    .replace(/[^\d,]/g, '')
                    .replace(new RegExp("(^[\\d]{" + beforeDecimal + "})[\\d]", "g"), '$1')
                    .replace(/(\,,*)\,/g, '$1')
                    .replace(new RegExp("(\\,[\\d]{" + afterDecimal + "}).", "g"), '$1');

                this.value = FormatAmountMiles(this.value);

            }).on("keypress keyup blur", function (e) {
                if ((event.which != 44 || $(this).val().indexOf(',') != -1) && (event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
                    event.preventDefault();
                }
            });

            $('.FormatNumber').on('input', function (e) {
                var beforeDecimal = 10;
                var precision = $(this).attr("data-precision");
                if (IsNull(precision) != null) {
                    var array = precision.split(",");
                    beforeDecimal = parseInt(array[0]);
                    afterDecimal = parseInt(array[1]);
                }
                this.value = this.value
                    .replace(/[^\d]/g, '')
                    .replace(new RegExp("(^[\\d]{" + beforeDecimal + "})[\\d]", "g"), '$1');

            }).on("keypress keyup blur", function (e) {
                if ((event.which != 44 || $(this).val().indexOf(',') != -1) && (event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
                    event.preventDefault();
                }
            });

            $('.input-locked').on("keypress keyup blur", function (e) {
                event.preventDefault();
            });


        }
    }

}();

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