$(function () {
    localStorage.clear();
});

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


    CargarToken();


    //Funciones
    function CargarToken() {
    
        var _Data = {
            "Usuario": "aerus",
            "Clave": "hr5Up721op",
            "Servicio": "consultadatosprestadores"
        }
        var v_url = "Home/Ingresar";
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