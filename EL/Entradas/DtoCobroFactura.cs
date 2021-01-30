using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EL.Entradas
{
    public class DtoCobroFactura
    {
        public DtoCobroFactura() 
        {
            ListaRut = new List<int>() { 70905700, 78394040 };
            Estado = 1;
            //TipoCobro = 3;
            //NroCobranza = 0;
        }

        public List<int> ListaRut { get; set; }
        public long? Estado { get; set; }
        public string FechaInicio { get; set; }
        public string FechaTermino { get; set; }
        public long? NroFactura { get; set; }
        //public long? TipoCobro { get; set; }
        //public long? NroCobranza { get; set; }
    }
}
