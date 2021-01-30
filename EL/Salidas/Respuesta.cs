using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EL.Salidas
{
    public class Respuesta
    {
        public Respuesta() 
        {
            EsError = false;
            Resultado = true;
        }

        public bool EsError { get; set; }
        public bool Resultado { get; set; }
        public string Mensaje { get; set; }
        public object Elemento { get; set; }
    }
}
