using System.Collections.Generic;

namespace EL.Entradas
{
    public class DtoCobrarFacturaBonos
    {
        public DtoBono DTBono { get; set; }
    }

    public class DtoBono 
    {
        public long? RutPrestador { get; set; }
        public string Nombre { get; set; }
        public string DV { get; set; }
        public long? FolioDT { get; set; }
        public int? TipoDT { get; set; }
        public int? TipoCobro { get; set; }
        public long? Valor { get; set; }
        public List<DtoBonoDetalle> Bonos { get; set; }
    }

    public class DtoBonoDetalle
    {
        public long? Folio { get; set; }
        public long? Valor { get; set; }
        public string Fecha { get; set; }
    }
}
