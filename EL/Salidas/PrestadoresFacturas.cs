using System.Collections.Generic;

namespace EL.Salidas
{
    public class PrestadoresFacturas
    {
        public List<Prestador> Prestadores { get; set; }
        public int? Code { get; set; }
        public string Description { get; set; }
    }

    public class Prestador 
    {
        public int? Rut { get; set; }
        public string DV { get; set; }
        public string RazonSocial { get; set; }
        public string Mail { get; set; }
    }
}
