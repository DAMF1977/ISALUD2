$(function () {

    handlePagesStates.init();

});

var handlePagesStates = function () {

    function init() {

        var objFiltro = handleGetFiltroCobro();
        console.log(objFiltro);
        if (objFiltro != null) {
            $('#lblNroFacturaExito').text(objFiltro.NroFactura);
            if (objFiltro.TipoCobro == 'bono')
                $('#lblTipoCobroExito').text('Bono');
            else {
                if (objFiltro.TipoCobro == 'archivo')
                    $('#lblTipoCobroExito').text('Archivo');
                else
                    $('#lblTipoCobroExito').text('Cuenta médica');
            }
            $('#lblFechaCobroExito').text(moment().format(Global.FormatoFecha));
            $('#lblMontoCobroExito').text(handleFormato.formatNumber.new(objFiltro.ValorFactura));
        }

    }

    function handleGetFiltroCobro() {
        var value = localStorage.getItem('objFiltro');
        if (IsNull(value) == null)
            return null
        else
            return $.parseJSON(value);
    }

    return {
        init: init
    }

}();