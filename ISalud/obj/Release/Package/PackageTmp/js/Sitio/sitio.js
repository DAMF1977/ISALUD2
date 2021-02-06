
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
        },
        limpiaNumero: function (elem) {

            var maxl = parseInt(elem.attr("maxlength"));
            var subida = parseInt(maxl / 4);
            elem.attr("maxlength", maxl - subida);
            elem.val(elem.val().split(".").join(''));

        },
        formateaNumero: function (elem) {

            var maxl = parseInt(elem.attr("maxlength"));
            var subida = parseInt(maxl / 3);
            elem.attr("maxlength", maxl + subida);
            elem.val(handleFormato.formatNumber.new(elem.val()));

        },
        modificaLength: function (elem) {

            var maxl = parseInt(elem.attr("maxlength"));
            var subida = parseInt(maxl / 3);
            elem.attr("maxlength", maxl + subida);

        },
        init: function () {

            $.each($("[data-formatear]"), function () {
                handleFormato.modificaLength($(this));
            })

            $("[data-formatear]").on('focus', function () {

                var elem = $(this);
                if (elem.attr("data-formatear") == "numero") {
                    handleFormato.limpiaNumero(elem);
                }


            });

            $("[data-formatear]").on('blur', function () {

                var elem = $(this);
                if (elem.attr("data-formatear") == "numero") {
                    handleFormato.formateaNumero(elem);
                }


            });

        },
        recargar: function () {

            var datos = $("[data-formatear]");

            $.each(datos, function () {
                var elem = $(this);
                if (elem.attr("data-formatear") == "numero") {
                    $(this).val(handleFormato.formatNumber.new($(this).val()));
                }
            });

        }
    }
}();

var handleUtilidades = function () {
    function llenarComboDataEspecial(id, datos, key, value, valor1, valor2, valor3, valor4, afectaOrden, texto, callback) {
        if (afectaOrden === undefined)
            afectaOrden = true;

        if (afectaOrden) {
            datos = datos.sort(function (a, b) {
                if (a[value] > b[value])
                    return 1;
                if (a[value] < b[value])
                    return -1;

                return 0;
            });
        }

        $('#' + id).each(function (e, i) {
            var cmb = $(this)
            cmb.empty();
            if (cmb.children('option').length == 0) {
                //debugger;
                if (texto.length > 0)
                    cmb.append("<option value=''>" + texto + "</option>");


                $.map(datos, function (item) {
                    cmb.append(
                        $('<option>', {
                            value: item[key],
                            text: item[value],
                            'data-valor1': item[valor1],
                            'data-valor2': item[valor2],
                            'data-valor3': item[valor3],
                            'data-valor4': item[valor4],
                        }, '</option>'));

                });
            }
        });

        if (callback !== undefined)
            callback();
    }

    function llenarComboDataExcluye(id, datos, key, value, valor1, valor2, afectaOrden, texto, Excluye, callback) {
        if (afectaOrden === undefined)
            afectaOrden = true;

        if (afectaOrden) {
            datos = datos.sort(function (a, b) {
                if (a[value] > b[value])
                    return 1;
                if (a[value] < b[value])
                    return -1;

                return 0;
            });
        }

        $('#' + id).each(function (e, i) {
            var cmb = $(this)
            cmb.empty();
            if (cmb.children('option').length == 0) {
                //debugger;
                if (texto.length > 0)
                    cmb.append("<option value=''>" + texto + "</option>");


                $.map(datos, function (item) {
                    var Codigo = ',' + item[key] + ',';
                    if (Codigo.indexOf(Excluye) == -1) {
                        if ((valor1.length > 0) && (valor2.length > 0)) {
                            cmb.append(
                                $('<option>', {
                                    value: item[key],
                                    text: item[value],
                                    'data-monto': item[valor1],
                                    'data-dsc': item[valor2]
                                }, '</option>'));
                        } else {
                            cmb.append(
                                $('<option>', {
                                    value: item[key],
                                    text: item[value]
                                }, '</option>'));
                        }
                    }

                });
            }
        });

        if (callback !== undefined)
            callback();
    }

    function llenarComboDataTodos(id, datos, key, value, afectaOrden, texto, callback) {
        if (afectaOrden === undefined)
            afectaOrden = true;

        if (afectaOrden) {
            datos = datos.sort(function (a, b) {
                if (a[value] > b[value])
                    return 1;
                if (a[value] < b[value])
                    return -1;

                return 0;
            });
        }

        $('#' + id).each(function (e, i) {
            var cmb = $(this)
            cmb.empty();
            if (cmb.children('option').length == 0) {
                console.log(texto);
                if (texto.length > 0)
                    cmb.append(
                        $('<option>', {
                            value: " ",
                            text: texto
                        }, '</option>'));

                $.map(datos, function (item) {
                    cmb.append(
                        $('<option>', {
                            value: item[key],
                            text: item[value]
                        }, '</option>'));
                });
            }
        });

        if (callback !== undefined)
            callback();
    }

    function llenarComboDataVacio(id, datos, key, value, afectaOrden, callback) {

        if (afectaOrden === undefined)
            afectaOrden = true;

        if (afectaOrden) {
            datos = datos.sort(function (a, b) {
                if (a[value] > b[value])
                    return 1;
                if (a[value] < b[value])
                    return -1;

                return 0;
            });
        }

        $('#' + id).each(function (e, i) {
            var cmb = $(this)
            cmb.empty();

            if (cmb.children('option').length == 0) {
                cmb.append("<option value=''>Seleccionar Registro</option>");
                $.map(datos, function (item) {
                    cmb.append(
                        $('<option>', {
                            value: item[key],
                            text: item[value]
                        }, '</option>'));
                });
            }
        });

        if (callback !== undefined)
            callback();
    }

    function llenarComboData(id, datos, key, value, afectaOrden, callback) {

        if (afectaOrden === undefined)
            afectaOrden = true;

        if (afectaOrden) {
            datos = datos.sort(function (a, b) {
                if (a[value] > b[value])
                    return 1;
                if (a[value] < b[value])
                    return -1;

                return 0;
            });
        }

        $('#' + id).each(function (e, i) {
            var cmb = $(this)
            cmb.empty();




            if (cmb.children('option').length == 0) {
                cmb.append("<option value='0'>Seleccionar Registro</option>");
                $.map(datos, function (item) {
                    cmb.append(
                        $('<option>', {
                            value: item[key],
                            text: item[value]
                        }, '</option>'));
                });
            }
        });

        if (callback !== undefined)
            callback();
    }

    function llenarComboDataSeleccione(id, datos, key, value, afectaOrden, callback) {

        if (afectaOrden === undefined)
            afectaOrden = true;

        if (afectaOrden) {
            datos = datos.sort(function (a, b) {
                if (a[value] > b[value])
                    return 1;
                if (a[value] < b[value])
                    return -1;

                return 0;
            });
        }

        $('#' + id).each(function (e, i) {
            var cmb = $(this)
            cmb.empty();
            if (cmb.children('option').length == 0) {
                cmb.append(
                    $('<option>', {
                        value: "-1",
                        text: "Seleccione"
                    }, '</option>'));

                $.map(datos, function (item) {
                    cmb.append(
                        $('<option>', {
                            value: item[key],
                            text: item[value]
                        }, '</option>'));
                });
            }
        });

        if (callback !== undefined)
            callback();
    }

    function validarRut(intlargo) {

        var validacionRut = {
            resultado: false,
            rutFormateado: ""
        }

        var tmpstr = "";

        var dv = 0;
        var rut = "";
        if (parseInt(intlargo) != 0) {
            if (intlargo.length > 0) {
                crut = intlargo;
                largo = crut.length;

                if (largo < 2)
                    return validacionRut;

                var chardv = '';
                for (i = 0; i < crut.length; i++)
                    if (crut.charAt(i) != ' ' && crut.charAt(i) != '.' && crut.charAt(i) != '-' && !isNaN(parseInt(crut.charAt(i)))) tmpstr = tmpstr + crut.charAt(i);
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
                suma = 0;
                mul = 2;

                for (i = rut.length - 1; i >= 0; i--) {
                    suma = suma + rut.charAt(i) * mul;
                    if (mul == 7)
                        mul = 2;
                    else
                        mul++;
                }

                res = suma % 11;
                if (res == 1)
                    dvr = 'k';
                else if (res == 0)
                    dvr = '0';
                else {
                    dvi = 11 - res;
                    dvr = dvi + "";
                }

                if (dvr != dv.toLowerCase())
                    return validacionRut;

                var rut_final = "";
                var num = 0;
                var val = rut.length;
                while (val != 0) {
                    num++;
                    if (num == 3) {
                        rut_final = "." + rut[val - 1] + rut_final;
                        num = 0;
                    }
                    else
                        rut_final = rut[val - 1] + rut_final;
                    val--;
                }
                validacionRut.rutFormateado = rut_final = rut_final + "-" + dv;
                validacionRut.resultado = true;

                return validacionRut;
            }
            else
                return validacionRut;
        }
        else
            return validacionRut;
    }

    function convierteAfecha(cadenaFecha) {

        var arregloFecha = cadenaFecha.split("/");
        var anio = arregloFecha[2];
        var mes = arregloFecha[1] - 1;
        var dia = arregloFecha[0];

        var fecha = new Date(anio, mes, dia);

        return fecha;
    }

    return {
        llenarComboDataEspecial: llenarComboDataEspecial,
        llenarComboDataTodos: llenarComboDataTodos,
        llenarComboDataExcluye: llenarComboDataExcluye,
        llenarComboVacio: llenarComboDataVacio,
        llenarComboItems: llenarComboData,
        llenarCombo: function (id, datos, key, value, afectaOrden) {

            llenarComboDataSeleccione(id, datos, key, value, afectaOrden, function () {

                $('#' + id).val('-1').selectpicker();

            });
        },
        llenarComboMultiple: function (id, datos, key, value, afectaOrden) {

            llenarComboData(id, datos, key, value, afectaOrden, function () {

                $('#' + id).attr("multiple", "");
                $('#' + id).attr("data-size", "10");
                $('#' + id).attr("title", "Seleccione");
                $('#' + id).val('').selectpicker();

            });

        },
        selectpickerEnable: function (selector) {

            $(selector).prop("disabled", false);
            $(selector).selectpicker('refresh');

        },
        selectpickerDisable: function (selector) {

            $(selector).prop("disabled", true);
            $(selector).selectpicker('refresh');

        },
        llenarComboAutocompletarSimple: function (id, datos, key, value, afectaOrden) {

            llenarComboDataSeleccione(id, datos, key, value, afectaOrden, function () {

                $('#' + id).attr("data-live-search", "true");
                $('#' + id).attr("data-size", "10");
                $('#' + id).attr("title", "Seleccione");
                $('#' + id).selectpicker("val", "-1");

            });

        },
        formatoFecha: function (fecha) {
            return (fecha._isAMomentObject) ? fecha.parseZone(initApp.zonaHoraria).format('DD/MM/YYYY') :
                moment.parseZone(fecha + initApp.zonaHoraria).format('DD/MM/YYYY');
        },
        formatoHora: function (fecha) {
            return moment.parseZone(fecha + initApp.zonaHoraria).format('HH:mm');
        },
        calculaEdad: function (fechaNacimiento) {

            var edadExacta = {
                anios: "",
                meses: "",
                dias: ""
            }

            if (fechaNacimiento != "") {

                var partes = fechaNacimiento.split('/');

                var dia = partes[0];
                var mes = partes[1];
                var ano = partes[2];

                //var fecha_Actual = moment(moment.now()).format('DD/MM/YYYY');
                //var fecha_Actual = moment.parseZone(moment($("#fechaActual").val(), 'DD/MM/YYYY HH:mm').toDate() + initApp.zonaHoraria).format('DD/MM/YYYY');
                //var fecha_Actual = $("#fechaActual").val().split(" ")[0];
                var fecha_hoy = ($("#fechaActual").val().split(' ')[0].split('-').length > 1) ? $("#fechaActual").val().split(' ')[0].split('-') : $("#fechaActual").val().split(' ')[0].split('/');

                var ahora_ano = fecha_hoy[2];
                var ahora_mes = fecha_hoy[1];
                var ahora_dia = fecha_hoy[0];
                var anio = ahora_ano - ano;

                if (ahora_mes < (mes - 1)) {
                    anio--;
                }
                if (((mes - 1) == ahora_mes) && (ahora_dia < dia)) {
                    anio--;
                }

                var meses = 0;

                if (ahora_mes > mes)
                    meses = ahora_mes - mes;
                if (ahora_mes < mes)
                    meses = 12 - (mes - ahora_mes);
                if (ahora_mes == mes && dia > ahora_dia)
                    meses = 11;

                var dias = 0;

                if (ahora_dia > dia)
                    dias = ahora_dia - dia;
                if (ahora_dia < dia) {
                    ultimoDiaMes = new Date(ahora_ano, ahora_mes, 0);
                    dias = ultimoDiaMes.getDate() - (dia - ahora_dia);
                }

                edadExacta.anios = anio;
                edadExacta.meses = meses;
                edadExacta.dias = dias;

            }
            return edadExacta;

        },
        ajustaString: function (cadena, lenUsu) {

            if (lenUsu == null || lenUsu === undefined)
                lenUsu = 50;

            if (cadena == "" || cadena == null || cadena === undefined)
                return "";

            if (cadena.length <= lenUsu)
                return cadena;

            if (cadena.length > lenUsu) {
                var len = (cadena.length <= lenUsu) ? cadena.length : lenUsu;
                return cadena.substring(0, len - 3) + '...';
            }


        },
        validarRut: validarRut,
        convierteAfecha: convierteAfecha,
        llenarComboMultipleTodas: function (id, datos, key, value, afectaOrden) {

            llenarComboData(id, datos, key, value, afectaOrden, function () {

                $('#' + id).attr("multiple", "");
                $('#' + id).attr("data-size", "10");
                $('#' + id).attr("title", "Todas");
                $('#' + id).val('').selectpicker();

            });

        },
        llenarComboMultipleTodos: function (id, datos, key, value, afectaOrden) {

            llenarComboData(id, datos, key, value, afectaOrden, function () {

                $('#' + id).attr("multiple", "");
                $('#' + id).attr("data-size", "10");
                $('#' + id).attr("title", "Todos");
                $('#' + id).val('').selectpicker();

            });

        }
    }

}();



function GeneralSettings() {

    var handleRenderSwitcher = function () {

        $(".switchery").attr("data-size", "small");
        $(".switchery").attr("data-on", "Sí");
        $(".switchery").attr("data-off", "No");
        $(".switchery").bootstrapToggle();

        $('[data-toggle="buttons"]').on("click", function (ev) {

            if ($(this).children('label').hasClass('disabled')) {
                ev.stopPropagation();
            }
        })

    };

    var handleDataTableSettings = function () {

        var lenguaje = {
            "sProcessing": "Procesando...",
            "sLengthMenu": "Mostrar _MENU_ registros",
            "sZeroRecords": "No se encontraron resultados",
            "sEmptyTable": "Sin registros",
            "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
            "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
            "sInfoPostFix": "",
            "sSearch": "Buscar:",
            "sUrl": "",
            "sInfoThousands": ",",
            "sLoadingRecords": "Cargando...",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Último",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            },
            "oAria": {
                "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            }
        }

        jQuery.extend(jQuery.fn.dataTableExt.oSort, {
            "fecha-asc": function (a, b) {
                var ukDatea = a.split('/');
                var ukDateb = b.split('/');

                var x = (ukDatea[2] + ukDatea[1] + ukDatea[0]) * 1;
                var y = (ukDateb[2] + ukDateb[1] + ukDateb[0]) * 1;

                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            },

            "fecha-desc": function (a, b) {
                var ukDatea = a.split('/');
                var ukDateb = b.split('/');

                var x = (ukDatea[2] + ukDatea[1] + ukDatea[0]) * 1;
                var y = (ukDateb[2] + ukDateb[1] + ukDateb[0]) * 1;

                return ((x < y) ? 1 : ((x > y) ? -1 : 0));
            },

            "numeric-comma-pre": function (a) {
                var z = a.toString().split('.').join('');
                z = z.replace(/,/, ".");
                return parseFloat(z);
            },

            "numeric-comma-asc": function (a, b) {
                return ((a < b) ? -1 : ((a > b) ? 1 : 0));
            },

            "numeric-comma-desc": function (a, b) {
                return ((a < b) ? 1 : ((a > b) ? -1 : 0));
            },

            "fraccion-asc": function (c1, c2) {

                var p1 = c1.split("/");
                var res1 = parseFloat(parseInt(p1[0]) / parseInt(p1[1]));
                var p2 = c2.split("/");
                var res2 = parseFloat(parseInt(p2[0]) / parseInt(p2[1]));

                return ((res1 < res2) ? -1 : ((res1 > res2) ? 1 : 0));
            },

            "fraccion-desc": function (c1, c2) {

                var p1 = c1.split("/");
                var res1 = parseFloat(parseInt(p1[0]) / parseInt(p1[1]));
                var p2 = c2.split("/");
                var res2 = parseFloat(parseInt(p2[0]) / parseInt(p2[1]));

                return ((res1 < res2) ? 1 : ((res1 > res2) ? -1 : 0));
            },

            "numeric-input-pre": function (a) {
                //var x = (a == "-") ? 0 : a.replace(/,/, ".");
                var c = $(a).val();
                if (!isNaN(c)) {
                    c = parseInt(c).toString();
                }
                return c;
            },

            "numeric-input-asc": function (a, b) {
                var c = $(a).val().replace('.', '');
                $(a).blur();
                return ((c < b) ? -1 : ((c > b) ? 1 : 0));
            },

            "numeric-input-desc": function (a, b) {
                var c = $(a).val().replace('.', '');
                $(a).blur();
                return ((c < b) ? 1 : ((c > b) ? -1 : 0));
            },
        });

        //$('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
        //    $($.fn.dataTable.tables(true)).DataTable()
        //       .columns.adjust()
        //       .responsive.recalc();
        //});

        //$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        //    $($.fn.dataTable.tables(true)).DataTable()
        //       .columns.adjust()
        //       .responsive.recalc();
        //});

        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            $($(".tab-pane .dataTable").toArray()).DataTable()
                .columns.adjust()
                .responsive.recalc();
        });

        $('body').on('mouseover', '.dataTable tbody tr', function () {
            $('[data-toggle="tooltip"]').tooltip({
                trigger: 'hover',
                html: true
            });
        });


        $.extend(true, $.fn.dataTable.defaults, {
            processing: false,
            responsive: true,
            deferRender: true,
            "language": lenguaje,
            "sPaginationType": ($(window).width() < 979) ? "numbers" : "full_numbers",
            "iDisplayLength": 10,
            "dom": "<'col-sm-6 hidden-xs'l><'col-sm-6 datatable-fix-alignment-filter'f>tip",
            "drawCallback": function (oSettings) {
                if ($(this[0]).find("td.dataTables_empty").length > 0)
                    $(this[0]).find("td").attr("colspan", oSettings.aoColumns.length);
            },
            "rowCallback": function (oSettings) {
                $(this).DataTable().columns.adjust().responsive.recalc();
            }
        });

    };

    var handleDateInput = function () {

        $(".date input").datepicker({
            language: "es",
            autoclose: true,
            clearBtn: true,
            startDate: "01/01/1900",
            keyboardNavigation: false,
            orientation: "bottom left"
        }).on('changeDate', function (ev) {
            var elem = $(this).find("input");
            if (elem.val() == "")
                elem.change();
        });

        $(".date input[type='text']").attr("readonly", "readonly");

        $(".date .input-group-addon").on("click", function () {
            $("#" + $(this).parent().find('input').attr("id")).datepicker('show');
        })

        //var fechaHoy = $(".menu-fecha").text()
        var fechaHoy = moment(moment.now()).format('DD/MM/YYYY');

        $(".dateHoy input").datepicker({
            language: "es",
            autoclose: true,
            clearBtn: true,
            keyboardNavigation: false,
            startDate: "01/01/1900",
            orientation: "bottom left",
            endDate: fechaHoy
        }).on('changeDate', function (ev) {
            var elem = $(this).find("input");
            if (elem.val() == "")
                elem.change();
        });

        $(".dateHoy input[type='text']").attr("readonly", "readonly");

        $(".dateHoy .input-group-addon").on("click", function () {
            $("#" + $(this).parent().find('input').attr("id")).datepicker('show');
        });

        $(".monthView input").datepicker({
            language: "es",
            orientation: "bottom left",
            format: "mm/yyyy",
            startView: "months",
            startDate: "01/1900",
            minViewMode: "months",
            keyboardNavigation: false,
            autoclose: true,
        });

        $(".monthView input[type='text']").attr("readonly", "readonly");

        $(".monthView .input-group-addon").on("click", function () {
            $("#" + $(this).parent().find('input').attr("id")).datepicker('show');
        })

        $(".yearView input").datepicker({
            language: "es",
            orientation: "bottom left",
            format: "yyyy",
            startView: "years",
            startDate: "1900",
            minViewMode: "years",
            keyboardNavigation: false,
            autoclose: true,
        });

        $(".yearView input[type='text']").attr("readonly", "readonly");

        $(".yearView .input-group-addon").on("click", function () {
            $("#" + $(this).parent().find('input').attr("id")).datepicker('show');
        })

        $(".dateRange.to input").datepicker({
            language: "es",
            format: 'dd/mm/yyyy',
            autoclose: true,
            clearBtn: true,
            startDate: "01/01/1900",
            keyboardNavigation: false,
            orientation: "bottom left",
            endDate: $("#" + $(".dateRange.to input").attr("from")).val()
        })
            .on('changeDate', function (selected) {
                var minDate = new Date(selected.dates.valueOf());
                if (selected.date !== undefined) {
                    $("#" + $(selected.currentTarget).attr("from")).datepicker('setStartDate', minDate);
                }
                else {
                    $("#" + $(selected.currentTarget).attr("from")).datepicker('setStartDate', "01/01/1900");
                }
            });

        $(".dateRange.from input").datepicker({
            language: "es",
            format: 'dd/mm/yyyy',
            autoclose: true,
            clearBtn: true,
            startDate: "01/01/1900",
            keyboardNavigation: false,
            orientation: "bottom left",
            startDate: $("#" + $(".dateRange.from input").attr("to")).val()
        })
            .on('changeDate', function (selected) {
                var maxDate = new Date(selected.dates.valueOf());
                if (selected.date !== undefined) {
                    $("#" + $(selected.currentTarget).attr("to")).datepicker('setEndDate', maxDate);
                }
                else {
                    $("#" + $(selected.currentTarget).attr("to")).datepicker('setEndDate', "");
                }
            });

        $(".dateRange .input-group-addon").on("click", function () {
            $("#" + $(this).parent().find('input').attr("id")).datepicker('show');
        })

        $(".dateRange input[type='text']").attr("readonly", "readonly");

        $('.calendario-full-ajustado').datepicker({
            language: "es",
            startDate: "01/01/1900",
            keyboardNavigation: false,
            clearBtn: true,
        });

    };

    /*  var handleTimePicker = function () {
          $('.timepicker').timepicker({
              template: 'dropdown',
              maxHours: 24,
              minuteStep: 5,
              showInputs: false,
              showSeconds: false,
              showMeridian: false,
              snapToStep: true
          });
  
          $('.timepicker').timepicker().on('show.timepicker', function (e) {
              //(e.currentTarget.value == "") ? $(this).timepicker('setTime', moment.parseZone(moment(e.timeStamp).format("MM/DD/YYYY HH:mm") + initApp.zonaHoraria).format("HH:mm")) : false;
              (e.currentTarget.value == "") ? $(this).timepicker('setTime', moment(moment.utc().format("MM/DD/YYYY HH:mm") + ((initApp.zonaHoraria.indexOf("-") == -1) ? initApp.zonaHoraria.replace("+", "-") : initApp.zonaHoraria.replace("-", "+"))).utc().format("HH:mm")) : false;
          });
  
      };
      */
    var handleGenericValidations = function () {

        $(document)
            //.unbind('keydown')
            .bind('keydown', function (event) {
                var doPrevent = false;
                var key = event.charCode || event.keyCode || 0;
                if (key == 8) {
                    var d = event.srcElement || event.target;
                    if ((d.tagName.toUpperCase() === 'INPUT' && (d.type.toUpperCase() === 'TEXT' || d.type.toUpperCase() === 'PASSWORD' ||
                        d.type.toUpperCase() === 'SEARCH' || d.type.toUpperCase() === 'FILE' || d.type.toUpperCase() === 'EMAIL'))
                        || d.tagName.toUpperCase() === 'TEXTAREA' || d.tagName.toUpperCase() === 'DIV' || d.tagName.toUpperCase() === 'NUMBER')
                        doPrevent = d.readOnly || d.disabled;
                    else
                        doPrevent = true;
                }
                if (doPrevent)
                    event.preventDefault();
            });

        $('input:text,textarea,input:password')
            //.unbind("keypress")
            .on("keypress", function (e) {
                var res = true;
                var key = e.charCode || e.keyCode || 0;
                if ($(this).hasClass('numero'))
                    res = NumericOnly(e, $(this), null);
                else if ($(this).hasClass('decimal'))
                    res = NumericOnly(e, $(this), ',');
                else if ($(this).hasClass('integer'))
                    res = NumericOnly(e, $(this), null);
                else if ($(this).hasClass('rut'))
                    res = RutOnly(e, $(this));
                else if ($(this).hasClass('mail')) {
                    var keychar = String.fromCharCode(key);
                    var regEx = /[A-Z0-9a-z@\-_\.]/;
                    var v_shiftKey = e.shiftKey;
                    console.log('2');
                    if (is_special_key(e))
                        res = true;
                    else
                        res = regEx.test(keychar);
                } else if ($(this).hasClass('input-full-trim'))
                    if (key == 32)
                        res = false;
                    else
                        res = true;
                if (res == true) {
                    console.log('3');
                    var v_ctrlKey = e.ctrlKey;
                    var v_shiftKey = e.shiftKey;
                    if (is_special_key(e))
                        res = true;
                    else
                        if (/\w<|>|;|\\|'|"|\$|\||</.test(String.fromCharCode(key)))
                            res = false;
                        else
                            res = true;

                }

                return res;
            });

        $('input:text,textarea,input:password')
            //.unbind("keyup")
            .on("keyup", function (e) {
                if ($(this).hasClass('key_search'))
                    $(this).trigger("blur");
                if ($(this).is("textarea"))
                    validarTextArea($(this));
            });

        $('input:text,textarea,input:password')
            //.unbind("change")
            .on("change", function () {

                validarTextBox(this);
            });

        $('input:text,textarea,input:password')
            //.unbind("paste")
            .on('paste', function (e) {
                var self = this;
                setTimeout(function (e) {
                    validarTextBox(self);
                }, 0);
            });

        $('.capitalize').each(function (i, val) {
            if ($(val).is("input")) {
                $(val).val($(val).val().capitalize(true));
            } else {
                $(val).html($(val).html().capitalize(true));
            }
        });

        var nclick = 0;
        $('.prevent_dblsubmit')
            .off("click")
            .on("click", function () {
                nclick = nclick + 1
                $(this).fadeTo(0, 0.5);
                if (nclick > 1) {
                    return false;
                }
            });

        $(".validaRut, .rut").on("keypress", function (e) {
            if ((e.which >= 45 && e.which <= 57 && e.which != 47) || e.which == 107 || e.which == 75)
                return true;
            else
                return false;
        });

        $(".validaRut").on("change, blur", function () {
            var val = validarRut(this.value);
            $(this).val(val.rutFormateado);
        });

        function validarRutChileno(el) {

            var input = $(el);

            var tmpstr = "";
            //if (!isNaN(input.val())) {
            //    input.val(Number(input.val().split("-").join("").split(".").join("")).toString());
            //}
            var intlargo = input.val();
            var dv = 0;
            var rut = "";
            if (parseInt(intlargo) != 0) {
                if (intlargo.length > 0) {
                    crut = intlargo;
                    largo = crut.length;
                    if (largo < 2) {
                        input.val("");
                        //showToast("Rut inválido", "info", "Validación", 0);
                        return false;
                    }
                    var chardv = '';
                    for (i = 0; i < crut.length; i++) {
                        if (crut.charAt(i) != ' ' && crut.charAt(i) != '.' && crut.charAt(i) != '-' && !isNaN(parseInt(crut.charAt(i)))) {
                            tmpstr = tmpstr + crut.charAt(i);
                        }
                        else if (crut.charAt(i).toUpperCase() == 'K') {
                            chardv = crut.charAt(i).toUpperCase();
                        }
                    }
                    tmpstr = Number(tmpstr).toString();
                    rut = tmpstr + chardv;
                    crut = tmpstr + chardv;
                    largo = crut.length;

                    if (largo > 2)
                        rut = crut.substring(0, largo - 1);
                    else
                        rut = crut.charAt(0);

                    dv = crut.charAt(largo - 1);

                    if (rut == null || dv == null)
                        return 0;

                    var dvr = '0';
                    suma = 0;
                    mul = 2;

                    for (i = rut.length - 1; i >= 0; i--) {
                        suma = suma + rut.charAt(i) * mul;
                        if (mul == 7)
                            mul = 2;
                        else
                            mul++;
                    }

                    res = suma % 11;
                    if (res == 1)
                        dvr = 'k';
                    else if (res == 0)
                        dvr = '0';
                    else {
                        dvi = 11 - res;
                        dvr = dvi + "";
                    }
                    if (dvr != dv.toLowerCase()) {
                        input.val("");
                        return false;
                    }
                    var rut_final = "";
                    var num = 0;
                    var val = rut.length;
                    while (val != 0) {
                        num++;
                        if (num == 3) {
                            rut_final = "." + rut[val - 1] + rut_final;
                            num = 0;
                        }
                        else
                            rut_final = rut[val - 1] + rut_final;
                        val--;
                    }
                    rut_final = rut_final + "-" + dv;
                    input.val(rut_final);
                    return true;
                }
            }
            else {
                input.val("");
                return false;
            }

        }

        function getCharFromKeyCode(e) {

            if (window.event) // IE
                keynum = e.keyCode;
            else (e.which)
            keynum = e.which;

            keychar = String.fromCharCode(keynum);
            return keychar;

        }

        var _to_ascii = {
            '188': '44',
            '109': '45',
            '190': '46',
            '191': '47',
            '192': '96',
            '220': '92',
            '222': '39',
            '221': '93',
            '219': '91',
            '173': '45',
            '187': '61', //IE Key codes
            '186': '59', //IE Key codes
            '189': '45'  //IE Key codes
        }

        var shiftUps = {
            "96": "~",
            "49": "!",
            "50": "@",
            "51": "#",
            "52": "$",
            "53": "%",
            "54": "^",
            "55": "&",
            "56": "*",
            "57": "(",
            "48": ")",
            "45": "_",
            "61": "+",
            "91": "{",
            "93": "}",
            "92": "|",
            "59": ":",
            "39": "\"",
            "44": "<",
            "46": ">",
            "47": "?"
        };

        function ValidaFecha(id) {
            var valorfecha = $("#" + id).val();

            if (valorfecha != "") {

                if (valorfecha.length == 10) {

                    valores = valorfecha.split("/");
                    if (valores.length == 3) {

                        var diasmes = 0;

                        if (valores[2].length != 4 || (valores[2] < 1900 && valores[2] != "00/00/0000")) {
                            $("#" + id).val("");
                            return false;
                        }

                        if (valores[1].length == 2) {
                            if (parseInt(valores[1]) < 1 || parseInt(valores[1]) > 12) {
                                $("#" + id).val("");
                                return false;
                            }
                            if (parseInt(valores[1]) == 1 || parseInt(valores[1]) == 3 || parseInt(valores[1]) == 5 || parseInt(valores[1]) == 7 || parseInt(valores[1]) == 8 || parseInt(valores[1]) == 10 || parseInt(valores[1]) == 12)
                                diasmes = 31;
                            if (parseInt(valores[1]) == 4 || parseInt(valores[1]) == 6 || parseInt(valores[1]) == 9 || parseInt(valores[1]) == 11)
                                diasmes = 30;
                            if (parseInt(valores[1]) == 2)
                                if ((parseInt(valores[2]) % 4 == 0) && ((parseInt(valores[2]) % 100 != 0) || (parseInt(valores[2]) % 400 == 0)))
                                    diasmes = 29;
                                else
                                    diasmes = 28;

                        }
                        else {
                            $("#" + id).val("");
                            return false;
                        }

                        if (valores[0].length == 2) {
                            if (parseInt(valores[0]) < 1 || parseInt(valores[0]) > diasmes) {
                                $("#" + id).val("");
                                return false;
                            }
                            else {
                                return true;
                            }
                        }
                        else {
                            $("#" + id).val("");
                            return false;
                        }

                    }
                    else {
                        $("#" + id).val("");
                        return false;
                    }
                }
                else {
                    $("#" + id).val("");
                    return false;
                }
            }

        }
        //funciones para validacion de textos
        $.fn.SinEspacios =
            function () {
                return this.each(function () {
                    $(this).keypress(function (e) {
                        var key = e.charCode || e.keyCode || 0;
                        // allow backspace, tab, delete, arrows, numbers and keypad numbers ONLY
                        if (key == 32) {
                            return false;
                        } else {
                            return true;
                        }
                    });
                });
            };

        function is_special_key(e) {
            var v_ctrlKey = e.ctrlKey;
            var v_shiftKey = e.shiftKey;
            var char = getCharFromKeyCode(e)
            var key = e.charCode || e.keyCode || 0;
            if (((key == 86 && v_ctrlKey) || /*Copia*/
                (key == 67 && v_ctrlKey) || /*Pega*/
                (key == 35) || /*Inicio*/
                (key == 36) || /*Fin*/
                (key == 35 && v_shiftKey) || /*SHIFT Inicio*/
                (key == 36 && v_shiftKey) || /*SHIFT Fin*/
                key == 13 || /*tecla enter*/
                key == 8 || /*backspace*/
                key == 9 || /*tab*/
                key == 37 || /*left arrow*/
                key == 38 || /*up arrow*/
                key == 39 || /*right arrow*/
                key == 40 || /*down arrow*/
                key == 46) /*delete*/
                && /[\x00-\x08\x0E-\x1F\x80-\xFF]/.test(char)/*si es un caracter unicode no imprimible*/
            ) {
                return true;
            } else {
                return false;
            }
        }

        function NumericOnly(e, elem, decimalChar) {
            var char = getCharFromKeyCode(e)
            var key = e.charCode || e.keyCode || 0;
            var v_ctrlKey = e.ctrlKey;
            var v_shiftKey = e.shiftKey;
            return (
                (is_special_key(e) || /*teclas especiales como tab, enter o flechas*/
                    /*Si decimalChar no es nulo y ademas el caracter presionado
                    Corresponde al punto decimal especificado, permitimos su ingreso
                    una sola vez*/
                    (char == decimalChar && decimalChar != null && elem.val().indexOf(decimalChar) < 0) ||
                    (key == 110 && decimalChar == "." && decimalChar != null && elem.val().indexOf(".") < 0) ||
                    (key >= 48 && key <= 57)  /*teclas del cero al nueve (numeric key pad)*/
                )
            );
        }

        function RutOnly(e, elem) {
            var guionChar = '-'
            var v_ctrlKey = e.ctrlKey;
            var v_shiftKey = e.shiftKey;
            var char = getCharFromKeyCode(e)
            var key = e.charCode || e.keyCode || 0;
            return (
                (
                    is_special_key(e) ||
                    /*Si guionChar no es nulo y ademas el caracter presionado
                    Corresponde al punto decimal especificado, permitimos su ingreso
                    una sola vez*/
                    (char == guionChar && guionChar != null && elem.val().indexOf(guionChar) < 0) ||
                    (char.toUpperCase() == 'K' && char != null && elem.val().toUpperCase().indexOf(char.toUpperCase()) < 0) ||
                    (key >= 48 && key <= 57) /*teclas del cero al nueve (numeric key pad)*/
                )
            );
        }


        //Función que calcula el dígito verificador de un Rut
        function obtener_dv(T) {
            var M = 0, S = 1;
            for (; T; T = Math.floor(T / 10))
                S = (S + T % 10 * (9 - M++ % 6)) % 11;
            return S ? S - 1 : 'k';
        }

        //Función para la validación de Rut
        function validaRut(p_rut_completo) {
            if (p_rut_completo != null || p_rut_completo == '') {
                var v_partes = p_rut_completo.split('-');
                if (v_partes.length == 2) {
                    var rut_texto = v_partes[0].replace(/\./g, '');
                    var rut_dv = v_partes[1];
                    if (obtener_dv(rut_texto) == rut_dv)
                        return true;
                    else
                        return false;
                }
                else
                    return false;
            } else
                return false;

        }

        //Permite agregar "leading zeros" o ceros al inicio de un texto.
        //recibe como parámetros el string y la cantidad máxima de caracteres
        function pad(str, max) {
            return str.length < max ? pad("0" + str, max) : str;
        }

        function CommentsMaxLength(text, maxLength) {
            text.value = text.value.substring(0, maxLength);
        }
        function validarCorreo(elemento) {
            var correo = document.getElementById('email').value;
            arroba = correo.indexOf("@");
            punto = correo.lastIndexOf(".");
            extension = correo.split(".")[1];

            if (arroba < 1 || (punto - arroba < 2) || correo === "") {
                alert("correo invalido");
            } else {
                if (extension.length > 3) {
                    alert("correo invalido");
                    return;
                }
                alert("correo valido");
            }
        }

        function validarEmail(email) {
            expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            if (!expr.test(email))
                return false;
            else
                return true;
        }

        //validar si se usan para bloquear campos
        function validarFormatoFecha(campo) {
            var RegExPattern = /^\d{1,2}\/\d{1,2}\/\d{2,4}$/;
            if ((campo.match(RegExPattern)) && (campo != '')) {
                return true;
            } else {
                return false;
            }
        }

        //validar si se usan para bloquear campos
        function existeFecha(fecha) {
            var fechaf = fecha.split("/");
            var day = fechaf[0];
            var month = fechaf[1];
            var year = fechaf[2];
            var date = new Date(year, month, '0');
            if ((day - 0) > (date.getDate() - 0)) {
                return false;
            }
            return true;
        }

        String.prototype.capitalize = function (lower) {
            return (lower ? this.toLowerCase() : this).replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase(); });
        };

        $.fn.setCursorToTextEnd = function () {
            this.focus();
            var $thisVal = this.val();
            this.val('').val($thisVal);
            return this;
        }

        function validarTextBox(el) {

            if ($(el).hasClass('numero'))
                validarNumero(el);
            if ($(el).hasClass('decimal'))
                validarDecimal(el);
            if ($(el).hasClass('integer'))
                validarInteger(el);
            if ($(el).hasClass('input-full-trim'))
                validarSinEspacio(el);
            if ($(el).hasClass('input-left-trim'))
                InputLeftTrim(el);
            if ($(el).hasClass('input-outer-trim'))
                inputOuterTrim(el);
            if ($(el).hasClass('validaFecha'))
                ValidaFecha(el.id);
            if ($(el).is("textarea"))
                validarTextArea(el);

            validarCaracterEspecial(el);

        }

        function validarCaracterEspecial(el) {
            $(el).val($(el).val().replace(/;|<|>|;|\\|'|"|\$|\||/g, ''));
        }

        function validarNumero(el) {
            $(el).val($(el).val().replace(/[^0-9]/g, ''));
        }

        function validarDecimal(el) {
            if ($(el).val() != "") {
                var valor_final = $(el).val();
                //Verificamos si tiene decimales
                if ($(el).val().indexOf(',') > -1) {
                    //Si tiene decimales, validamos que sea un número válido
                    var vargs = valor_final.split(',');
                    if (vargs.length == 2 && vargs[0] != "" && vargs[1] != "") {
                        vargs[0] = vargs[0].replace(/[^0-9]/g, ''); //eliminamos todos los registros no numericos
                        vargs[1] = vargs[1].replace(/[^0-9]/g, ''); //eliminamos todos los registros no numericos
                        if ($(el).data("precision_decimal") != null) {
                            //alert($(el).data("precision_decimal"));
                            try {
                                vargs[1] = vargs[1].substring(0, $(el).data("precision_decimal"));
                            } catch (e) {
                                vargs[1] = "";
                            }
                        }
                        valor_final = vargs[0] + ',' + vargs[1]
                    } else {
                        valor_final = "";
                    }
                } else {
                    //Si no tiene decimales, validamos que sea un número válido
                    valor_final = valor_final.replace(/[^0-9]/g, '');
                }
                $(el).val(valor_final);
            }
        }
        function validarInteger(el) {
            $(el).val($(el).val().replace(/[^0-9]/g, ''));
        }

        function validarSinEspacio(el) {
            $(el).val($(el).val().split(" ").join(""));
            //$(el).val($(el).val().replace(/^[ \t]+/, ""));
            $(el).val($(el).val().replace(/;| |/g, ''));
        }

        function InputLeftTrim(el) {
            $(el).val($(el).val().replace(/^\s+/, ""));
        }
        function inputOuterTrim(el) {
            $(el).val($.trim($(el).val()));
        }

        function validarTextArea(el) {
            var limit = parseInt($(el).attr('max-length'));
            var text = $(el).val();
            var chars = text.length;
            if (chars > limit) {
                var new_text = text.substr(0, limit);
                $(el).val(new_text);
            }
        }

    };

    var handleSettingsForm = function () {

        //var w = window.innerWidth
        //        || document.documentElement.clientWidth
        //        || document.body.clientWidth;

        //if (w <= 768 && w > 640) {
        //    $("#btnManipularMenu").click();
        //}

        $.ajaxPrefilter(function (opts, originalOpts, jqXHR) {

            var dfd = $.Deferred();

            jqXHR.done(function (res, a, q) {
                dfd.resolve();
            });

            jqXHR.fail(function (xhr, status, err) {
                var args = Array.prototype.slice.call(arguments);
                if (xhr.status === 401) {
                    window.location.href = $("#rutaRelativa").val();
                    throw '';
                }
                else {
                    dfd.rejectWith(xhr, args);
                    handleMensaje.mensajeError(xhr.statusText);
                }
            });

        });

        $.ajaxSetup({
            cache: false,
            async: true,

        });

        $(document).on("ajaxStart", function () {
            $("#page-loader").show();
        });

        $(document).on("ajaxError", function (event, jqxhr, ajaxOptions) {
            $("#page-loader").hide();
        });

        $(document).on("ajaxStop", function () {
            $("#page-loader").hide();
        });

        window.onerror = function errorHandler(msg, url, line) {
            $("#page-loader").hide();
            return false;
        }

        $("#page-loader").hide();

        var forms = $('form');
        $.each(forms, function (i, val) {
            val.reset();
        })

        var originalAddClassMethod = jQuery.fn.addClass;

        jQuery.fn.addClass = function () {
            // Execute the original method.
            var next = true;
            $.each(arguments, function (i, val) {
                if (val === "bv-tab-success" || val === "has-success")
                    next = false;
            });
            if (next)
                return originalAddClassMethod.apply(this, arguments);
        }

        $('form').bind("keypress", function (e) {
            if (e.keyCode == 13) {
                e.preventDefault();
                return false;
            }
        });

    };

    // handleDataTableSettings();
    //pageSetUp();
    // drawBreadCrumb();
    //  handleRenderSwitcher();
    handleDateInput();
    //  handleTimePicker();
    handleSettingsForm();
    handleGenericValidations();

}

var handleFunctions = function () {

    function GetLastDay(y, m) {
        return new Date(y, m + 1, 0).getDate();
    }

    function addRealMonth(d) {
        var fm = moment(d).add(-12, 'M');
        var fmEnd = moment(fm).endOf('month');
        return d.date() != fm.date() && fm.isSame(fmEnd.format('YYYY-MM-DD')) ? fm.add(1, 'd') : fm;
    }

    return {
        addRealMonth: addRealMonth,
        GetLastDay: GetLastDay
    }

}();

$(document).ready(function () {
    $(".texto").keyup(function (e) {
        var name = $(this).val();
        var dname_without_space = $(this).val();
        var name_without_special_char = dname_without_space.replace(/[^a-zA-ZÑñ ÁÉÍÓÚáéíóú#_() 0-9]+/g, "");
        $(this).val(name_without_special_char);
    });

    function validateEmail($email) {
        var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        console.log('1');
        return emailReg.test($email);
    }

    function isValidRUT(rut) {
        if (!rut | typeof rut !== 'string') return false;

        var regexp = /^\d{7,8}-[k|K|\d]{1}$/;
        return regexp.test(rut);
    }

    GeneralSettings();
});







