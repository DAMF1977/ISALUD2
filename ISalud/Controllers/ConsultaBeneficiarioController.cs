using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using ISalud.App_Start;
using ISalud.Clases;
using Newtonsoft.Json;
using RestSharp;

namespace ISalud.Controllers
{
    public class ConsultaBeneficiarioController : Controller
    {
        RestClient Client = new RestClient(System.Configuration.ConfigurationManager.ConnectionStrings["webAPI"].ConnectionString);

        public ActionResult Index()
        {
            return View();
        }



        public ActionResult Get(Beneficiario Beneficiario)
        {
            try
            {
                //Banco.PAIS_ID = Session["PAIS"].ToString();
                //Banco.BCO_VIGENTE = Banco.BCO_VIGENTE.Trim();

                string Json_Obj = JsonConvert.SerializeObject(Beneficiario);
                RestRequest request = new RestRequest("api/pagoprestadores/consultadatosbeneficiarios", Method.POST, DataFormat.Json);
                request.AddHeader("Authorization", Session["AUTH"].ToString());
                request.AddParameter("application/json", Json_Obj, ParameterType.RequestBody);

                var Resp = Client.Post(request);
                if (Resp.StatusCode == HttpStatusCode.OK)
                {
                    Beneficiario Result = new Beneficiario ();
                    var jsonSerializerSettings = new JsonSerializerSettings();
                    //jsonSerializerSettings.MissingMemberHandling = MissingMemberHandling.Ignore;


                    Result = JsonConvert.DeserializeObject<Beneficiario>(Resp.Content);
                    //Result = JsonConvert.DeserializeObject<List<Beneficiario>>(Resp.Content);

                    return Json(new { aaData = Result }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    throw new Exception("Error al cargar beneficiario");
                }

            }
            catch (Exception e)
            {
                ContentResult resp = Content(e.Message);
                HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return resp;
            }
        }
    }
}