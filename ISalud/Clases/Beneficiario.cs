using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ISalud.Clases
{
    public class Beneficiario
    {
        public string RutBeneficiario { get; set; }
        public string TipoBeneficiario { get; set; }
        public int Rut { get; set; }
        public string Dv { get; set; }
        public string RutCompleto { get; set; }
        public int IsapreId { get; set; }
        public string Isapre { get; set; }
        public int IdAfiliado { get; set; }
        public int Correlativo { get; set; }
        public string Nombre { get; set; }
        public string Direccion { get; set; }
        public string Ciudad { get; set; }
        public string Comuna { get; set; }
        public string Fono1 { get; set; }
        public string Fono2 { get; set; }
        public string Fono3 { get; set; }
        public string Celular { get; set; }
        public string Email { get; set; }
        public string FechaNacimiento { get; set; }
        public string Sexo { get; set; }
        public string PlanCodigo { get; set; }
        public string PlanGlosa { get; set; }
        public string PlanCosto { get; set; }
        public string PlanCostoGES { get; set; }
        public string PlanValor { get; set; }
        public string RutAfiliado { get; set; }
        public string Empleadores { get; set; }
        public string Cargas { get; set; }
        public string Tipo { get; set; }
        public string InicioVigencia { get; set; }
        public int Code { get; set; }
        public string Description { get; set; }
    }

}