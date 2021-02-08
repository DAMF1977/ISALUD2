using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Configuration;
using System.Net;
using Newtonsoft.Json;
using EL.Salidas;
using EL.Entradas;
using System.Web.Script.Serialization;
using System.IO;
using ClosedXML.Excel;
using DocumentFormat.OpenXml.Packaging;

namespace BL.Modelos
{
    public class MCobroFactura
    {
        public List<int> ConsultaPrestadores()
        {
            List<int> Respuesta = new List<int>();

            var urlService = ConfigurationManager.ConnectionStrings["webAPI"].ConnectionString;
            RestClient Client = new RestClient(urlService);
            Client.Timeout = 600000; // 10 minutos

            var param = new Dictionary<string, object>() { { "Rut", "70905700" } };
;
            string Json_Obj = JsonConvert.SerializeObject(param);
            RestRequest Request = new RestRequest("api/pagoprestadores/consultadatosprestadores", Method.POST, DataFormat.Json);
            Request.AddParameter("application/json", Json_Obj, ParameterType.RequestBody);

            var session = (DtoSessionUsuario)MSession.ReturnSessionObject();
            Request.AddHeader("Authorization", String.Format("Bearer {0}", session.TokenJWT));

            var Response = Client.Post(Request);

            if (Response.StatusCode == HttpStatusCode.OK)
            {
                var serializer = new JavaScriptSerializer();
                serializer.MaxJsonLength = 500000000;
                var data = serializer.Deserialize<PrestadoresFacturas>(Response.Content);
                if (data.Code == 0)
                {
                    Respuesta = data.Prestadores.Select(x => x.Rut.Value).ToList();
                }
            }

            return Respuesta;
        }

        public Respuesta ConsultaFacturas(DtoCobroFactura param)
        {
            Respuesta Respuesta = new Respuesta();

            var prestadores = ConsultaPrestadores();
            param.ListaRut = prestadores;

            var urlService = ConfigurationManager.ConnectionStrings["webAPI2"].ConnectionString;
            RestClient Client = new RestClient(urlService);

            string Json_Obj = JsonConvert.SerializeObject(param);
            RestRequest Request = new RestRequest("ObtenerDTProceso", Method.POST, DataFormat.Json);
            Request.AddParameter("application/json", Json_Obj, ParameterType.RequestBody);

            var Response = Client.Post(Request);

            if (Response.StatusCode == HttpStatusCode.OK)
            {
                var data = JsonConvert.DeserializeObject<CobroFactura>(Response.Content);
                if (data.Codigo == 0)
                {
                    Respuesta.Elemento = data.Lista;
                }
                else
                {
                    Respuesta.Resultado = false;
                    Respuesta.Mensaje = "No se encontraron registros";
                }
            }
            else
            {
                Respuesta.EsError = true;
                Respuesta.Resultado = false;
                Respuesta.Mensaje = String.Format("Ha ocurrido un error en la solicitud: {0}", Response.ErrorMessage);
            }

            return Respuesta;
        }

        public Respuesta ConsultaBonosParaCobro(DtoCobroBono param)
        {
            Respuesta Respuesta = new Respuesta();

            var urlService = ConfigurationManager.ConnectionStrings["webAPI"].ConnectionString;
            RestClient Client = new RestClient(urlService);
            Client.Timeout = 600000; // 10 minutos

            string Json_Obj = JsonConvert.SerializeObject(param);
            RestRequest Request = new RestRequest("api/pagoprestadores/getbonosparacobro", Method.POST, DataFormat.Json);
            Request.AddParameter("application/json", Json_Obj, ParameterType.RequestBody);

            var session = (DtoSessionUsuario)MSession.ReturnSessionObject();
            Request.AddHeader("Authorization", String.Format("Bearer {0}", session.TokenJWT));

            var Response = Client.Post(Request);

            if (Response.StatusCode == HttpStatusCode.OK)
            {
                var serializer = new JavaScriptSerializer();
                serializer.MaxJsonLength = 500000000;
                var data = serializer.Deserialize<CobroBono>(Response.Content);
                if (data.Code == 0)
                {
                    Respuesta.Elemento = data.BonosParaCobro;
                }
                else
                {
                    Respuesta.Resultado = false;
                    Respuesta.Mensaje = "No se encontraron registros";
                }
            }
            else
            {
                Respuesta.EsError = true;
                Respuesta.Resultado = false;
                Respuesta.Mensaje = String.Format("Ha ocurrido un error en la solicitud: {0}", Response.ErrorMessage);
            }

            return Respuesta;
        }

        public Respuesta ConsultaBonosParaCobroAdicional(DtoCobroBonoAdicional param)
        {
            Respuesta Respuesta = new Respuesta();

            var urlService = ConfigurationManager.ConnectionStrings["webAPI"].ConnectionString;
            RestClient Client = new RestClient(urlService);
            Client.Timeout = 600000; // 10 minutos

            string Json_Obj = JsonConvert.SerializeObject(param);
            RestRequest Request = new RestRequest("api/pagoprestadores/getbonosparacobroadicional", Method.POST, DataFormat.Json);
            Request.AddParameter("application/json", Json_Obj, ParameterType.RequestBody);

            var session = (DtoSessionUsuario)MSession.ReturnSessionObject();
            Request.AddHeader("Authorization", String.Format("Bearer {0}", session.TokenJWT));

            var Response = Client.Post(Request);

            if (Response.StatusCode == HttpStatusCode.OK)
            {
                var serializer = new JavaScriptSerializer();
                serializer.MaxJsonLength = 500000000;
                var data = serializer.Deserialize<CobroBono>(Response.Content);
                if (data.Code == 0)
                {
                    Respuesta.Elemento = data.BonosParaCobro;
                }
                else
                {
                    Respuesta.Resultado = false;
                    Respuesta.Mensaje = data.Description;
                }
            }
            else
            {
                Respuesta.EsError = true;
                Respuesta.Resultado = false;
                Respuesta.Mensaje = String.Format("Ha ocurrido un error en la solicitud: {0}", Response.ErrorMessage);
            }

            return Respuesta;
        }

        public Respuesta CobrarFacturaBonos(DtoCobrarFacturaBonos param)
        {
            Respuesta Respuesta = new Respuesta();

            var urlService = ConfigurationManager.ConnectionStrings["webAPI2"].ConnectionString;
            RestClient Client = new RestClient(urlService);

            string Json_Obj = JsonConvert.SerializeObject(param);
            RestRequest Request = new RestRequest("GrabarDTBonos", Method.POST, DataFormat.Json);
            Request.AddParameter("application/json", Json_Obj, ParameterType.RequestBody);

            var Response = Client.Post(Request);

            if (Response.StatusCode == HttpStatusCode.OK)
            {
                var data = JsonConvert.DeserializeObject<CobroFacturaBonos>(Response.Content);
                if (data.Codigo == 0)
                {
                    Respuesta.Elemento = data.NumeroPectra;
                }
                else
                {
                    Respuesta.Resultado = false;
                    Respuesta.Mensaje = data.Mensaje;
                }
            }
            else
            {
                Respuesta.EsError = true;
                Respuesta.Resultado = false;
                Respuesta.Mensaje = String.Format("Ha ocurrido un error en la solicitud: {0}", Response.ErrorMessage);
            }

            return Respuesta;
        }

        public string ObtieneBonosExcel(string filePath)
        {
            string NumerosBonos = null;

            SpreadsheetDocument myDoc = SpreadsheetDocument.Open(filePath, false);
            WorkbookPart workbookPart = myDoc.WorkbookPart;
            IEnumerable<WorksheetPart> worksheetPart = workbookPart.WorksheetParts;

            if (worksheetPart.Count<WorksheetPart>() > 0)
            {
                myDoc.Close();
                using (var excelWorkbook = new XLWorkbook(filePath))
                {
                    IXLWorksheet WoorkSheet = excelWorkbook.Worksheets.FirstOrDefault();
                    if (WoorkSheet != null)
                    {
                        var ListadoBonos = new List<string>();

                        IEnumerable<IXLRow> DataRows = WoorkSheet.RowsUsed().Skip(1);
                        foreach (IXLRow row in DataRows)
                        {
                            ListadoBonos.Add(row.Cell(1).Value.ToString());
                        }

                        NumerosBonos = string.Join(";", ListadoBonos.ToArray());
                    }

                    if (File.Exists(filePath)) File.Delete(filePath);
                }
            }
            else
            {
                myDoc.Close();
                if (File.Exists(filePath)) File.Delete(filePath);
            }

            return NumerosBonos;
        }

        public Respuesta CobrarFacturaBonosCuentaMedica(DtoCobroFacturaCtaMedica param)
        {
            Respuesta Respuesta = new Respuesta();

            var urlService = ConfigurationManager.ConnectionStrings["webAPI2"].ConnectionString;
            RestClient Client = new RestClient(urlService);

            string Json_Obj = JsonConvert.SerializeObject(param);
            RestRequest Request = new RestRequest("GrabarDTCuentaMedica", Method.POST, DataFormat.Json);
            Request.AddParameter("application/json", Json_Obj, ParameterType.RequestBody);

            var Response = Client.Post(Request);

            if (Response.StatusCode == HttpStatusCode.OK)
            {
                var data = JsonConvert.DeserializeObject<CobroFacturaBonos>(Response.Content);
                if (data.Codigo == 0)
                {
                    Respuesta.Elemento = data.NumeroPectra;
                }
                else
                {
                    Respuesta.Resultado = false;
                    Respuesta.Mensaje = data.Mensaje;
                }
            }
            else
            {
                Respuesta.EsError = true;
                Respuesta.Resultado = false;
                Respuesta.Mensaje = String.Format("Ha ocurrido un error en la solicitud: {0}", Response.ErrorMessage);
            }

            return Respuesta;
        }

        public Respuesta GeneraEnvioDocumentosCuentaMedica(List<DtoCuentaMedicaDocumento> lista)
        {
            Respuesta Respuesta = new Respuesta();
            var listaResults = new List<Dictionary<string, object>>();
            foreach (var item in lista)
            {
                Respuesta result = EnviarDocumentoCuentaMedica(item);
                listaResults.Add(new Dictionary<string, object>() {
                    { "ESTADO", (result.Resultado) ? "OK" : "ERROR" },
                    { "DESCRIPCION", (result.Resultado) ? "" : result.Mensaje }
                });
            }

            return Respuesta;
        }

        private Respuesta EnviarDocumentoCuentaMedica(DtoCuentaMedicaDocumento param)
        {
            Respuesta Respuesta = new Respuesta();

            var urlService = ConfigurationManager.ConnectionStrings["webAPI2"].ConnectionString;
            RestClient Client = new RestClient(urlService);

            string parametros = string.Format("RutPrestador={0}&TipoDocumento={1}&FolioDT={2}&TipoDT={3}&UltimoDocumento={4}",
                                param.RutPrestador, param.TipoDocumento, param.FolioDT, param.TipoDT, param.UltimoDocumento);

            string Callback = string.Format("GrabarDTCuentaMedicaDocumento?{0}", parametros);
            RestRequest Request = new RestRequest(Callback, Method.POST, DataFormat.Json);
            Request.AddParameter("application/pdf", param.Archivo, ParameterType.RequestBody);

            var Response = Client.Post(Request);

            if (Response.StatusCode == HttpStatusCode.OK)
            {
                var data = JsonConvert.DeserializeObject<CargaDocumento>(Response.Content);
                if (data.Codigo == 0)
                {
                    Respuesta.Mensaje = data.Mensaje;
                }
                else
                {
                    Respuesta.Resultado = false;
                    Respuesta.Mensaje = data.Mensaje;
                }
            }
            else
            {
                Respuesta.EsError = true;
                Respuesta.Resultado = false;
                Respuesta.Mensaje = String.Format("Ha ocurrido un error en la solicitud: {0}", Response.ErrorMessage);
            }

            return Respuesta;
        }

        public Respuesta ObtieneFacturaPDF(DtoFacturaPDF param)
        {
            Respuesta Respuesta = new Respuesta();

            var urlService = ConfigurationManager.ConnectionStrings["webAPI2"].ConnectionString;
            RestClient Client = new RestClient(urlService);

            string Json_Obj = JsonConvert.SerializeObject(param);
            RestRequest Request = new RestRequest("ObtenerPDF", Method.POST, DataFormat.Json);
            Request.AddParameter("application/json", Json_Obj, ParameterType.RequestBody);

            var Response = Client.Post(Request);

            if (Response.StatusCode == HttpStatusCode.OK)
            {
                var data = JsonConvert.DeserializeObject<FacturaPDF>(Response.Content);
                if (data.Codigo == 0)
                {
                    Respuesta.Elemento = data.ArchvioBase64;
                }
                else
                {
                    Respuesta.Resultado = false;
                    Respuesta.Mensaje = data.Mensaje;
                }
            }
            else
            {
                Respuesta.EsError = true;
                Respuesta.Resultado = false;
                Respuesta.Mensaje = String.Format("Ha ocurrido un error en la solicitud: {0}", Response.ErrorMessage);
            }

            return Respuesta;
        }
    }
}
