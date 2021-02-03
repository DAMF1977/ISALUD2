using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
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
        public MCobroFactura()
        {

        }

        public List<int> ConsultaRutPrestadores()
        {
            var lista = new List<int>() { 60910000,
                                        61101086,
                                        70905700,
                                        76105383,
                                        76106530,
                                        76120722,
                                        76160580,
                                        76189020,
                                        76683055,
                                        76687017,
                                        76751280,
                                        77200240,
                                        77237150,
                                        77305870,
                                        78040520,
                                        78350440,
                                        78454810,
                                        79576810,
                                        90753000,
                                        96513980,
                                        99533790,
                                        99537800,
                                        99573490 };

            return lista;
        }

        public Respuesta ConsultaFacturas(DtoCobroFactura param)
        {
            Respuesta Respuesta = new Respuesta();

            param.ListaRut = ConsultaRutPrestadores();

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
    }
}
