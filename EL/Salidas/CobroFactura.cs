using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EL.Salidas
{
    public class CobroFactura
    {
        public long? Codigo { get; set; }
        public List<Factura> Lista { get; set; }
        public string Mensaje { get; set; }
    }

    public class Factura 
    {
        public ComprobanteEgreso ComprobanteEgreso { get; set; }

        public string DV { get; set; }
        public string DescripcionTipoDT { get; set; }
        public long? Descuento { get; set; }
        public object Estado { get; set; }
        public string FechaEmision { get; set; }
        public long? FolioDT { get; set; }
        public long? IVA { get; set; }
        public long? IdNroCaso { get; set; }
        public long? MontoAfecto { get; set; }
        public long? MontoExento { get; set; }
        public long? MontoTotal { get; set; }
        public string RazonSocial { get; set; }
        public string RutPrestador { get; set; }
        public int? TipoDT { get; set; }
    }

    public class ComprobanteEgreso 
    {
        public object FechaPago { get; set; }
        public object Formapago { get; set; }
        public long? MontoPago { get; set; }
        public long? NComprobante { get; set; }
    }
}
