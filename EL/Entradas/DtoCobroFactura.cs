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
            Estado = 1;
        }

        public List<int> ListaRut { get; set; }
        public long? Estado { get; set; }
        public string FechaInicio { get; set; }
        public string FechaTermino { get; set; }
        public long? NroFactura { get; set; }
    }
}
