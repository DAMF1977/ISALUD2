using System.Collections.Generic;

namespace EL.Salidas
{
    public class CobroBono 
    {
        public List<BonoDetalle> BonosParaCobro { get; set; }
        public int? Code { get; set; }
        public string Description { get; set; }
    }

    public class BonoDetalle
    {
        public BonoDetalle() {
            Seleccionado = false;
        }

        public long? NumeroBono { get; set; }
        public long? RutPrestador { get; set; }
        public string FechaEmision { get; set; }
        public long? MontoACobrar { get; set; }
        public string UrlBono { get; set; }
        public long? NumeroPAM { get; set; }
        public long? NumeroCuentaMedica { get; set; }
        public bool? Seleccionado { get; set; }
    }
}
