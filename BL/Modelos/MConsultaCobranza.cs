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

namespace BL.Modelos
{
    public class MConsultaCobranza
    {
        public MConsultaCobranza()
        { 
        
        }

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


        public Respuesta CargarGrilla(DtoConsultaCobranza param)
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
                var data = JsonConvert.DeserializeObject<ConsultaCobranza>(Response.Content);
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
            else {
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
    }
}
