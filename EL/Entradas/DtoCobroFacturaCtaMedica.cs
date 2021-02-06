namespace EL.Entradas
{
    public class DtoCobroFacturaCtaMedica
    {
        public DtoFacturaCtaMedica TipoDT { get; set; }

        public DtoDataCtaMedica CuentaMedica { get; set; }
    }

    public class DtoFacturaCtaMedica 
    {
        public int? RutPrestador { get; set; }
        public string DV { get; set; }
        public int? FolioDT { get; set; }
        public int? TipoDT { get; set; }
    }

    public class DtoDataCtaMedica
    {
        public int? RutBeneficiario { get; set; }
        public int? NumeroCaso { get; set; }
        public int? NumeroCuentaMedica { get; set; }
        public long? TotalCuenta { get; set; }
    }
}
