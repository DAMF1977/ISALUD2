using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EL.Salidas
{
   public  class ConsultaCobranza
    {
        public long Codigo { get; set; }
        public List<Lista> Lista { get; set; }
        public string Mensaje { get; set; }
    }




    public class Lista
    {
        public ComprobanteEgreso ComprobanteEgreso { get; set; }
        public string DV { get; set; }
        public string DescripcionTipoDT { get; set; }
        public long Descuento { get; set; }
        public long EstadoDT { get; set; }
        public string FechaCobranza { get; set; }
        public string FechaEmision { get; set; }
        public long FolioDT { get; set; }
        public long IVA { get; set; }
        public long IdNroCaso { get; set; }
        public long MontoAfecto { get; set; }
        public long MontoExento { get; set; }
        public long MontoTotal { get; set; }
        public string RazonSocial { get; set; }
        public long RutPrestador { get; set; }
        public long TipoDT { get; set; }
    }

}
